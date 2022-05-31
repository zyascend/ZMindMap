<template>
  <div class="map-container" id="mapContainer">
    <svg :style="allStyles.svgStyle" class="main-svg" id="main-svg" ref="mainSvg" xmlns:xlink=http://www.w3.org/1999/xlink>
      <g class="main-g" ref="mainG">
        <g v-if="!!pathData">
          <path
            class="link"
            :style="allStyles.pathStyle"
            v-for="p in pathData"
            :key="p.id"
            :d="p.data">
          </path>
        </g>
        <g
          v-for="(node, index) in nodeData"
          class="g-info"
          :key="node._id"
          :id="node._id"
          :transform="`translate(${node.x},${node.y})`"
          :tabindex="index"
          @focus="onNodeFocus(node.data)"
          @dblclick="onEditHtml($event, node.data)"
          @keydown="onKeyDown($event, node.data)">
          <rect
            x="0" y="0"
            :rx="node.rectRadius"
            :ry="node.rectRadius"
            :width="node.cw"
            :height="node.ch"
            :style="allStyles.rectStyle(node)"
          />
          <rect
            class="border-rect"
            x="0" y="0"
            :rx="node.rectRadius"
            :ry="node.rectRadius"
            :width="node.cw"
            :height="node.ch"
            style="fill: transparent;"
          />
          <g
            v-if="node.mw"
            :transform="`translate(${node.mx},${node.my})`"
           >
            <image
              v-for="(marker, index) in node.data.markerList"
              :key="marker"
              :transform="`translate(${index * 11},${0})`"
              :width="18"
              :height="18"
              :xlink:href="marker"
            />
          </g>
          <text
            :transform="`translate(${node.tx},${node.ty})`"
            :width="node.tw"
            :height="node.th"
            :style="allStyles.textStyle(node)"
            >
            <tspan
              v-for="line in node.multiline"
              :key="line"
              :x="0"
              :dy="node.tspanDy"
              :fill="allStyles.textStyle(node).color"
              >
              {{ line }}
            </tspan>
          </text>
        </g>
      </g>
    </svg>
    <svg ref="measureSvg"></svg>
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
import { defineComponent, onMounted, ref, onUnmounted, computed } from 'vue'
import { useMapStore } from 'store/map'
import * as useContent from 'hooks/useContent'
import useMapStyle from 'hooks/useMapStyle'

export default defineComponent({
  name: 'MapRender',
  props: {
    renderData: {
      type: Object,
      required: true
    },
    curStyle: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const mainSvg = ref()
    const mainG = ref()
    const measureSvg = ref()

    const pathData = computed(() => props.renderData?.paths || undefined)
    const nodeData = computed(() => props.renderData?.nodes || [])
    const allStyles = computed(() => useMapStyle(props.curStyle))

    const showEditDialog = ref(false)
    const nodeHtml = ref()
    let idOnEditing = ''

    const store = useMapStore()

    onMounted(() => {
      store.setRefs({
        mainSvg: mainSvg.value,
        mainG: mainG.value,
        measureSvg: measureSvg.value
      })
    })
    onUnmounted(() => {
      document.onkeydown = undefined
    })
    const isShowCollapse = d => {
      return d.children.length || d._children.length
    }
    const onCollapse = async (event, d) => {
      await useContent.collapse(d.id)
    }
    const onAddClick = async d => {
      await useContent.addNode(d.id, { isMap: true })
    }
    const onEditHtml = async (event, node) => {
      event.preventDefault()
      idOnEditing = node.id
      nodeHtml.value = node.html
      showEditDialog.value = true
    }
    const submitEdit = async () => {
      showEditDialog.value = false
      await useContent.changeNodeHtml(idOnEditing, nodeHtml.value)
    }
    const onTabNode = async (event, node) => {
      event.preventDefault()
      await useContent.addNode(node.id, { isMap: true })
    }
    const onAddNewNode = async (event, node) => {
      event.preventDefault()
      await useContent.addNode(node.parent, { isMap: true, cid: node.id })
    }
    const onDeleteNode = async (event, node) => {
      event.preventDefault()
      await useContent.deleteNode(node.id)
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
          // delete键处理逻辑
          onDeleteNode(event, node)
          break
        default:
          break
      }
    }
    const onNodeFocus = data => {
      store.setIdFocused(data.id)
    }
    return {
      pathData,
      nodeData,
      allStyles,
      showEditDialog,
      nodeHtml,
      onCollapse,
      onAddClick,
      onKeyDown,
      onEditHtml,
      submitEdit,
      isShowCollapse,
      onNodeFocus,
      mainSvg,
      mainG,
      measureSvg
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../assets/css/handler';
.map-container {
  width: 100%;
  height: calc(100% - 46px);
  .main-svg{
    width: 100%;
    height: 100%;
    .g-info {
      cursor: pointer;
      outline: none;
      transition: .3s ease-in-out all;
      &:focus {
        .border-rect {
          stroke: blue;
          stroke-width: 2px;
        }
      }
      .border-rect {
        fill: transparent;
        stroke: none;
      }
    }
    .link {
      stroke-dasharray: 100%, 100%;
      animation: move 5s ease forwards;
    }
    @keyframes move {
      0%{
          stroke-dashoffset: 100%;
      }
      100%{
          stroke-dashoffset: 0;
      }
    }
  }
}
.node-edit-dialog {
  border-radius: 4px !important;
  box-shadow: rgb(0 0 0 / 16%) 0 2px 30px 0 !important;
}
</style>
