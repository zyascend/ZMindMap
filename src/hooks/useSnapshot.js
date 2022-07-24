/**
 * 配合[ctrl + z]实现操作可撤回
 */
import { onMounted, onUnmounted } from 'vue'
import useMapStore from '@/store/map'
import { deepClone } from './utils'

class Snapshot {
  constructor(length = 20) {
    this.length = length
    this.snapshots = []
    this.cursor = -1
  }

  get hasPrev() {
    return this.cursor > 0
  }

  snap(data) {
    // 记录数据快照
    const snapshot = deepClone(data)
    // 去除旧分支
    while (this.cursor < this.snapshots.length - 1) {
      this.snapshots.pop()
    }
    this.snapshots.push(snapshot)
    // 确保历史记录条数限制
    if (this.snapshots.length > this.length) {
      this.snapshots.shift()
    }
    this.cursor = this.snapshots.length - 1
  }

  prev() {
    if (this.hasPrev) {
      this.cursor -= 1
      return deepClone(this.snapshots[this.cursor])
    }
    return null
  }
}

export default function useSnapShot() {
  const snapshot = new Snapshot()
  const store = useMapStore()
  onMounted(() => {
    document.onkeydown = ev => {
      if (ev.ctrlKey && ev.keyCode === 90) {
        ev.preventDefault()
        if (snapshot.hasPrev) {
          store.setContent(snapshot.prev().content)
        }
      }
    }
  })
  onUnmounted(() => {
    document.onkeydown = undefined
  })
  const addSnapShot = () => {
    snapshot.snap({ content: store.content })
  }
  return addSnapShot
}
