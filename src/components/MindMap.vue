<template>
  <div class="map-container">
    <svg ref="mainSvg" class="main-svg">
      <g ref="mainG">
        <foreignObject ref="foreignObject" style="display: none">
          <div ref="foreignDiv" contenteditable></div>
        </foreignObject>
      </g>
    </svg>
    <svg ref="measureSvg"></svg>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useTreeData, useRender } from '../hooks'

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
      store.dispatch('setRefs', {
        mainSvg: mainSvg.value,
        mainG: mainG.value,
        measureSvg: measureSvg.value,
        foreignObject: foreignObject.value,
        foreignDiv: foreignDiv.value
      })
      const treedData = useTreeData(props.modelValue)
      store.dispatch('setTreedData', treedData)
      useRender()
    })
    return {
      mainSvg, mainG, measureSvg, foreignObject, foreignDiv
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/css/mixin';
.map-container {
  @include wh100;
  .main-svg{
    @include wh100;
    background-color: #eeeef3;
  }
}
</style>
