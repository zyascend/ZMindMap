<template>
  <div class="note-container">
    <div class="doc-main">
      <div
        class="name"
        @input="onNameInput($event, rootNode)"
        contenteditable="true"
      >
        {{ rootNode?.html }}
      </div>
      <div class="content">
        <div class="note-node" v-for="node in childNodes" :key="node.id">
          <div
            class="indent"
            v-for="i in node.level"
            :key="`ident-${node.id}-${i}`"
          />
          <div class="node-content" :style="`color: ${node.color}`" :id="`node-${node.id}`">
            <div
              class="action-wrapper"
              @click="onCollapse(node.id)"
              v-if="node.children.length || node._children.length"
            >
              <svg-icon
                icon="triangle"
                :class="`${node._children.length ? 'icon-collapsed' : ''}`"
              />
            </div>
            <note-popover :node="node" @onColorSelect="onChangeFontColor" />
            <div class="content-wrapper">
              <div
                :id="`note-node-${node.id}`"
                class="text-wrapper"
                contenteditable="true"
                v-html="node.html"
                @paste="onPaste($event, node)"
                @compositionstart="onHandleCompositionStart($event)"
                @compositionend="onHandleCompositionEnd($event)"
                @input="onNodeInput($event, node)"
                @keydown="onKeyDown($event, node)"
              ></div>
              <div
                class="image-wrapper"
                v-if="node?.imgInfo?.url"
                :style="`width: ${node.imgInfo.width}px; height: ${node.imgInfo.height}px`"
              >
                <el-image
                  title="点击查看"
                  class="image-node"
                  fit="contain"
                  lazy
                  :src="node.imgInfo.url"
                  :preview-src-list="imgSrcList"
                  :initial-index="imgSrcList.indexOf(node.imgInfo.url)"
                >
                  <template #placeholder>
                    <div class="image-loading">
                      <svg-icon icon="loading" />
                    </div>
                  </template>
                </el-image>
                <div
                  class="delete-pic"
                  title="删除图片"
                  @click="onDeleteImg(node)"
                >
                  <svg-icon icon="delete" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onUnmounted, nextTick, computed, watch } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import NotePopover from '@/components/note/NotePopover.vue'
import { debounce } from '@/hooks/utils'
import useSnapShot from '@/hooks/useSnapshot'
import * as useContent from '@/hooks/useContent'
import useNoteList from '@/hooks/note/useNote'

export default defineComponent({
  name: 'note',
  components: {
    SvgIcon,
    NotePopover
  },
  setup() {
    let flag = false
    const [rootNode, childNodes] = useNoteList()
    const addSnapShot = useSnapShot()
    const imgSrcList = computed(() => {
      if (!childNodes.value) return []
      const srcList = []
      childNodes.value.forEach(node => {
        if (node.imgInfo) {
          srcList.push(node.imgInfo.url)
        }
      })
      return srcList
    })
    onUnmounted(() => {
      document.onkeydown = undefined
    })
    watch(rootNode, (newVal, oldVal) => {
      if (!oldVal) {
        // 首次进入页面 需要将初始值存入快照
        addSnapShot()
      }
    })
    // 折叠or打开节点
    const onCollapse = async _id => {
      await useContent.collapse(_id)
      addSnapShot()
    }
    const onDeleteNode = async (node, event) => {
      // 节点文字删除完毕才删除此节点
      // event.preventDefault()
      if (event.target.innerText !== '') return
      // 当前只有一个节点 删除完文字之后停止
      if (childNodes.value.length === 1) {
        return
      }
      event.preventDefault()
      const prevId = await useContent.deleteNode(node.id, childNodes.value)
      nextTick(() => {
        // 上一个节点自动获得光标 并将光标移动到最后的位置
        useContent.moveToLastFocus(`note-node-${prevId}`)
      })
      addSnapShot()
    }
    const onTabNode = async (node, event) => {
      event.preventDefault()
      const newId = await useContent.tabNode(node.id, childNodes.value)
      newId &&
        nextTick(() => {
          // 将光标移动到最后的位置
          useContent.moveToLastFocus(`note-node-${newId}`)
        })
      addSnapShot()
    }
    const onAddNewNode = async (event, node) => {
      event.preventDefault()
      let newId
      if (node.children.length) {
        // 有孩子且孩子处于展开状态 => 添加孩子
        newId = await useContent.addNode(node.id)
      } else {
        // 添加兄弟节点
        newId = await useContent.addNode(node.parent, { cid: node.id })
      }
      nextTick(() => {
        useContent.moveToLastFocus(`note-node-${newId}`)
      })
      addSnapShot()
    }
    const onUpDownArrow = (event, node) => {
      event.preventDefault()
      let target = -1
      const code = event.keyCode
      // eslint-disable-next-line no-restricted-syntax
      for (const index in childNodes.value) {
        if (childNodes.value[index].id === node.id) {
          target = Number(index)
          break
        }
      }
      // 光标向上移动
      if (code === 38 && target !== 0) {
        useContent.moveToLastFocus(
          `note-node-${childNodes.value[target - 1].id}`
        )
      }
      // 光标向下移动
      if (code === 40 && target !== childNodes.value.length - 1) {
        useContent.moveToLastFocus(
          `note-node-${childNodes.value[target + 1].id}`
        )
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
    const onChangeFontColor = async prams => {
      // TODO 待完善
      await useContent.changeNodeHtml('new html')
      addSnapShot()
    }
    const onHandleCompositionStart = (event) => {
        flag = false
    }
    const onHandleCompositionEnd = (event) => {
        flag = true
    }
    const onNodeInput = debounce(async (event, node) => {
      const newText = event.target.innerText
      const cur = useContent.getCursortPosition(event.target);
      if ((event.isComposing == true && flag) || !(event.isComposing)) {
        await useContent.changeNodeHtml(node.id, newText)
        useContent.setCaretPosition(event.target, cur)
      }
      // nextTick(() => {
      //   useContent.moveToLastFocus(`note-node-${node.id}`)
      // })
      addSnapShot()
    }, 800)
    const onNameInput = debounce(async (event, node) => {
      const newText = event.target.innerText
      await useContent.changeNodeHtml(node.id, newText)
    }, 500)
    const onPaste = async (event, node) => {
      const file = event.clipboardData.files[0]
      if (file) {
        event.preventDefault()
        await useContent.pasteImg(file, node.id)
      }
    }
    const onDeleteImg = async node => {
      await useContent.deleteImg(node.id)
    }
    return {
      rootNode,
      childNodes,
      imgSrcList,
      onCollapse,
      onKeyDown,
      onHandleCompositionStart,
      onHandleCompositionEnd,
      onNodeInput,
      onNameInput,
      onChangeFontColor,
      onPaste,
      onDeleteImg
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/css/handler';
.note-container {
  width: 100%;
  height: calc(100% - 46px);
  overflow-y: auto;
  .doc-main {
    max-width: 872px;
    min-height: calc(100vh - 252px);
    padding: 0 55px 140px;
    margin: 0 auto;
    @include font_color(fc_normal);
    .name {
      box-sizing: content-box;
      min-height: 42px;
      padding: 62px 0 0;
      margin-bottom: 27px;
      font-size: 34px;
      font-weight: 600;
      line-height: 48px;
      word-wrap: break-word;
      white-space: pre-wrap;
      cursor: text;
      user-select: text;
      outline: 0;
      -webkit-nbsp-mode: space;
    }
    .content {
      align-items: center;
      width: 100%;
      @include vertFlex;
      .note-node {
        align-items: center;
        width: 100%;
        transition: 0.1s all;
        transition-timing-function: cubic-bezier(0.3, 1.02, 0.68, 1.01);
        @include horiFlex;
        .indent {
          box-sizing: border-box;
          width: 26px;
          height: 34px;
          padding-left: 1px;
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
          align-items: flex-start;
          @include horiFlex;
          ::selection {
            background-color: #bacefd;
          }
          .action-wrapper {
            @include centerFlex;
            position: absolute;
            top: 0;
            left: -33px;
            z-index: 2;
            width: 30px;
            height: 30px;
            cursor: pointer;
            opacity: 0;
            .icon-collapsed {
              transform: rotate(-90deg);
            }
            svg {
              width: 12px;
              height: 12px;
              transition: 0.2s ease all;
            }
          }
          .content-wrapper {
            @include vertFlex;
            flex: 1;
            .text-wrapper {
              /* box-sizing: content-box; */
              flex: 1;
              min-height: 30px;
              padding: 2px 0 2px 8px;
              overflow: hidden;
              font-size: 16px;
              line-height: 26px;
              text-justify: distribute-all-lines;
              word-break: normal;
              word-wrap: break-word;
              white-space: pre-wrap;
              cursor: text;
              user-select: text;
              -webkit-nbsp-mode: space;
            }
            .image-wrapper {
              position: relative;
              &:hover {
                .image-node {
                  border-color: #3370ff;
                }
                .delete-pic {
                  visibility: visible;
                }
              }
              .image-node {
                max-height: 250px;
                margin-left: 8px;
                border: 2px solid transparent;
              }
              .image-loading {
                display: grid;
                place-items: center;
                width: 100%;
                height: 100%;
                svg {
                  width: 48px;
                  height: 60px;
                }
              }
              .delete-pic {
                position: absolute;
                top: -12px;
                right: -12px;
                box-sizing: border-box;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 26px;
                height: 26px;
                cursor: pointer;
                visibility: hidden;
                background-color: #fff;
                border: 1px solid #3370ff;
                border-radius: 13px;
                svg {
                  width: 20px;
                  height: 20px;
                  fill: #3370ff;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
