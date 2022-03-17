<template>
  <div class="note-container">
    <div class="doc-main">
      <div class="name" @input="onNameInput($event)" contenteditable="true">{{ content.name }}</div>
      <div class="content">
        <div class="note-node" v-for="node in noteList" :key="node.id">
          <div class="indent" v-for="i in node.level" :key="`${index}-${i}`" />
          <div class="node-content">
            <div
              class="action-wrapper"
              @click="toggleCollapse(node.id)"
              v-if="node.children.length || node._children.length ">
              <svg-icon icon="triangle" :class="`${node.collapsed ? 'icon-collapsed' : ''}`"/>
            </div>
            <div class="bullet-wrapper">
              <div class="bullet" />
            </div>
            <div
              :id="`note-node-${node.id}`"
              class="text-wrapper"
              contenteditable="true"
              @input="onNodeInput($event, node)"
              @keydown="onKeyDown($event, node)">
              {{ node.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, nextTick, ref } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { debounce } from '@/hooks/utils'
import { flatter, updateTab, moveToLastFocus } from '@/hooks/useNote'
import '@/assets/pic/triangle.svg'

export default defineComponent({
  name: 'Note',
  components: {
    SvgIcon
  },
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  setup (props, context) {
    const noteList = ref(flatter(props.content.noteList))
    const originData = ref(props.content.noteList)
    const contentName = ref(props.content.name)
    onMounted(() => {
    })
    onUnmounted(() => {
      document.onkeydown = undefined
    })
    const emitUpdate = () => {
      context.emit('update:content', {
        name: contentName.value,
        noteList: originData.value
      })
    }
    const toggleCollapse = _id => {
      const flatList = []
      const iter = list => {
        if (!list || !list.length) return
        for (const v of list) {
          if (v.id === _id) {
            if (v.collapsed) v.collapsed = false
            else {
              v.collapsed = true
            }
            [v.children, v._children] = [v._children, v.children]
          }
          flatList.push(v)
          iter(v.children)
        }
      }
      iter(originData.value)
      noteList.value = flatList
      emitUpdate()
    }
    const addNewNode = (node, event) => {
      event.preventDefault()
      let newId = ''
      const addBrother = (node, list) => {
        if (!list || !list.length) return
        for (const i in list) {
          if (list[i].id === node.id) {
            newId = `${node.pId}-${list.length}`
            // ! 大坑：【for in】得到的数组下标是字符串形式的 typeof i == string
            list.splice(Number(i) + 1, 0, {
              name: '',
              collapsed: false,
              level: node.level,
              id: newId,
              pId: node.pId,
              _children: [],
              children: []
            })
            break
          } else {
            addBrother(node, list[i].children)
          }
        }
      }
      const addChild = (node, list) => {
        if (!list || !list.length) return
        for (const n of list) {
          if (n.id === node.id) {
            newId = `${n.id}-${n.children.length}`
            n.children.splice(0, 0, {
              name: '',
              collapsed: false,
              level: node.level + 1,
              id: newId,
              pId: n.id,
              _children: [],
              children: []
            })
            break
          } else {
            addChild(node, n.children)
          }
        }
      }
      if (node.children.length) {
        // 代表该节点现在有子节点且处于展开状态
        addChild(node, originData.value)
      } else {
        // 代表该节点没有子节点或者处于折叠状态
        addBrother(node, originData.value)
      }
      noteList.value = flatter(originData.value)
      nextTick(() => {
        document.getElementById(`note-node-${newId}`).focus()
      })
      emitUpdate()
    }
    const deleteNode = (node, event) => {
      // 节点文字删除完毕才删除此节点
      if (event.target.innerText !== '') return false
      event.preventDefault()
      let lastNode = null
      // 找到上一个节点 方便聚焦
      for (const i in noteList.value) {
        if (noteList.value[i].id === node.id) {
          // ! 有问题 => noteList.value[1]
          lastNode = i === '0' ? noteList.value[1] : noteList.value[i - 1]
        }
      }
      const findAndDelete = list => {
        if (!list || !list.length) return
        for (const i in list) {
          if (list[i].id === node.id) {
            list.splice(i, 1)
            break
          } else {
            findAndDelete(list[i].children)
          }
        }
      }
      // TODO 删光了怎么办
      findAndDelete(originData.value)
      noteList.value = flatter(originData.value)
      nextTick(() => {
        // 上一个节点自动获得光标 并将光标移动到最后的位置
        moveToLastFocus(`note-node-${lastNode.id}`)
      })
      emitUpdate()
    }
    const tabNode = (node, event) => {
      event.preventDefault()
      // 首先要找到此节点
      const findAndTab = list => {
        if (!list || !list.length) return
        for (const i in list) {
          if (list[i].id === node.id) {
            const index = Number(i)
            if (index !== 0) {
              // 不是第一个子节点 可以tab成它的兄弟的子节点
              // 首先如果兄弟节点折叠了 那么打开
              if (list[index - 1]._children.length) {
                [list[index - 1]._children, list[index - 1].children] = [list[index - 1].children, list[index - 1]._children]
              }
              // 兄弟节点没折叠或者没子节点
              // TODO 首先要更新当前节点的数据：[pId, id, level, children的[pId, id, level]]
              const _node = list[index]
              _node.pId = list[index - 1].id
              _node.id = `${list[index - 1].id}-${list[index - 1].children.length + 1}`
              _node.level = _node.level + 1
              const updatedNode = updateTab(_node)
              // 原层级要删除当前节点
              list.splice(index, 1)
              // 添加
              list[index - 1].children.push(updatedNode)
            }
            break
          } else {
            findAndTab(list[i].children)
          }
        }
      }
      findAndTab(originData.value)
      noteList.value = flatter(originData.value)
      emitUpdate()
    }
    const onKeyDown = (event, node) => {
      switch (event.keyCode) {
        case 13:
          // 回车键处理逻辑
          addNewNode(node, event)
          break
        case 8:
          // BackSpace键处理逻辑
          deleteNode(node, event)
          break
        case 9:
          // Tab键处理逻辑
          tabNode(node, event)
          break
        default:
          break
      }
    }

    const onNodeInput = debounce((event, node) => {
      const newText = event.target.innerText
      const update = list => {
        if (!list || !list.length) return
        for (const n of list) {
          if (n.id === node.id) {
            n.name = newText
          } else {
            update(n.children)
          }
        }
      }
      update(originData.value)
      emitUpdate()
    }, 1000)
    const onNameInput = debounce((event) => {
      console.log('onNameInput', event.target.innerText)
      contentName.value = event.target.innerText
      emitUpdate()
    }, 1000)
    return {
      noteList,
      contentName,
      toggleCollapse,
      onKeyDown,
      onNodeInput,
      onNameInput
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../assets/css/mixin';
.note-container {
  @include wh100;
  overflow-y: auto;
  .doc-main {
    max-width: 872px;
    min-height: calc(100vh - 252px);
    padding: 0 55px 140px;
    margin: 0 auto;
    .name {
      min-height: 42px;
      color: #16181a;
      font-size: 34px;
      font-weight: 600;
      line-height: 48px;
      padding: 62px 0 0;
      margin-bottom: 27px;
      user-select: text;
      word-wrap: break-word;
      -webkit-nbsp-mode: space;
      box-sizing: content-box;
      cursor: text;
      outline: 0;
      white-space: pre-wrap;
    }
    .content {
      width: 100%;
      @include vertFlex;
      align-items: center;
      .note-node {
        width: 100%;
        @include horiFlex;
        align-items: center;
        transition: .1s all;
        transition-timing-function: cubic-bezier(0.3, 1.02, 0.68, 1.01);
        .indent {
          width: 26px;
          height: 34px;
          padding-left: 1px;
          box-sizing: border-box;
          border-left: 1px solid #dee0e3;
          transform: translateX(8px);
        }
        &:hover {
          .node-content {
            .action-wrapper {
              display: flex;
            }
          }
        }
        .node-content {
          position: relative;
          flex: 1;
          @include horiFlex;
          align-items: center;
          .action-wrapper {
            @include centerFlex;
            /* display: none; */
            z-index: 2;
            position: absolute;
            top: 0;
            left: -33px;
            width: 30px;
            height: 30px;
            cursor: pointer;
            background: #fff;
            .icon-collapsed {
              transform: rotate(-90deg);
            }
            svg {
              width: 12px;
              height: 12px;
              transition: .2s ease all;
            }
          }
          .bullet-wrapper {
            width: 18px;
            height: 18px;
            @include centerFlex;
            .bullet {
              width: 6px;
              height: 6px;
              background-color: #646a73;
              border-radius: 3px;
            }
          }
          .text-wrapper {
            flex: 1;
            height: 30px;
            box-sizing: border-box;
            padding: 2px 0 2px 8px;
            line-height: 26px;
            color: #1d1d1f;
            min-height: 24px;
            font-size: 16px;
            user-select: text;
            word-wrap: break-word;
            -webkit-nbsp-mode: space;
            box-sizing: content-box;
            color: #1f2329;
            cursor: text;
            outline: 0;
            white-space: pre-wrap;
          }
        }
      }
    }
  }
}
</style>
