import store from '../store'
import * as d3 from './d3'
import { getMultiline } from './useTreeData'
import PIC_ADD from '../assets/pic/add.svg'

const onEditting = (data) => {
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

  foreignDiv.textContent = data.data.name
  foreignDiv.focus()
  // 自动选中所有文字
  const currentSelection = getSelection()
  if (currentSelection) currentSelection.selectAllChildren(foreignDiv)
}

const drawPath = (links, mainG) => {
  // 创建一个贝塞尔生成曲线生成器
  const bézierCurveGenerator = d3.linkHorizontal().x(d => d.x).y(d => d.y)

  mainG.append('g')
    .selectAll('path')
    .data(links)
    .enter()
    .append('path')
    .attr('d', d => {
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
    })
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
}

const drawText = (nodes, mainG) => {
  const gs = mainG.append('g')
    .selectAll('g')
    .data(nodes)
    .enter()
    .append('g')
    .attr('id', d => `g-id-${d._id}`)
    .attr('transform', d => {
      var cx = d.x
      var cy = d.y - d.height - 6
      return 'translate(' + cx + ',' + cy + ')'
    })
    .on('mouseenter', (event, d) => {
      d3.select(`#g-id-${d._id}`).attr('class', 'g-hover')
    })
    .on('mouseleave', (event, d) => {
      const selectedG = d3.select(`#g-id-${d._id}`)
      const editting = selectedG.nodes()[0].classList[0] === 'g-editting'
      !editting && d3.selectAll('.g-hover').attr('class', '')
      console.log('mouseleave', d.data.name, selectedG.nodes()[0].classList[0])
    })
    .on('mousedown', (event, d) => {
      const selectedG = d3.select(`#g-id-${d._id}`)
      const selected = selectedG.nodes()[0].classList[0] === 'g-selected'
      if (!selected) {
        d3.selectAll('.g-selected').attr('class', '')
        selectedG.attr('class', 'g-selected')
      } else {
        event.preventDefault()
        const gs = d3.select(`#g-id-${d._id}`)
        gs.attr('class', 'g-editting')
        onEditting(d)
      }
    })

  const getTspanData = d => {
    const multiline = getMultiline(d.data.name)
    const height = d.height / multiline.length
    return multiline.map((name) => ({ name, height }))
  }

  gs.append('text')
    .attr('id', d => `text-id-${d._id}`)
    .selectAll('tspan').data(getTspanData).enter().append('tspan')
    .attr('alignment-baseline', 'text-before-edge')
    .text((d) => d.name || ' ')
    .attr('x', 0)
    .attr('dy', (d, i) => i ? d.height : 0)

  const padding = 3
  const radius = 3
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
}

const useDrawMap = () => {
  const treedData = store.getters.getTreedData
  const selections = store.getters.getSelections
  drawPath(treedData.links(), selections.mainG)
  drawText(treedData.descendants(), selections.mainG)
  // TODO 处理冒泡事件
  // selections.mainSvg.on('mousedown', (event, d) => {
  //   // event.stopPropagation()
  //   d3.selectAll('.rect-selceted').attr('class', '')
  //   event.stopPropagation()
  // })
}
export default useDrawMap
