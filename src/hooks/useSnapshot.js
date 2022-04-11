/**
 * 配合[ctrl + z]实现操作可撤回
 */
import { deepClone } from './utils'

export default class Snapshot {
  constructor (length = 20) {
    this.length = length
    this.snapshots = []
    this.cursor = -1
  }

  get hasPrev () {
    return this.cursor > 0
  }

  snap (data) {
    // 记录数据快照
    const snapshot = deepClone(data)
    // 去除旧分支
    while (this.cursor < this.snapshots.length - 1) { this.snapshots.pop() }
    this.snapshots.push(snapshot)
    // 确保历史记录条数限制
    if (this.snapshots.length > this.length) { this.snapshots.shift() }
    this.cursor = this.snapshots.length - 1
    console.log('snap', this.snapshots)
  }

  prev () {
    if (this.hasPrev) {
      this.cursor = this.cursor - 1
      console.log(this.cursor, this.snapshots, this.snapshots[this.cursor])
      return deepClone(this.snapshots[this.cursor])
    }
    return null
  }
}
