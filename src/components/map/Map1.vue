<template>
  <map-render :renderData="renderData" :curStyle="curStyle" />
  <map-bar />
</template>

<script>
import { defineComponent, ref, onUnmounted, watchEffect, computed } from 'vue'
import useMapStore from '@/store/map'
import useMap from '@/hooks/map/useMap1'
import MapRender from '@/components/map/MapRender'
import MapBar from '@/components/map/MapBar'
import useAutoZoom from '@/hooks/map/useAutoZoom'

export default defineComponent({
  name: 'mindmap',
  components: { MapRender, MapBar },
  setup() {
    const { websiteCfg } = window.CFG
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
    const nodeMap = ref(new Map())
    watchEffect(() => {
      if (!store.treeContent) return
      const { paths, root } = useMap(
        store.treeContent,
        store.mapData.name,
        nodeMap.value,
        curStyle.value.mapStyleId
      )
      const descendants = root.descendants()
      descendants.forEach(d => {
        // eslint-disable-next-line no-param-reassign
        d.data.patchFlags = 0
        nodeMap.value.set(d.data.id, d)
      })
      renderData.value = {
        paths,
        nodes: root.descendants()
      }
    })
    return {
      curStyle,
      renderData
    }
  }
})
</script>
