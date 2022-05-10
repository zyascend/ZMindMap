<template>
  <div class="map-container" id="mapContainer">
    <svg :style="styles.svgStyle" class="main-svg" id="main-svg" ref="mainSvg" xmlns:xlink=http://www.w3.org/1999/xlink>
      <g class="main-g" ref="mainG">
        <g>
          <path :style="styles.pathStyle" v-for="p in pathData" :key="p.id" :d="p.data"></path>
          <path :style="styles.pathStyle" v-for="n in nodeData" :key="n.data.id" :d="n.colLine" v-show="isShowCollapse(n.data)"></path>
        </g>
        <image
          v-for="d in nodeData"
          v-show="isShowCollapse(d.data)"
          class="image-collapse"
          :key="`image-add-${d.id}`"
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
            :style="styles.rectStyle(d)"
          />
          <foreignObject
            :width="d.foWidth"
            :height="d.foHeight"
            :x="0"
            :dy="d.contentHeight"
          >
            <div :style="styles.foDivStyle(d)">{{ d.data.html }}</div>
          </foreignObject>
          <image
            :style="styles.imageStyle"
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
  </div>
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
    <el-popover
      title="选择主题"
      placement="left-start"
      trigger="hover"
      popper-class="map-theme-popper"
      :show-arrow="true"
      :offset="20"
      :width="200"
    >
      <template #reference>
        <div class="fit-btn">
          <SvgIcon class="icon" icon="theme" />
        </div>
      </template>
      <div class="theme-list">
        <div
          class="theme-item"
          title="点击切换"
          v-for="(theme, index) in styleList"
          :class="{ 'active-item': index === activeStyle }"
          :key="`theme-${theme[0]}`"
          @click="switchTheme(index)"
        >
          <span v-for="color in theme" :style="`background-color:${color};`" :key="color"/>
        </div>
      </div>
    </el-popover>
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
import { defineComponent, onMounted, ref, onUnmounted, nextTick, watchEffect, computed } from 'vue'
import { useMapStore } from 'store/map'
import { useWebsiteStore } from 'store/website'
import { getStyle, getStyleList } from 'hooks/useMapStyle'
import { collapse, addNode, deleteNode, changeNodeHtml } from 'hooks/useContent'
import useMap from 'hooks/useMap'
import useZoomMap from 'hooks/useZoomMap'
import SvgIcon from './SvgIcon.vue'
import PIC_COLLAPSE from 'assets/map/arrow-left.svg'
import PIC_ADD from 'assets/map/add.svg'

export default defineComponent({
  components: { SvgIcon },
  name: 'MindMap',
  setup () {
    const mainSvg = ref()
    const mainG = ref()
    const measureSvg = ref()
    const mapContainer = ref()

    const store = useMapStore()
    const websiteStore = useWebsiteStore()

    const pathData = ref([])
    const nodeData = ref([])

    const styles = computed(() => getStyle(websiteStore.mapStyleIndex))
    const styleList = computed(() => getStyleList())
    const activeStyle = computed(() => websiteStore.mapStyleIndex)

    const showEditDialog = ref(false)
    const nodeHtml = ref()
    let idOnEditing = ''

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    let sizeObserver
    let zoomTimer

    onMounted(() => {
      store.setRefs({
        mainSvg: mainSvg.value,
        mainG: mainG.value,
        measureSvg: measureSvg.value
      })
      setObserver()
    })
    onUnmounted(() => {
      document.onkeydown = undefined
      if (sizeObserver) {
        sizeObserver.disconnect()
        sizeObserver.takeRecords()
        sizeObserver = null
      }
      clearTimeout(zoomTimer)
    })
    const render = () => {
      if (!store.treedData) return
      const treeData = useMap(store.treedData)
      pathData.value = treeData.path
      nodeData.value = treeData.node
      console.log(nodeData.value)
      nextTick(() => {
        useZoomMap.registerZoom()
        useZoomMap.fitView()
      })
    }
    watchEffect(() => {
      //  watchEffect：立即执行传入的函数，并响应式追踪其依赖，在其依赖变更时重新运行该函数
      render()
    })
    const setObserver = () => {
      // 监听侧边栏的打开/折叠 使Map适应屏幕
      sizeObserver = new MutationObserver(mutations => {
        zoomTimer = setTimeout(() => {
          useZoomMap.registerZoom()
          useZoomMap.fitView()
        }, 500)
      })
      const sideContent = document.getElementById('siderContent')
      sizeObserver.observe(sideContent, {
        attributes: true,
        attributeFilter: ['style'],
        attributeOldValue: true
      })
    }
    const fitView = () => {
      useZoomMap.registerZoom()
      useZoomMap.fitView()
    }
    const switchTheme = index => {
      websiteStore.switchMapStyle(index)
    }
    const isShowCollapse = d => {
      return d.children.length || d._children.length
    }
    const onCollapse = async (event, d) => {
      await collapse(d.id)
    }
    const onAddClick = async d => {
      await addNode(d.id, { isMap: true })
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
      styles,
      styleList,
      activeStyle,
      pathData,
      nodeData,
      showEditDialog,
      nodeHtml,
      PIC_COLLAPSE,
      PIC_ADD,
      switchTheme,
      onCollapse,
      onAddClick,
      onKeyDown,
      onEditHtml,
      submitEdit,
      isShowCollapse,
      fitView,
      mainSvg,
      mainG,
      measureSvg,
      mapContainer
    }
  }
})
</script>

<style lang="scss">
@import '../assets/css/handler';
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
  .fit-btn+.fit-btn {
    margin-top: 10px;
  }
}
.map-theme-popper {
  padding: 7px 7px !important;
  /* @include background_color(bc_popover); */
  border: none !important;
  .el-popover__title {
    text-align: center;
  }
  .theme-list {
    display: grid;
    grid-template-columns:repeat(2, 1fr);
    gap: 10px;
    .theme-item {
      padding: 3px;
      cursor: pointer;
      display: grid;
      grid-template-columns:repeat(4, 1fr);
      border-radius: 3px;
      border: 2px solid #8b8b8eb0;
      span {
        flex: 1;
        height: 30px;
      }
    }
    .active-item {
      border-color: $color-base;
    }
  }
}
.map-container {
  width: 100%;
  height: calc(100% - 46px);
  .main-svg{
    .image-collapse {
      cursor: pointer;
    }
    .g-leaf {
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
    }
    .g-root, .g-subroot, .g-leaf {
      cursor: pointer;
      outline: none;
      transition: .2s ease-in-out all;
      .image-add {
        cursor: pointer;
      }
      &:hover {
        .image-add {
          display: block !important;
          visibility: hidden;
        }
      }
      &:focus {
        .image-add {
          display: block !important;
          visibility: visible;
        }
      }
    }
  }
}
.node-edit-dialog {
  border-radius: 4px !important;
  box-shadow: rgb(0 0 0 / 16%) 0px 2px 30px 0px !important;
}
</style>
