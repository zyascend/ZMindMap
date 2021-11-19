<template>
  <el-container>
    <el-aside width="150px">Aside</el-aside>
    <el-container>
      <el-header height="30px">Header</el-header>
      <el-main>
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
                <img src="../assets/pic/fit-view.svg" alt="">
              </div>
            </el-tooltip>
          <div class="tool-item">
            <img src="../assets/pic/theme.svg" alt="">
          </div>
        </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { defineComponent, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useZoomMap } from '../hooks'
import MindMap from '../components/MindMap.vue'
import citys from '../mock/city'

export default defineComponent({
  name: 'Home',
  components: {
    MindMap
  },
  setup () {
    const store = useStore()
    // const mapData = reactive(useFetchData())
    // const mapData = computed(() => store.getters.getColumns)
    const mapData = computed(() => citys)
    const fitView = () => {
      useZoomMap.fitView()
    }
    onMounted(() => {
      store.dispatch('fetchColumns')
    })
    return {
      mapData,
      fitView
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
