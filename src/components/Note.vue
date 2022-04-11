<template>
  <div class="note-container">
    <div class="doc-main" v-if="contentName">
      <div class="name" @input="onNameInput($event)" contenteditable="true">{{ contentName }}</div>
      <div class="content">
        <div class="note-node" v-for="node in noteList" :key="node.id">
          <div class="indent" v-for="i in node.level" :key="`${index}-${i}`" />
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
              v-html="node.name"
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
import {
  flatter, moveToLastFocus,
  toggleCollapse, addNewNode,
  deleteNode, tabNode
} from '@/hooks/useMindData'
import '@/assets/pic/triangle.svg'

export default defineComponent({
  name: 'Note',
  components: {
    SvgIcon,
    NotePopover
  },
  setup () {
    const store = useMapStore()
    const noteList = computed(() => flatter(store.content?.noteList))
    const originData = computed(() => store.content?.noteList)
    const contentName = computed(() => store.content?.name)
    const snapshot = new Snapshot()
    onUnmounted(() => {
      document.onkeydown = undefined
    })
    const snap = () => {
      snapshot.snap({
        name: contentName.value,
        noteList: originData.value
      })
    }
    watch(contentName, (newVal, oldVal) => {
      if (!oldVal) {
        // 首次进入页面 需要将初始值存入快照
        snap()
      }
    })
    const emitUpdate = async () => {
      await store.remoteUpdateMap({
        name: contentName.value,
        noteList: originData.value
      })
    }
    // 折叠or打开节点
    const onCollapse = _id => {
      originData.value = toggleCollapse(_id, originData.value)
      noteList.value = flatter(originData.value)
      emitUpdate()
      snap()
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
      snap()
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
      snap()
    }
    const onAddNewNode = (event, node) => {
      const { data, newId } = addNewNode(node, event, originData.value)
      originData.value = data
      noteList.value = flatter(originData.value)
      nextTick(() => {
        moveToLastFocus(`note-node-${newId}`)
      })
      emitUpdate()
      snap()
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
    /**
     * ctrl+z 撤回操作
     */
    const onSnapBack = (event) => {
      event.preventDefault()
      if (snapshot.hasPrev) {
        store.setContent(snapshot.prev())
        emitUpdate()
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
          if (event.ctrlKey) {
            onSnapBack(event)
          }
          break
        default:
          break
      }
    }
    const onChangeFontColor = prams => {
      const { color, node } = prams
      const update = list => {
        if (!list || !list.length) return
        for (const n of list) {
          if (n.id === node.id) {
            // TODO 如何做到不覆盖原来的style
            n.name = `<span style="color:${color};">${n.name}</span>`
            // TODO 如何兼容更多的类似md的样式
          } else {
            update(n.children)
          }
        }
      }
      update(originData.value)
      emitUpdate()
      snap()
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
      snap()
    }, 500)
    const onNameInput = debounce((event) => {
      contentName.value = event.target.innerText
      emitUpdate()
    }, 500)
    const toggleActionPop = debounce(node => {
    }, 500)
    return {
      noteList,
      contentName,
      onCollapse,
      onKeyDown,
      onNodeInput,
      onNameInput,
      toggleActionPop,
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
