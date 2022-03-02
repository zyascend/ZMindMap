import store from '../store'
import * as d3 from './d3'
import { getMultiline, appendNewChild, deleteNode } from './useTreeData'
import PIC_ADD from '../assets/pic/add.svg'

import emitter from './mitt'

let pathG
let infoG
let currentData

const onEditting = data => {
  console.log('onEditting', data)
  const foreignObject = store.getters.getSelections.foreignObject
  const foreignDiv = store.getters.getRefs.foreignDiv
  foreignObject
    .attr('x', data.x)
    .attr('y', data.y - data.height - 6)
    .attr('data-id', data._id)
    .attr('data-name', data.data.name)
    .style('display', '')
    .attr('width', data.width)
    .attr('height', data.height)
  console.log('y', data.y - data.height - 6)
  foreignDiv.textContent = data.data.name
  foreignDiv.focus()
  // 自动选中所有文字
  const currentSelection = getSelection()
  if (currentSelection) currentSelection.selectAllChildren(foreignDiv)
}

/**
 * 检查当前节点的状态
 * @param {*} id 节点id
 * @param {*} status 需要检查的状态
 * @returns
 */
const checkNodeStatus = (id, status) => {
  const currentClass = d3.select(`#g-id-${id}`).nodes()[0].classList[0]
  if (status === 'edit') {
    return currentClass === 'g-editting'
  }
  if (status === 'select') {
    return currentClass === 'g-selected'
  }
}

const getCallback = () => {
  const transformData = d => {
    const cx = d.x
    const cy = d.y - d.height - 6
    return 'translate(' + cx + ',' + cy + ')'
  }
  const onMouseEnter = (event, d) => {
    const selectedG = d3.select(`#g-id-${d._id}`)
    const editting = selectedG.nodes()[0].classList[0] === 'g-editting'
    const selected = selectedG.nodes()[0].classList[0] === 'g-selected'
    !editting && !selected && selectedG.attr('class', 'g-hover')
  }
  const onMouseLeave = (event, d) => {
    const selectedG = d3.select(`#g-id-${d._id}`)
    const editting = selectedG.nodes()[0].classList[0] === 'g-editting'
    !editting && d3.selectAll('.g-hover').attr('class', '')
  }
  const onMouseDown = (event, d) => {
    const selectedG = d3.select(`#g-id-${d._id}`)
    const selected = selectedG.nodes()[0].classList[0] === 'g-selected'
    if (!selected) {
      d3.selectAll('.g-selected').attr('class', '')
      selectedG.attr('class', 'g-selected')
      currentData = d
    } else {
      const target = event.target.tagName
      if (target !== 'image') {
        event.preventDefault()
        const gs = d3.select(`#g-id-${d._id}`)
        gs.attr('class', 'g-editting')
        onEditting(d)
      }
    }
  }

  const getTspanData = d => {
    const multiline = getMultiline(d.data.name)
    const height = d.height / multiline.length
    return multiline.map((name) => ({ name, height }))
  }
  return { transformData, onMouseEnter, onMouseLeave, onMouseDown, getTspanData }
}

const drawPath = (links, mainG) => {
  // 创建一个贝塞尔生成曲线生成器
  const bézierCurveGenerator = d3.linkHorizontal().x(d => d.x).y(d => d.y)
  const pathData = d => {
    const { x, y, width } = d.source
    const start = { x: x + width, y }
    const end = { x: d.target.x, y: d.target.y }

    const bottomLine = `M${x} ${y}L${start.x} ${y}`
    let bottomLineLeaf = ''
    const bezierLine = bézierCurveGenerator({ source: start, target: end })
    if (!d.target.children) {
      bottomLineLeaf = `M${end.x} ${end.y}L${end.x + d.target.width} ${end.y}`
    }
    return `${bottomLine}${bezierLine}${bottomLineLeaf}`
  }
  // update
  pathG = pathG || mainG.append('g')
  const path = pathG.selectAll('path').data(links)
  path.attr('d', pathData)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
  // enter
  path.enter()
    .append('path')
    .attr('d', pathData)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    // .merge(gp)
  // exit
  path.exit().remove()
}

const drawText = (nodes, mainG) => {
  const { transformData, onMouseEnter, onMouseLeave, onMouseDown, getTspanData } = getCallback()
  const padding = 3
  const radius = 3

  infoG = infoG || mainG.append('g').attr('id', 'infoG')
  const gs = infoG
    .selectAll('g')
    .data(nodes)
    .enter()
    .append('g')
    .attr('id', d => `g-id-${d._id}`)
    .attr('transform', transformData)
    .on('mouseenter', onMouseEnter)
    .on('mouseleave', onMouseLeave)
    .on('mousedown', onMouseDown)
  gs.append('text')
    .attr('id', d => `text-id-${d._id}`)
    .selectAll('tspan').data(getTspanData).enter().append('tspan')
    .attr('alignment-baseline', 'text-before-edge')
    .text(d => d.name || '')
    .attr('x', 0)
    .attr('dy', (d, i) => i ? d.height : 0)
  gs.append('rect')
    .attr('id', d => `rect-id-${d._id}`)
    .attr('x', -padding)
    .attr('y', -padding)
    .attr('rx', radius)
    .attr('ry', radius)
    .attr('width', d => d.width + padding * 2)
    .attr('height', d => d.height + padding * 2)
  gs.append('image')
    .attr('id', d => `image-id-${d._id}`)
    .attr('alt', '')
    .attr('x', d => d.width - 12)
    .attr('y', d => d.height + 6 - 12)
    .attr('width', '24')
    .attr('height', '24')
    .attr('xlink:href', PIC_ADD)
    .on('mousedown', (event, d) => {
      event.preventDefault()
      appendNewChild(d._id)
    })
}

const useDrawMap = () => {
  const treedData = store.getters.getTreedData
  const selections = store.getters.getSelections
  // 使用d3.js的enter与exit结合进行节点更新
  drawPath(treedData.links(), selections.mainG)
  // 暴力删除dom，然后全部绘制进行节点更新
  // TODO 待优化
  const g = document.querySelector('#infoG')
  if (g) {
    g.innerHTML = ''
  }
  drawText(treedData.descendants(), selections.mainG)
  emitter.all.delete('map-key-down')
  emitter.on('map-key-down', e => {
    switch (e.keyCode) {
      case 46:
        // delete键 删除当前选中的节点
        deleteNode(currentData.parent?._id, currentData._id)
        break
      case 13:
        // enter键 添加兄弟节点
        if (checkNodeStatus(currentData._id, 'select')) {
          if (currentData?.parent) {
            appendNewChild(currentData.parent._id)
          }
        }
        break
      case 9:
        // tab键 添加子节点
        if (checkNodeStatus(currentData._id, 'select')) {
          appendNewChild(currentData._id)
        }
        e.preventDefault()
        break
      default:
        break
    }
  })
}

export default useDrawMap
