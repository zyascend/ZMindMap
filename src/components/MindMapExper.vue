<template>
  <div class="map-container">
    <svg class="main-svg" xmlns:xlink=http://www.w3.org/1999/xlink>
      <g class="main-g">
        <g>
          <path v-for="p in path" :key="p.id" :d="p.data"></path>
        </g>
        <g
          v-for="d in treeData"
          :key="d"
          :transform="`translate(${d.tx},${d.ty})`"
          :class="d.depth === 0 ? 'g-root' : d.depth === 1 ? 'g-subroot' : 'g-leaf'"
          @click="gClick(d)">
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
            :dy="d.height"
          >
            <div>{{ d.data.name }}</div>
          </foreignObject>
          <image
            :class="d.children ? 'image-collapse' : ''"
            :x="d.collapseX"
            :y="d.collapseY"
            :width="d.collapseWidth"
            :height="d.collapseHeight"
            :xlink:href="PIC_COLLAPSE"
          />
        </g>
      </g>
    </svg>
    <svg ref="measureSvg"></svg>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, onUnmounted } from 'vue'
// import { useStore } from 'vuex'
// import useTreeData from '@/hooks/useTreeData'
import PIC_COLLAPSE from '@/assets/map/add.svg'

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
    onMounted(() => {
    })
    onUnmounted(() => {
      document.onkeydown = undefined
    })
    const treeData = ref([1, 2, 3, 4, 5])
    const gClick = d => {
      console.log('gClick > ', d)
    }
    return {
      gClick,
      treeData,
      PIC_COLLAPSE
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
      }
      &:hover {
        rect {
          stroke: #5856d57d;
          stroke-width: 1.5px;
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
      image {
        display: none;
      }
      &:hover {
        .image-collapse {
          cursor: pointer;
          display: block;
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
