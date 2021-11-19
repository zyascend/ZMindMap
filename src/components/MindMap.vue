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
import { useTreeData, useRender, useKeydownEvent } from '../hooks'

export default defineComponent({
  name: 'MindMap',
  props: {
    modelValue: {
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
      useTreeData.init(props.modelValue)
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '../assets/css/mixin';
.map-container {
  @include wh100;
  .main-svg{
    @include wh100;
    background-color: #eeeef3;
    text {
      fill: #4B4B4B;
      cursor: default;
    }
    rect {
      stroke: blue;
      stroke-width: 2px;
      fill: transparent;
      opacity: 0;
    }
    image {
      opacity: 0;
    }
    .g-hover {
      rect {
        opacity: 0.5;
      }
    }
    .g-selected {
      rect, image {
        opacity: 1;
      }
    }
    .g-editting {
      rect {
        opacity: 1;
      }
      image,text {
        opacity: 0;
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
