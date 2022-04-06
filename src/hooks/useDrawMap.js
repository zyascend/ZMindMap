import store from '../store/indexx'
import * as d3 from './d3'
// import { TreeDataCreater, getMultiline, appendNewChild, toggleExpandOrCollapse } from './useTreeData'
import { TreeDataCreater } from './useTreeData'
// import PIC_ADD from '@/assets/map/add.svg'
import PIC_COLLAPSE from '@/assets/map/arrow-left.svg'

// import emitter from './mitt'

// let pathG
// let infoG
// let currentData

const offsetBottom = 4
const borderXPadding = 8
const borderYPadding = 3
const borderXPaddingLeaf = 4
const borderYPaddingLeaf = 2
const borderRadius = 3

// const onEditting = data => {
//   console.log('onEditting', data)
//   const foreignObject = store.getters.getSelections.foreignObject
//   const foreignDiv = store.getters.getRefs.foreignDiv
//   foreignObject
//     .attr('x', data.x)
//     .attr('y', data.y - data.height - 6)
//     .attr('data-id', data._id)
//     .attr('data-name', data.data.name)
//     .style('display', '')
//     .attr('width', data.width)
//     .attr('height', data.height)
//   console.log('y', data.y - data.height - 6)
//   foreignDiv.textContent = data.data.name
//   foreignDiv.focus()
//   // 自动选中所有文字
//   const currentSelection = getSelection()
//   if (currentSelection) currentSelection.selectAllChildren(foreignDiv)
// }

/**
 * 检查当前节点的状态
 * @param {*} id 节点id
 * @param {*} status 需要检查的状态
 * @returns
 */
// const checkNodeStatus = (id, status) => {
//   const currentClass = d3.select(`#g-id-${id}`).nodes()[0].classList[0]
//   if (status === 'edit') {
//     return currentClass === 'g-editting'
//   }
//   if (status === 'select') {
//     return currentClass === 'g-selected'
//   }
// }

// const getCallback = () => {
//   const onMouseEnter = (event, d) => {
//     const selectedG = d3.select(`#g-id-${d._id}`)
//     const editting = selectedG.nodes()[0].classList[0] === 'g-editting'
//     const selected = selectedG.nodes()[0].classList[0] === 'g-selected'
//     !editting && !selected && selectedG.attr('class', 'g-hover')
//   }
//   const onMouseLeave = (event, d) => {
//     const selectedG = d3.select(`#g-id-${d._id}`)
//     const editting = selectedG.nodes()[0].classList[0] === 'g-editting'
//     !editting && d3.selectAll('.g-hover').attr('class', '')
//   }
//   const onMouseDown = (event, d) => {
//     const selectedG = d3.select(`#g-id-${d._id}`)
//     const selected = selectedG.nodes()[0].classList[0] === 'g-selected'
//     if (!selected) {
//       d3.selectAll('.g-selected').attr('class', '')
//       selectedG.attr('class', 'g-selected')
//       // currentData = d
//     } else {
//       const target = event.target.tagName
//       if (target !== 'image') {
//         event.preventDefault()
//         const gs = d3.select(`#g-id-${d._id}`)
//         gs.attr('class', 'g-editting')
//         onEditting(d)
//       }
//     }
//   }
//   return { onMouseEnter, onMouseLeave, onMouseDown, getTspanData }
// }

const drawPath = (links, mainG) => {
  // 创建一个贝塞尔生成曲线生成器
  const bézierCurveGenerator = d3.linkHorizontal().x(d => d.x).y(d => d.y)
  const pathData = d => {
    let bottomLine = ''
    let bezierLine = ''
    let bottomLineLeaf = ''

    const { x, y, width, height, depth } = d.source
    if (d.source.depth === 0) {
      bezierLine = bézierCurveGenerator({
        source: { x: x + width + borderXPadding - 2, y: y - height / 2 - offsetBottom },
        target: { x: d.target.x - borderXPadding + 2, y: d.target.y - d.target.height / 2 - offsetBottom }
      })
    } else if (depth === 1) {
      const end = { x: d.target.x, y: d.target.y }
      bezierLine = bézierCurveGenerator({
        source: { x: x + width + borderXPadding - 2, y: y - height / 2 - offsetBottom },
        target: end
      })
      if (!d.target.children) {
        bottomLineLeaf = `M${end.x} ${end.y}L${end.x + d.target.width} ${end.y}`
      }
    } else {
      const start = { x: x + width, y }
      const end = { x: d.target.x, y: d.target.y }
      bottomLine = `M${x} ${y}L${start.x} ${y}`
      bezierLine = bézierCurveGenerator({
        source: start,
        target: end
      })
      if (!d.target.children) {
        bottomLineLeaf = `M${end.x} ${end.y}L${end.x + d.target.width} ${end.y}`
      }
    }
    return `${bottomLine}${bezierLine}${bottomLineLeaf}`
  }
  // update
  const pathG = mainG.append('g')
  const path = pathG.selectAll('path').data(links)
  // path.attr('d', pathData)
  //   .attr('fill', 'none')
  //   .attr('stroke', 'black')
  //   .attr('stroke-width', 2)
  // enter
  path.enter()
    .append('path')
    .attr('d', pathData)
    // .merge(gp)
  // exit
  // path.exit().remove()
}

const drawText = (nodes, mainG) => {
  // const { transformData, onMouseEnter, onMouseLeave, onMouseDown, getTspanData } = getCallback()
  const transformData = d => {
    const cx = d.x
    const cy = d.y - d.height - offsetBottom
    return 'translate(' + cx + ',' + cy + ')'
  }
  const infoG = mainG.append('g').attr('id', 'infoG')
  const gs = infoG
    .selectAll('g')
    .data(nodes)
    .enter()
    .append('g')
    .attr('id', d => `g-id-${d._id}`)
    .attr('class', d => d.depth === 0 ? 'g-root' : d.depth === 1 ? 'g-subroot' : 'g-leaf')
    .attr('transform', transformData)
    // .on('mouseenter', onMouseEnter)
    // .on('mouseleave', onMouseLeave)
    // .on('mousedown', onMouseDown)

  // TODO 需要优化 将这些绘制参数在计算时一并写入d中
  // ! _id似乎not unique
  gs.append('rect')
    .attr('id', d => `rect-id-${d._id}`)
    .attr('x', d => d.children ? -borderXPadding : -borderXPaddingLeaf)
    .attr('y', d => d.children ? -borderYPadding : -borderYPaddingLeaf)
    .attr('rx', borderRadius)
    .attr('ry', borderRadius)
    .attr('width', d => d.width + (d.children ? borderXPadding : borderXPaddingLeaf) * 2)
    .attr('height', d => d.height + (d.children ? borderYPadding : borderYPaddingLeaf) * 2)

  // ? 如此链式调用太不优雅 如何让attr支持obj添加 [https://blog.csdn.net/qq_26728227/article/details/102836592]
  gs.append('foreignObject')
    .attr('id', d => `text-id-${d._id}`)
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('x', 0)
    .attr('dy', (d, i) => i ? d.height : 0)
    .append('xhtml:div')
    .text(d => {
      console.log('in fo', d)
      return d.data.name
    })

  gs.append('image')
    .attr('id', d => `image-collapse-id-${d._id}`)
    .attr('alt', '')
    .attr('class', d => d.children ? 'image-collapse' : '')
    .attr('x', d => d.width + borderXPadding)
    .attr('y', d => (d.height - 12) / 2)
    .attr('width', '12')
    .attr('height', '12')
    .attr('xlink:href', PIC_COLLAPSE)
    .on('mousedown', (event, d) => {
      event.preventDefault()
      console.log('toggleExpandOrCollapse > ', d)
      // toggleExpandOrCollapse(d._id)
    })
}

const useDrawMap = () => {
  const originTreeData = store.getters.getTreeData
  const selections = store.getters.getSelections

  const hierarchyData = d3.hierarchy(originTreeData)

  const measureSvg = store.getters.getSelections.measureSvg
  const creator = new TreeDataCreater({ measureSvg })
  const treedData = creator.create(hierarchyData)

  // 使用d3.js的enter与exit结合进行节点更新
  drawPath(treedData.links(), selections.mainG)
  // 暴力删除dom，然后全部绘制进行节点更新
  // TODO 待优化
  // const g = document.querySelector('#infoG')
  // if (g) {
  //   g.innerHTML = ''
  // }
  drawText(treedData.descendants(), selections.mainG)
  // emitter.all.delete('map-key-down')
  // emitter.on('map-key-down', e => {
  //   switch (e.keyCode) {
  //     case 46:
  //       // delete键 删除当前选中的节点
  //       deleteNode(currentData.parent?._id, currentData._id)
  //       break
  //     case 13:
  //       // enter键 添加兄弟节点
  //       if (checkNodeStatus(currentData._id, 'select')) {
  //         if (currentData?.parent) {
  //           appendNewChild(currentData.parent._id)
  //         }
  //       }
  //       break
  //     case 9:
  //       // tab键 添加子节点
  //       if (checkNodeStatus(currentData._id, 'select')) {
  //         appendNewChild(currentData._id)
  //       }
  //       e.preventDefault()
  //       break
  //     default:
  //       break
  //   }
  // })
}

export default useDrawMap
