import * as d3 from './d3'
import { getMultiline } from './useTreeData'

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
    .attr('transform', function (d) {
      var cx = d.x
      var cy = d.y - d.height - 4
      return 'translate(' + cx + ',' + cy + ')'
    })

  const getTspanData = d => {
    const multiline = getMultiline(d.data.name)
    const height = d.height / multiline.length
    return multiline.map((name) => ({ name, height }))
  }

  gs.append('text')
    .attr('class', 'text')
    .selectAll('tspan').data(getTspanData).enter().append('tspan')
    .attr('alignment-baseline', 'text-before-edge')
    .text((d) => d.name || ' ')
    .attr('x', 0)
    .attr('dy', (d, i) => i ? d.height : 0)
}

const useDrawMap = (treedData, selections) => {
  drawPath(treedData.links(), selections.mainG)
  drawText(treedData.descendants(), selections.mainG)
}
export default useDrawMap
