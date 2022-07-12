import { onMounted, onUnmounted, onActivated, watch, nextTick } from 'vue'
import zoomMap from './zoomMap'
import { debounce } from '../utils'

export default function useAutoZoom(renderData) {
  const observedEles = []
  const observers = []

  // ? 关于options https://developer.mozilla.org/zh-CN/docs/conflicting/Web/API/MutationObserver/observe_2f2addbfa1019c23a6255648d6526387
  const options = {
    attributes: true,
    attributeFilter: ['style']
  }

  const updateCb = debounce(() => {
    zoomMap()
  }, 500)

  onMounted(() => {
    // 监听侧边栏折叠
    const $sideContent = document.getElementById('siderContent')
    $sideContent && observedEles.push($sideContent)

    observedEles.forEach(ele => {
      const watcher = new MutationObserver(updateCb)
      watcher.observe(ele, options)
      observers.push(watcher)
    })
    // 监听窗口大小变化
    window.onresize = updateCb
  })
  // 监听导图数据变化
  watch(
    renderData,
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
