<template>
  <div class="map-wrapper">
    <mind-map v-model="mapData"></mind-map>
    <div class="toolbar">
      <el-tooltip
        class="tool-item"
        effect="light"
        content="适应当前大小"
        popper-class="popper"
        placement="left">
        <div class="" @click="fitView">
          <img :src="ICON_FITVIEW" alt="">
        </div>
      </el-tooltip>
    </div>
    <div class="tool-item">
      <img :src="ICON_THEME" alt="">
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useZoomMap } from '@/hooks'
import MindMap from '@/components/MindMap.vue'
// import citys from '@/mock/city'
import ICON_FITVIEW from '@/assets/pic/fit-view.svg'
import ICON_THEME from '@/assets/pic/theme.svg'

export default defineComponent({
  components: {
    MindMap
  },
  setup () {
    const store = useStore()
    // const mapData = computed(() => store.getters.getColumns)
    const mapData = computed(() => null)
    const fitView = () => {
      useZoomMap.fitView()
    }
    onMounted(() => {
      store.dispatch('fetchColumns')
    })
    return {
      mapData,
      fitView,
      ICON_FITVIEW,
      ICON_THEME
    }
  }
})
</script>
<style lang="scss">
@import '../assets/css/mixin';
.map-wrapper {
  @include wh100;
  position: relative;
  .toolbar {
    @include vertFlex;
    position: absolute;
    z-index: 2;
    top: 50px;
    right: 50px;
    border: 1px solid #dee0e3;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 8px 4px rgba(31, 35, 41, .06);
    user-select: none;
    padding: 8px;
    cursor: pointer;
    .tool-item + .tool-item {
      @include wh(16px, 16px);
      margin-top: 8px;
    }
  }
}
.popper {
  font-size: 10px !important;
  padding: 6px !important;
}
</style>
