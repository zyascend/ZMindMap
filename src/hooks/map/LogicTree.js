/* eslint-disable no-param-reassign */
import { linkHorizontal } from 'd3-shape'
import Tree from './Tree'

export default class LogicTree extends Tree {
  constructor() {
    super()
    this.defaultWidth = 30
    this.maxWidth = 250
    this.defaultHeight = 40
    this.defaultRootHeight = 60
    this.padding = 10
    this.defaultMarkerHeight = 18
    this.defaultMarkerWidth = 18
    this.markerOverlap = 7
    this.textMarkersGap = 10
    this.gapY = 20
    this.gapX = 40
    this.rectRadius = 5
    this.strokeWidth = 0

    this.bézierCurveGenerator = linkHorizontal()
      .x(d => d.x)
      .y(d => d.y)
  }

  create(root) {
    const tagWH = '[TIME] 计算宽高耗时: '
    const tagXY = '[TIME] 计算位置耗时: '
    const tagPATH = '[TIME] 计算路径耗时: '
    const tagAll = '[TIME] 计算总耗时: '
    console.time(tagAll)

    console.time(tagWH)
    this.measureWidthAndHeight(root)
    console.timeEnd(tagWH)

    console.time(tagXY)
    this.calculateXY(root)
    console.timeEnd(tagXY)

    console.time(tagPATH)
    const paths = this.calculatePath(root)
    console.timeEnd(tagPATH)

    console.timeEnd(tagAll)
    return {
      paths,
      nodes: root.descendants()
    }
  }

  measureWidthAndHeight(root) {
    // 后续遍历 初步计算 父依赖于子
    root.eachAfter(node => {
      this.measureImageSize(node)
      this.measureTextSize(node)
      this.measureMarkers(node)
      this.measureWH(node)
    })
  }

  measureWH(node) {
    node.rectRadius = this.rectRadius
    node.strokeWidth = this.strokeWidth

    node.outLineOffset = 0

    const tmGap = node.mw ? this.textMarkersGap : 0
    const tiGap = node.ih ? this.textMarkersGap : 0
    node.cw = Math.max(
      Math.max(node.tw, node.iw) + node.mw + this.padding * 2 + tmGap,
      this.defaultWidth
    )
    node.ch = Math.max(
      this.padding * 2 + node.ih + tiGap + node.th,
      this.defaultHeight
    )
    const { children } = node
    if (!children) {
      node.w = node.cw
      node.h = node.ch
    } else {
      const maxW = Math.max(...children.map(c => c.w))
      const sumH = children.reduce((p, c) => p + c.h, 0)
      node.h = sumH + this.gapY * (children.length - 1)
      node.w = node.cw + this.gapX + maxW
    }

    node.outLineW = node.cw - node.outLineOffset * 2
    node.outLineH = node.ch - node.outLineOffset * 2
  }

  calculateInnerXY(node) {
    const { mw, th, mh, ch } = node
    node.mx = this.padding
    node.tx = node.mx + mw + (mw ? this.textMarkersGap : 0)
    node.ty = ch - this.padding - th - 4
    node.my = node.ty + th / 2 - mh / 2 + 4

    node.ix = node.tx
    node.iy = this.padding
  }

  calculateXY(root) {
    let anchor
    // 前序遍历 计算X
    root.eachBefore(node => {
      this.calculateInnerXY(node)
      const { depth } = node
      if (depth === 0) {
        node.x = 140
        anchor = node
        return
      }
      const { depth: lastDepth, cw, x } = anchor
      if (depth === lastDepth) {
        node.x = x
      } else if (depth > lastDepth) {
        node.x = x + cw + this.gapX
      } else {
        const bro = this.findPrevBrother(node)
        node.x = bro.x
      }
      anchor = node
    })
    // 后序遍历 计算Y
    anchor = undefined
    root.eachAfter(node => {
      const { depth } = node
      if (!anchor) {
        node.y = 100
        anchor = node
        return
      }
      const { depth: lastDepth, ch, y } = anchor
      if (depth < lastDepth) {
        const firstChild = node.children[0]
        node.y = firstChild.y + (y - firstChild.y + ch) / 2 - node.ch / 2
        // ![BUG]父节点很高 超过了第一个子节点
        if (node.y - node.ch / 2 < firstChild.y - firstChild.ch / 2) {
          // !TODO 还需要递归的处理该子节点的所有子代
          // !F**K 麻烦啊
          node.y = firstChild.y + 1
        }
      } else {
        const bottom = this.findBottom(anchor)
        node.y = Math.max(bottom.y + bottom.ch + this.gapY, y + ch + this.gapY)
      }
      anchor = node
    })
  }

  /**
   * 在已经计算过的节点中寻找与之最靠近的节点
   * @param {*} node
   * @returns
   */
  findBottom(node) {
    let bottom = node
    while (bottom?.children) {
      bottom = bottom.children[bottom.children.length - 1]
    }
    return bottom
  }

  calculatePath(root) {
    const links = root.links()
    const paths = links.map(l => this.getPathData(l))
    return paths
  }

  getPathData(link) {
    const { source, target } = link
    const { x: sx, y: sy, cw, ch: sh, id: sid } = source
    const { x: tx, y: ty, ch, id: tid } = target
    // 生成从一个源点到目标点的光滑的三次贝塞尔曲线
    const bezierLine = this.bézierCurveGenerator({
      source: {
        x: sx + cw,
        y: sy + sh / 2
      },
      target: {
        x: tx,
        y: ty + ch / 2
      }
    })
    return {
      data: bezierLine,
      id: `path-${sid}-${tid}`
    }
  }
}
