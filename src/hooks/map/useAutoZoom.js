import { onMounted, onUnmounted, onActivated, watch, nextTick } from 'vue'
import zoomMap from './zoomMap'
import { debounce } from '../utils'

export default function useAutoZoom(deps) {
  const observedEles = []
  const observers = []

  const updateCb = debounce(() => {
    zoomMap()
  }, 500)

  onMounted(() => {
    // 监听侧边栏折叠
    const $sideContent = document.getElementById('siderContent')
    $sideContent && observedEles.push($sideContent)

    observedEles.forEach(ele => {
      const watcher = new MutationObserver(updateCb)
      watcher.observe(ele, {
        attributes: true,
        attributeFilter: ['style']
      })
      observers.push(watcher)
    })
    // 监听窗口大小变化
    window.onresize = updateCb
  })
  // 监听导图数据变化
  watch(
    deps,
    () => {
      nextTick(updateCb)
    },
    {
      immediate: true
    }
  )
  onUnmounted(() => {
    window.onresize = null
    observers.forEach(watcher => {
      watcher.disconnect()
      watcher.takeRecords()
    })
    observers.length = 0
  })

  onActivated(() => {
    updateCb()
  })
}
