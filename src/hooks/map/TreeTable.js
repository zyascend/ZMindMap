/* eslint-disable no-param-reassign */
import Tree from './Tree'

export default class TableTree extends Tree {
  constructor() {
    super()

    this.defaultWidth = 150
    this.maxWidth = 350
    this.defaultHeight = 60
    this.defaultRootHeight = 80
    this.padding = 20
    this.defaultMarkerHeight = 18
    this.defaultMarkerWidth = 18
    this.markerOverlap = 7
    this.textMarkersGap = 10
    this.rectRadius = 0
    this.strokeWidth = 1.5
  }

  create(root) {
    this.measureWidthAndHeight(root)
    this.calculateXY(root)
    return {
      paths: undefined,
      nodes: root.descendants()
    }
  }

  measureWidthAndHeight(root) {
    // 后续遍历 初步计算 父依赖于子
    root.eachAfter(node => {
      this.measureTextSize(node)
      this.measureMarkers(node)
      this.measureImageSize(node)
      this.measureWH(node)
    })
    // 前续遍历 修正计算 用于宽度充满 子依赖于父
    root.eachBefore(node => {
      const { children, parent } = node
      if (node.depth === 0) return
      if (node.depth === 1) {
        node.w = parent.w
        if (!children) {
          // 宽度充满
          node.cw = node.w
        }
      } else {
        node.w = parent.w - parent.cw
        if (!children) {
          node.cw = node.w
        }
      }
      node.outLineW = node.cw - 2 * node.outLineOffset
      node.outLineH = node.ch - 2 * node.outLineOffset
    })
  }

  measureWH(node) {
    node.rectRadius = this.rectRadius
    node.strokeWidth = this.strokeWidth

    node.outLineOffset = 2

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

    const { children, depth } = node
    if (!children) {
      node.w = node.cw
      node.h = node.ch
    } else {
      const maxW = Math.max(...children.map(c => c.w))
      const sumH = children.reduce((p, c) => p + c.h, 0)
      if (depth === 0) {
        node.cw = Math.max(maxW, node.cw)
        node.w = node.cw
        node.h = node.ch + sumH
      } else {
        // TODO 假如父元素自身高度超过子元素之和 要扩充最后一个子元素的宽度
        // TODO 但是子元素还有子元素呢？？？
        node.ch = Math.max(node.ch, sumH)
        node.w = node.cw + maxW
        node.h = node.ch
      }
    }
  }

  measureSelf(node) {
    node.rectRadius = this.rectRadius
    node.cw = Math.max(
      node.tw + node.mw + this.textMarkersGap + this.padding * 2,
      this.defaultWidth
    )
    node.ch = Math.max(node.th + this.padding * 2, this.defaultHeight)
    node.w = node.cw
    node.h = node.ch
  }

  measureWithChildren(node) {
    const { children, depth } = node
    const maxW = Math.max(...children.map(c => c.w))
    const sumH = this.sumH(children)
    if (depth === 0) {
      node.cw = maxW
      node.ch = Math.max(node.th + this.padding * 2, this.defaultRootHeight)
      node.w = node.cw
      node.h = node.ch + sumH
    } else {
      node.cw = Math.max(
        node.tw + node.mw + this.textMarkersGap + this.padding * 2,
        this.defaultWidth
      )
      // TODO 假如父元素自身高度超过子元素之和 要扩充最后一个子元素的宽度
      // TODO 但是子元素还有子元素呢？？？
      node.ch = Math.max(node.th + this.padding * 2, sumH)
      node.w = node.cw + maxW
      node.h = node.ch
    }
  }

  calculateInnerXY(node) {
    const { mw, cw, tw, th, mh, ch, iw, children } = node
    if (children) {
      node.mx = this.padding
      node.tx = node.mx + mw + (mw ? this.textMarkersGap : 0)
      node.ty = ch - this.padding - th - 4
      node.my = node.ty + th / 2 - mh / 2 + 4
      node.ix = node.tx
      node.iy = this.padding
    } else {
      node.ty = ch - this.padding - th - 4
      node.tx = cw - this.padding - tw

      node.mx = node.tx - (mw ? this.textMarkersGap : 0) - mw
      node.my = node.ty + th / 2 - mh / 2 + 4

      node.ix = cw - this.padding - iw
      node.iy = this.padding
    }
  }

  calculateXY(root) {
    // 算X值-前序遍历
    let lastNode
    root.eachBefore(node => {
      this.calculateInnerXY(node)
      const { depth } = node
      if (depth === 0) {
        node.x = 140
        node.y = 100
      } else if (depth === 1) {
        if (depth < lastNode.depth) {
          const realLastNode = this.findRealLastNode(node)
          node.x = realLastNode.x
          node.y = realLastNode.y + realLastNode.h
        } else {
          node.x = lastNode.x
          node.y = lastNode.y + lastNode.ch
        }
      } else if (depth < lastNode.depth) {
        const realLastNode = this.findRealLastNode(node)
        node.x = realLastNode.x
        node.y = realLastNode.y + realLastNode.h
      } else if (depth === lastNode.depth) {
        node.x = lastNode.x
        node.y = lastNode.y + lastNode.h
      } else {
        node.x = lastNode.x + lastNode.cw
        node.y = lastNode.y
      }
      lastNode = node
    })
  }

  findRealLastNode(node) {
    const brothers = node.parent.children
    let bro
    // eslint-disable-next-line no-restricted-syntax
    for (const index in brothers) {
      if (node.data.id === brothers[index].data.id) {
        bro = brothers[index - 1]
        break
      }
    }
    return bro
  }
}
