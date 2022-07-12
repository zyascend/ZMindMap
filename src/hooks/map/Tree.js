/* eslint-disable no-param-reassign */
import { select } from 'd3-selection'
/**
 * 所有导图计算class的父类
 * 提取了公共计算方法 这些方法的逻辑不会随导图的风格变化所改变
 */
export default class Tree {
  constructor() {
    this.elMeasureSvg = select(document.getElementById('measureSvg'))
  }

  /**
   * 计算单张图片的尺寸
   * @param {} node
   */
  measureImageSize(node) {
    const { imgInfo } = node.data
    if (imgInfo) {
      node.iw = imgInfo.width
      node.ih = imgInfo.height
    } else {
      node.iw = 0
      node.ih = 0
    }
  }

  /**
   * 计算节点文字的尺寸 处理多行情况
   * @param {*} node
   * @returns
   */
  measureTextSize(node) {
    const {
      depth,
      data: { html }
    } = node
    const fontSize = depth === 0 ? 16 : 14
    const lineHeight = fontSize + 2
    const t = this.elMeasureSvg.append('text')
    t.selectAll('tspan')
      .data([html])
      .enter()
      .append('tspan')
      .text(d => d)
      .attr('x', 0)
      .attr('style', `font-size:${fontSize}px;line-height:${lineHeight}px;`)
    const { width, height } = t.node().getBBox()
    t.remove()

    if (width < this.maxWidth) {
      // 可以不用分为多行
      node.multiline = [html]
      node.tw = width
      node.th = height
      node.tspanDy = height
      return
    }

    // 文字太长 需要分为多行
    const lines =
      Math.floor(width / this.maxWidth) + (width % this.maxWidth ? 1 : 0)
    const multiline = []
    const lineLength = Math.floor((html.length * this.maxWidth) / width)
    for (let i = 0; i < html.length; i += lineLength) {
      multiline.push(html.substr(i, lineLength))
    }
    node.multiline = multiline
    node.tw = this.maxWidth
    node.th = height * lines
    node.tspanDy = height
  }

  /**
   * 计算贴纸标签的尺寸
   * @param {*} node
   * @returns
   */
  measureMarkers(node) {
    const {
      data: { markerList }
    } = node
    if (!markerList?.length) {
      node.mw = 0
      node.mh = 0
      return
    }
    node.mh = this.defaultMarkerHeight
    const size = markerList.length
    node.mw = this.defaultMarkerWidth * size - this.markerOverlap * (size - 1)
  }
}
