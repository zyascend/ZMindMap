<template>
  <map-render :renderData="renderData" :curStyle="curStyle" />
  <map-bar />
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  onUnmounted,
  nextTick,
  watchEffect,
  computed
} from 'vue'
import useMapStore from 'store/map'
import useMap from 'hooks/map/useMap'
import useZoomMap from 'hooks/useZoomMap'
import MapRender from 'components/map/MapRender'
import MapBar from 'components/map/MapBar'

export default defineComponent({
  name: 'BaseMap',
  components: { MapRender, MapBar },
  setup() {
    const store = useMapStore()
    // 当前文档的style
    const curStyle = computed(() => store?.mapData.styles || {})
    const renderData = ref({})

    const MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver
    let sizeObserver
    let zoomTimer

    onMounted(() => {
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
    watchEffect(() => {
      if (!store.treedData) return
      renderData.value = useMap(store.treedData, curStyle.value.mapStyleId)
      nextTick(() => {
        zoomTimer = setTimeout(() => {
          useZoomMap()
        }, 350)
      })
    })
    const setObserver = () => {
      // 监听侧边栏的打开/折叠 使Map适应屏幕
      sizeObserver = new MutationObserver(mutations => {
        zoomTimer = setTimeout(() => {
          useZoomMap()
        }, 500)
      })
      const sideContent = document.getElementById('siderContent')
      sizeObserver.observe(sideContent, {
        attributes: true,
        attributeFilter: ['style'],
        attributeOldValue: true
      })
    }
    return {
      curStyle,
      renderData
    }
  }
})
</script>
