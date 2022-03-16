import { ElMessage } from 'element-plus'

/**
 * 深拷贝：新对象的改变不影响旧对象
 * 1. [JSON.stringfy JSON.parse]: 无法克隆方法/循环引用无法解决
 * 2. [递归]: 循环引用无法解决 改进: 使用Map记录是否克隆过
 */
export const deepClone = (target, map = new Map()) => {
  if (target === null || typeof target !== 'object') {
    return target
  }
  const cache = map.get(target)
  if (cache) {
    return cache
  }
  const isArray = Array.isArray(target)
  const result = isArray ? [] : {}
  map.set(target, result)
  if (isArray) {
    target.forEach((item, index) => {
      result[index] = deepClone(item, map)
    })
  } else {
    Object.keys(target).forEach(key => {
      result[key] = deepClone(target[key], map)
    })
  }
  return result
}

export const ErrorTip = msg => {
  ElMessage.error(msg)
}

export const dateFormatter = timestamp => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  const hour = date.getHours()
  let minutes = date.getMinutes()
  if (year === new Date().getFullYear()) {
    year = ''
  }
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  return `${year ? `${year}年` : ''}${month}月${day}日 ${hour}:${minutes}`
}

export function debounce (fn, wait) {
  let timer
  return function () {
    const _this = this
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      fn.apply(_this, args)
    }, wait)
  }
}

export function thorttle (fn, wait) {
  let timer
  return function () {
    const _this = this
    const args = arguments

    if (!timer) {
      timer = setTimeout(function () {
        timer = null
        fn.apply(_this, args)
      }, wait)
    }
  }
}
