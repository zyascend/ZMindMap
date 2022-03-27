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
              @click="onCollapse(node.id)"
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
import {
  flatter, moveToLastFocus,
  toggleCollapse, addNewNode, deleteNode, tabNode
} from '@/hooks/useMindData'
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
      // 实现v-model双向更新
      context.emit('update:content', {
        name: contentName.value,
        noteList: originData.value
      })
    }
    // 折叠or打开节点
    const onCollapse = _id => {
      originData.value = toggleCollapse(_id, originData.value)
      noteList.value = flatter(originData.value)
      emitUpdate()
    }
    const onDeleteNode = (node, event) => {
      // 节点文字删除完毕才删除此节点
      if (event.target.innerText !== '') return false
      const { data, lastNode } = deleteNode(node, event, originData.value, noteList.value)
      originData.value = data
      noteList.value = flatter(originData.value)
      nextTick(() => {
        // 上一个节点自动获得光标 并将光标移动到最后的位置
        moveToLastFocus(`note-node-${lastNode.id}`)
      })
      emitUpdate()
    }
    const onTabNode = (node, event) => {
      const { data, newId } = tabNode(node, event, originData.value)
      originData.value = data
      noteList.value = flatter(originData.value)
      nextTick(() => {
        // 将光标移动到最后的位置
        moveToLastFocus(`note-node-${newId}`)
      })
      emitUpdate()
    }
    const onAddNewNode = (event, node) => {
      const { data, newId } = addNewNode(node, event, originData.value)
      originData.value = data
      noteList.value = flatter(originData.value)
      nextTick(() => {
        moveToLastFocus(`note-node-${newId}`)
      })
      emitUpdate()
    }
    const onUpDownArrow = (event, node) => {
      event.preventDefault()
      let target = -1
      const code = event.keyCode
      for (const index in noteList.value) {
        if (noteList.value[index].id === node.id) {
          target = Number(index)
          break
        }
      }
      // 遇到头和尾的节点无法再移动
      if ((code === 38 && target !== 0) || (code === 40 && target !== noteList.value.length - 1)) {
        moveToLastFocus(`note-node-${noteList.value[code === 38 ? target - 1 : target + 1].id}`)
      }
    }
    const onKeyDown = (event, node) => {
      switch (event.keyCode) {
        case 13:
          // 回车键处理逻辑
          onAddNewNode(event, node)
          break
        case 8:
          // BackSpace键处理逻辑
          onDeleteNode(node, event)
          break
        case 9:
          // Tab键处理逻辑
          onTabNode(node, event)
          break
        case 38:
        case 40:
          // 上下键处理逻辑
          onUpDownArrow(event, node)
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
    }, 500)
    const onNameInput = debounce((event) => {
      contentName.value = event.target.innerText
      emitUpdate()
    }, 500)
    return {
      noteList,
      contentName,
      onCollapse,
      onKeyDown,
      onNodeInput,
      onNameInput
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../assets/css/handler';
.note-container {
  @include wh100;
  overflow-y: auto;
  .doc-main {
    max-width: 872px;
    min-height: calc(100vh - 252px);
    padding: 0 55px 140px;
    margin: 0 auto;
     @include font_color(fc_normal);
    .name {
      min-height: 42px;
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
            /* background: #fff; */
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
            min-height: 24px;
            font-size: 16px;
            user-select: text;
            word-wrap: break-word;
            -webkit-nbsp-mode: space;
            box-sizing: content-box;
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
