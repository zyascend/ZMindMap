import Worker from './map.worker'

const myWorker = new Worker()
const callbackMap = new WeakMap()

myWorker.onmessage = e => {
  const { result, type } = e.data
  const callback = callbackMap?.get(type)
  if (callback) {
    callback(result)
  }
}
/**
 * TODO 回调函数 不够优雅 怎么解决
 * @param {*} source
 * @param {*} callback
 */
export default function getMd5(source, callback) {
  callbackMap.set('MD5', callback)
  myWorker.postMessage({ source, type: 'MD5' })
}
