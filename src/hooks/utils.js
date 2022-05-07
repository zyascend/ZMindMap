import { ElMessage } from 'element-plus'
import saveSvg from 'save-svg-as-png'

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

// 防抖：动作绑定事件，动作发生后一定时间后触发事件，在这段时间内，如果该动作又发生，则重新等待一定时间再触发事件。
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

// 节流： 动作绑定事件，动作发生后一段时间后触发事件，在这段时间内，如果动作又发生，则无视该动作，直到事件执行完后，才能重新触发。
export function throttle (fn, wait) {
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

export async function convertToImg (name) {
  const _svg = document.getElementById('main-svg')
  const _clone = _svg.cloneNode(true)
  // clone的Node无法获取到正常的宽高 需额外设置
  const _rect = _svg.getBoundingClientRect()
  _clone.viewBox.baseVal.width = _rect.width
  _clone.viewBox.baseVal.height = _rect.height
  // 添加水印
  const _waterPrint = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  _waterPrint.setAttribute('x', _rect.width - 150)
  _waterPrint.setAttribute('y', _rect.height - 10)
  _waterPrint.setAttribute('style', 'color:#000;opacity:0.2;font-size:16px;')
  _waterPrint.innerHTML = '@map.kimjisoo.cn'
  _clone.appendChild(_waterPrint)
  await saveSvg.saveSvgAsPng(_clone, name + '.png')
}
