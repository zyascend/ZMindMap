<template>
  <div class="map-container">
    <svg class="main-svg" ref="mainSvg" xmlns:xlink=http://www.w3.org/1999/xlink>
      <g class="main-g" ref="mainG">
        <g>
          <path v-for="p in pathData" :key="p.id" :d="p.data"></path>
        </g>
        <g
          v-for="d in nodeData"
          :key="d"
          :id="d._id"
          :transform="`translate(${d.tx},${d.ty})`"
          :class="d.depth === 0 ? 'g-root' : d.depth === 1 ? 'g-subroot' : 'g-leaf'"
          @focus="onGFocus($event, d)"
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
            <div>{{ d.data.name }}</div>
          </foreignObject>
          <image
            class="image-add"
            :x="d.addX"
            :y="d.addY"
            :width="d.imageWidth"
            :height="d.imageHeight"
            :xlink:href="PIC_ADD"
            @click="onAdd(d)"
          />
          <image
            :class="d.children ? 'image-collapse' : 'image-collapse-none'"
            :x="d.collapseX"
            :y="d.collapseY"
            :width="d.imageWidth"
            :height="d.imageHeight"
            :xlink:href="PIC_COLLAPSE"
            @click="onCollapse($event, d)"
          />
        </g>
      </g>
    </svg>
    <svg ref="measureSvg"></svg>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, onUnmounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import useMap from '@/hooks/useMap'
import useZoomMap from '@/hooks/useZoomMap'
import PIC_COLLAPSE from '@/assets/map/arrow-left.svg'
import PIC_ADD from '@/assets/map/add.svg'

export default defineComponent({
  name: 'MindMap',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    // const store = useStore()
    const mainSvg = ref()
    const mainG = ref()
    const measureSvg = ref()

    const store = useStore()
    const pathData = ref([])
    const nodeData = ref([])
    onMounted(() => {
      if (!mainSvg.value || !mainG.value || !measureSvg.value) return
      store.dispatch('setRefs', {
        mainSvg: mainSvg.value,
        mainG: mainG.value,
        measureSvg: measureSvg.value
      })
      console.log('useMap(props.content)')
      const treeData = useMap(props.content)
      pathData.value = treeData.path
      nodeData.value = treeData.node
      nextTick(() => {
        useZoomMap.registerZoom()
        useZoomMap.fitView()
      })
    })
    onMounted(() => {
    })
    onUnmounted(() => {
      document.onkeydown = undefined
    })
    const onCollapse = (event, d) => {
      // TODO
      // ! 折叠按钮的点击事件会使g获得焦点，导致添加按钮显示
      // ? 可能需要从事件传递下手
      console.log('map onCollapse > ', d)
      document.activeElement.blur()
    }
    const onAdd = d => {
      console.log('map onAdd > ', d)
    }
    const onGFocus = (event, d) => {
      console.log('map onGFocus > ', d)
    }

    return {
      pathData,
      nodeData,
      PIC_COLLAPSE,
      PIC_ADD,
      onCollapse,
      onAdd,
      onGFocus,
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
  @include wh100;
  .main-svg{
    @include wh100;
    background-color: #eeeef3;
    path {
      stroke:#5856d5;
      fill: none;
      stroke-width: 1.5px
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
      .image-collapse, .image-collapse-none {
        cursor: pointer;
        opacity: 0;
      }
      &:hover {
        .image-collapse {
          opacity: 1;
        }
        .image-add {
          visibility: hidden;
        }
      }
      &:focus {
        .image-collapse {
          opacity: 0;
        }
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
</style>
