<template>
  <div class="note-container" v-show="show">
    <div class="doc-main">
      <div class="name"
        @input="onNameInput($event, rootNode)"
        contenteditable="true">
        {{ rootNode?.html }}
      </div>
      <div class="content">
        <div class="note-node" v-for="node in childNodes" :key="node.id">
          <div class="indent" v-for="i in node.level" :key="`ident-${node.id}-${i}`" />
          <div class="node-content" :id="`node-${node.id}`">
            <div
              class="action-wrapper"
              @click="onCollapse(node.id)"
              v-if="node.children.length || node._children.length ">
              <svg-icon icon="triangle" :class="`${node.collapsed ? 'icon-collapsed' : ''}`"/>
            </div>
            <note-popover :node="node" @onColorSelect="onChangeFontColor"/>
            <div
              :id="`note-node-${node.id}`"
              class="text-wrapper"
              contenteditable="true"
              v-html="node.html"
              @input="onNodeInput($event, node)"
              @keydown="onKeyDown($event, node)">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onUnmounted, nextTick, computed, watch } from 'vue'
import { useMapStore } from '@/store/map'
import SvgIcon from '@/components/SvgIcon.vue'
import NotePopover from '@/components/NotePopover.vue'
import { debounce } from '@/hooks/utils'
import Snapshot from '@/hooks/useSnapshot'
import { moveToLastFocus, collapse, addNode, tabNode, deleteNode, changeNodeHtml } from '@/hooks/useContent'

export default defineComponent({
  name: 'Note',
  components: {
    SvgIcon,
    NotePopover
  },
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  setup () {
    const store = useMapStore()
    const rootNode = computed(() => store.getRootNode)
    const childNodes = computed(() => store.getChildNode)
    const snapshot = new Snapshot()
    onUnmounted(() => {
      document.onkeydown = undefined
    })
    const snap = () => {
      snapshot.snap({ content: store.content })
    }
    watch(rootNode, (newVal, oldVal) => {
      if (!oldVal) {
        // 首次进入页面 需要将初始值存入快照
        snap()
      }
    })
    // 折叠or打开节点
    const onCollapse = async (_id) => {
      await collapse(_id)
      snap()
    }
    const onDeleteNode = async (node, event) => {
      // 节点文字删除完毕才删除此节点
      // event.preventDefault()
      console.log('onDeleteNode', event.target.innerText)
      if (event.target.innerText !== '') return
      // 当前只有一个节点 删除完文字之后停止
      if (childNodes.value.length === 1) {
        return
      }
      event.preventDefault()
      const prevId = await deleteNode(node.id, childNodes.value)
      nextTick(() => {
        // 上一个节点自动获得光标 并将光标移动到最后的位置
        moveToLastFocus(`note-node-${prevId}`)
      })
      snap()
    }
    const onTabNode = async (node, event) => {
      event.preventDefault()
      const newId = await tabNode(node.id, childNodes.value)
      nextTick(() => {
        // 将光标移动到最后的位置
        moveToLastFocus(`note-node-${newId}`)
      })
      snap()
    }
    const onAddNewNode = async (event, node) => {
      event.preventDefault()
      let newId
      if (node.children.length) {
        // 有孩子且孩子处于展开状态 => 添加孩子
        newId = await addNode(node.id)
      } else {
        // 添加兄弟节点
        newId = await addNode(node.parent, { cid: node.id })
      }
      nextTick(() => {
        moveToLastFocus(`note-node-${newId}`)
      })
      snap()
    }
    const onUpDownArrow = (event, node) => {
      event.preventDefault()
      // let target = -1
      // const code = event.keyCode
      // for (const index in noteList.value) {
      //   if (noteList.value[index].id === node.id) {
      //     target = Number(index)
      //     break
      //   }
      // }
      // // 遇到头和尾的节点无法再移动
      // if ((code === 38 && target !== 0) || (code === 40 && target !== noteList.value.length - 1)) {
      //   moveToLastFocus(`note-node-${noteList.value[code === 38 ? target - 1 : target + 1].id}`)
      // }
    }
    /**
     * ctrl+z 撤回操作
     */
    const onSnapBack = async (event) => {
      event.preventDefault()
      if (snapshot.hasPrev) {
        await store.setContent(snapshot.prev().content)
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
        case 90:
          // ctrl + z 撤回逻辑
          if (event.ctrlKey) {
            onSnapBack(event)
          }
          break
        default:
          break
      }
    }
    const onChangeFontColor = async (prams) => {
      // const { color, node } = prams
      // TODO
      await changeNodeHtml('new html')
      snap()
    }
    const onNodeInput = debounce(async (event, node) => {
      const newText = event.target.innerText
      await changeNodeHtml(node.id, newText)
      nextTick(() => {
        moveToLastFocus(`note-node-${node.id}`)
      })
      snap()
    }, 500)
    const onNameInput = debounce(async (event, node) => {
      const newText = event.target.innerText
      await changeNodeHtml(node.id, newText)
    }, 500)
    return {
      rootNode,
      childNodes,
      onCollapse,
      onKeyDown,
      onNodeInput,
      onNameInput,
      onChangeFontColor
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
          /* border-left: 1px solid #dee0e3; */
          transform: translateX(8px);
        }
        &:hover {
          .node-content {
            .action-wrapper {
              opacity: 1;
            }
          }
        }
        .node-hover {
          background-color: #5856d547;
          border-radius: 5px;
        }
        .node-content {
          position: relative;
          flex: 1;
          @include horiFlex;
          align-items: flex-start;
          ::selection{
            background-color: #bacefd;
          }
          .action-wrapper {
            @include centerFlex;
            opacity: 0;
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
          /* .bullet-wrapper {
            width: 18px;
            height: 18px;
            margin-top: 6px;
            .bullet {
              @include wh100;
              @include centerFlex;
              border-radius: 9px;
              div {
                z-index: 10;
                width: 6px;
                height: 6px;
                background-color: #646a73;
                border-radius: 3px;
              }
            }
            .bullet-circled {
              background-color: #ebecec;
            }
          } */
          .text-wrapper {
            flex: 1;
            min-height: 30px;
            box-sizing: border-box;
            padding: 2px 0 2px 8px;
            line-height: 26px;
            font-size: 16px;
            user-select: text;
            -webkit-nbsp-mode: space;
            box-sizing: content-box;
            cursor: text;
            outline: 0;
            word-break: normal;
            width: fit-content;
            text-justify: distribute-all-lines;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
