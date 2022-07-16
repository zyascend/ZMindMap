<template>
  <map-render :renderData="renderData" :curStyle="curStyle" />
  <map-bar />
</template>

<script>
import { defineComponent, ref, onUnmounted, watchEffect, computed } from 'vue'
import useMapStore from '@/store/map'
import useMap from '@/hooks/map/useMap'
import MapRender from '@/components/map/MapRender'
import MapBar from '@/components/map/MapBar'
import useAutoZoom from '@/hooks/map/useAutoZoom'
import { websiteCfg } from '@/configs'

export default defineComponent({
  name: 'mindmap',
  components: { MapRender, MapBar },
  setup() {
    const store = useMapStore()
    // 当前文档的style
    const curStyle = computed(
      () => store?.mapData?.styles || websiteCfg.defaultMapStyle
    )
    const renderData = ref({})

    useAutoZoom(renderData)
    onUnmounted(() => {
      document.onkeydown = undefined
    })
    watchEffect(() => {
      if (!store.treedData) return
      renderData.value = useMap(store.treedData, curStyle.value.mapStyleId)
    })
    return {
      curStyle,
      renderData
    }
  }
})
</script>
