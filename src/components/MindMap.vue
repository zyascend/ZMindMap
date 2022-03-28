<template>
  <div class="map-container">
    <svg ref="mainSvg" class="main-svg" xmlns:xlink=http://www.w3.org/1999/xlink>
      <g ref="mainG" class="main-g">
        <foreignObject ref="foreignObject" style="display: none">
          <div ref="foreignDiv"
            contenteditable
            class="foreignDiv"
            @blur="onEditDivBlur"
          ></div>
        </foreignObject>
      </g>
    </svg>
    <svg ref="measureSvg"></svg>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import useTreeData from '@/hooks/useTreeData'
import useRender from '@/hooks/useRender'
import useKeydownEvent from '@/hooks/useKeydownEvent'

export default defineComponent({
  name: 'MindMap',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const mainSvg = ref()
    const mainG = ref()
    const measureSvg = ref()
    const foreignObject = ref()
    const foreignDiv = ref()

    const store = useStore()

    onMounted(() => {
      if (!mainSvg.value || !mainG.value || !measureSvg.value || !foreignObject.value || !foreignDiv.value) return
      foreignDiv.value.addEventListener('mousedown', e => {
        console.log('foreignDiv mousedown')
        e.stopPropagation()
      })
      store.dispatch('setRefs', {
        mainSvg: mainSvg.value,
        mainG: mainG.value,
        measureSvg: measureSvg.value,
        foreignObject: foreignObject.value,
        foreignDiv: foreignDiv.value
      })
      useTreeData.init(props.content)
      useRender()
      useKeydownEvent()
    })
    onUnmounted(() => {
      document.onkeydown = undefined
    })
    const onEditDivBlur = () => {
      console.log('onEditDivBlur')
      useTreeData.afterEdit()
    }
    return {
      mainSvg,
      mainG,
      measureSvg,
      foreignObject,
      foreignDiv,
      onEditDivBlur
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
    /* .image-add, .image-collapse {
      opacity: 0;
    }
    .g-hover {
      rect {
        opacity: 0.5;
      }
      .image-collapse {
        opacity: 1;
      }
    }
    .g-selected {
      rect, .image-add {
        opacity: 1;
      }
    }
    .g-editting {
      rect {
        opacity: 1;
      }
      .image-add,text {
        opacity: 0;
      }
    } */
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
