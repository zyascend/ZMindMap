<template>
  <div class="map-container">
    <svg class="main-svg" ref="mainSvg" xmlns:xlink=http://www.w3.org/1999/xlink>
      <g class="main-g" ref="mainG">
        <g>
          <path v-for="p in pathData" :key="p.id" :d="p.data"></path>
          <path v-for="n in nodeData" :key="n.data.id" :d="n.colLine" v-show="showCollapse(n.data)"></path>
        </g>
        <image
          v-for="d in nodeData"
          v-show="showCollapse(d.data)"
          :key="`image-add-${d.id}`"
          class="image-collapse"
          :x="d.colx"
          :y="d.coly"
          :width="d.imageWidth"
          :height="d.imageHeight"
          :xlink:href="PIC_COLLAPSE"
          @click="onCollapse($event, d.data)"
          />
        <g
          v-for="(d, index) in nodeData"
          :key="d"
          :id="d._id"
          :transform="`translate(${d.tx},${d.ty})`"
          :class="d.depth === 0 ? 'g-root' : d.depth === 1 ? 'g-subroot' : 'g-leaf'"
          :tabindex="index"
          @dblclick="onEditHtml($event, d.data)"
          @keydown="onKeyDown($event, d.data)">
        >
          <rect
            :x="d.rectX"
            :y="d.rectY"
            :rx="d.rectRX"
            :ry="d.rectRY"
            :width="d.rectWidth"
            :height="d.rectHeight"
          />
          <foreignObject
            :width="d.foWidth"
            :height="d.foHeight"
            :x="0"
            :dy="d.contentHeight"
          >
            <div>{{ d.data.html }}</div>
          </foreignObject>
          <image
            class="image-add"
            :x="d.addX"
            :y="d.addY"
            :width="d.imageWidth"
            :height="d.imageHeight"
            :xlink:href="PIC_ADD"
            @click="onAddClick(d.data)"
          />
        </g>
      </g>
    </svg>
    <svg ref="measureSvg"></svg>
    <div class="operation">
      <el-tooltip
        effect="light"
        content="适应屏幕"
        :offset="20"
        placement="left">
        <div class="fit-btn" @click="fitView">
          <SvgIcon class="icon" icon="fit-view" />
        </div>
      </el-tooltip>
    </div>
  </div>
  <el-dialog
    v-model="showEditDialog"
    :append-to-body="true"
    title="编辑节点"
    :width="400"
    custom-class="node-edit-dialog"
  >
    <el-input v-model="nodeHtml" autosize type="textarea"/>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="submitEdit"  native-type="submit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, onMounted, ref, onUnmounted, nextTick, watch, computed } from 'vue'
import { useMapStore } from '@/store/map'
import useMap from '@/hooks/useMap'
import useZoomMap from '@/hooks/useZoomMap'
import { collapse, addNode, deleteNode, changeNodeHtml } from '@/hooks/useContent'
import SvgIcon from './SvgIcon.vue'
import '@/assets/pic/fit-view.svg'
import '@/assets/pic/theme.svg'
import PIC_COLLAPSE from '@/assets/map/arrow-left.svg'
import PIC_ADD from '@/assets/map/add.svg'

export default defineComponent({
  components: { SvgIcon },
  name: 'MindMap',
  setup () {
    const mainSvg = ref()
    const mainG = ref()
    const measureSvg = ref()
    const store = useMapStore()
    const pathData = ref([])
    const nodeData = ref([])
    const storeData = computed(() => store.treedData)
    const showEditDialog = ref(false)
    const nodeHtml = ref()
    let idOnEditing = ''
    const render = () => {
      const treeData = useMap(store.treedData)
      pathData.value = treeData.path
      nodeData.value = treeData.node
      nextTick(() => {
        useZoomMap.registerZoom()
        useZoomMap.fitView()
      })
    }
    onMounted(() => {
      if (!mainSvg.value || !mainG.value || !measureSvg.value) return
      store.setRefs({
        mainSvg: mainSvg.value,
        mainG: mainG.value,
        measureSvg: measureSvg.value
      })
      render()
    })
    watch(storeData, (newVal, oldVal) => {
      if (oldVal) {
        render()
      }
    })
    onUnmounted(() => {
      document.onkeydown = undefined
    })
    const onCollapse = async (event, d) => {
      await collapse(d.id)
    }
    const onAddClick = async d => {
      await addNode(d.id, { isMap: true })
    }
    const fitView = () => {
      useZoomMap.registerZoom()
      useZoomMap.fitView()
    }
    const showCollapse = d => {
      return d.children.length || d._children.length
    }
    const onEditHtml = async (event, node) => {
      event.preventDefault()
      idOnEditing = node.id
      nodeHtml.value = node.html
      showEditDialog.value = true
    }
    const submitEdit = async () => {
      showEditDialog.value = false
      await changeNodeHtml(idOnEditing, nodeHtml.value)
    }
    const onTabNode = async (event, node) => {
      event.preventDefault()
      await addNode(node.id, { isMap: true })
    }
    const onAddNewNode = async (event, node) => {
      event.preventDefault()
      await addNode(node.parent, { isMap: true, cid: node.id })
    }
    const onDeleteNode = async (event, node) => {
      event.preventDefault()
      await deleteNode(node.id)
    }
    const onKeyDown = (event, node) => {
      switch (event.keyCode) {
        case 13:
          // 回车键处理逻辑
          onAddNewNode(event, node)
          break
        case 9:
          // Tab键处理逻辑
          onTabNode(event, node)
          break
        case 46:
          // Tab键处理逻辑
          onDeleteNode(event, node)
          break
        default:
          break
      }
    }
    return {
      pathData,
      nodeData,
      showEditDialog,
      nodeHtml,
      PIC_COLLAPSE,
      PIC_ADD,
      onCollapse,
      onAddClick,
      onKeyDown,
      onEditHtml,
      submitEdit,
      showCollapse,
      fitView,
      mainSvg,
      mainG,
      measureSvg
    }
  }
})
</script>

<style lang="scss">
@import '../assets/css/mixin';
.map-container {
  width: 100%;
  height: calc(100% - 46px);
  .operation {
    position: absolute;
    z-index: 2;
    top: 80px;
    right: 50px;
    padding: 8px;
    @include centerFlex;
    flex-direction: column;
    border: 1px solid #dee0e3;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 8px 4px rgb(31 35 41 / 6%);
    user-select: none;
    .fit-btn {
      cursor: pointer;
      .icon {
        width: 20px;
        height: 20px;
      }
    }
  }
  .main-svg{
    @include wh100;
    background-color: #eeeef3;
    path {
      stroke:#5856d5;
      fill: none;
      stroke-width: 1.5px
    }
    .image-collapse {
      cursor: pointer;
    }
    .collapsed {
      opacity: 1;
    }
    .g-root {
      rect {
        fill: #5856d5;
        opacity: 1;
      }
      foreignObject {
        div {
          color: #FFF;
          font-size: 16px;
          line-height: 16px;
        }
      }
    }
    .g-subroot {
      rect {
        fill: #0CAFFF;
      }
      foreignObject {
        div {
          color: #fdfafa;
          font-size: 14px;
          line-height: 14px;
        }
      }
    }
    .g-leaf {
      rect {
        fill: transparent;
        opacity: 1;
        stroke-width: 1.5px;
      }
      &:hover {
        rect {
          stroke: #5856d57d;
        }
      }
      &:focus {
        rect {
          stroke: #5856d5;
        }
      }
      foreignObject {
        div {
          color: #4B4B4B;
          font-size: 14px;
          line-height: 14px;
        }
      }
    }
    .g-root, .g-subroot, .g-leaf {
      outline: none;
      transition: .2s ease-in-out all;
      foreignObject {
        div {
          height: 100%;
          word-break: normal;
          width: fit-content;
          text-justify: distribute-all-lines;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: hidden;
          /* display: block; */
        }
      }
      .image-add {
        cursor: pointer;
        visibility: hidden;
      }
      &:hover {
        .image-add {
          visibility: hidden;
        }
      }
      &:focus {
        .image-add {
          visibility: visible;
        }
      }
    }
    .rect-depth-root {
      rect {
        fill: #5856d5;
        opacity: 1;
      }
      text {
        fill: #FFF;
        cursor: default;
      }
    }
    .foreignDiv {
      display: inline-block;
      outline: none;
      width: max-content;
      min-width: 22px;
      padding: 1px;
      white-space: pre;
    }
  }
}
.node-edit-dialog {
  border-radius: 4px !important;
  box-shadow: rgb(0 0 0 / 16%) 0px 2px 30px 0px !important;
}
</style>
