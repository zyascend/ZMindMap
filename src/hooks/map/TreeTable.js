export class TreeTable {
  constructor (measureSvg) {
    this.measureSvg = measureSvg
    this.defaultWidth = 250
    this.maxWidth = 450
    this.defaultHeight = 60
    this.defaultRootHeight = 80
    this.padding = 20
    this.defaultMarkerHeight = 18
    this.defaultMarkerWidth = 18
    this.markerOverlap = 7
    this.textMarkersGap = 10
  }

  create (root) {
    this.measureWidthAndHeight(root)
    this.calculateXY(root)
    return {
      paths: undefined,
      nodes: root.descendants()
    }
  }

  measureWidthAndHeight (root) {
    // 后续遍历 初步计算 父依赖于子
    root.eachAfter(node => {
      this.measureTextSize(node)
      this.measureMarkers(node)
      const { children } = node
      if (!children) {
        // 叶子节点 只需计算自身
        this.measureSelf(node)
      } else {
        this.measureWithChildren(node)
      }
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
    })
  }

  measureTextSize (node) {
    if (!this.measureSvg) { throw new Error('measureSvg undefined') }
    const { depth, data: { html } } = node
    // 根节点字大一点
    const fontSize = depth === 0 ? 16 : 14
    const lineHeight = fontSize + 2
    const t = this.measureSvg.append('text')
    t.selectAll('tspan').data([html]).enter().append('tspan')
      .text((d) => d).attr('x', 0).attr('style', `font-size:${fontSize}px;line-height:${lineHeight}px;`)
    const { width, height } = t.node().getBBox()
    t.remove()

    if (width < this.maxWidth) {
      node.multiline = [html]
      node.tw = width
      node.th = height
      node.tspanDy = height
      return
    }

    const lines = Math.floor(width / this.maxWidth) + (width % this.maxWidth ? 1 : 0)
    const multiline = []
    const lineLength = Math.floor(html.length * this.maxWidth / width)
    for (let i = 0; i < html.length; i = i + lineLength) {
      multiline.push(html.substr(i, lineLength))
    }
    node.multiline = multiline
    node.tw = this.maxWidth
    node.th = height * lines
    node.tspanDy = height
  }

  measureMarkers (node) {
    const { data: { markerList } } = node
    if (!markerList?.length) {
      node.mw = 0
      node.mh = 0
      return
    }
    node.mh = this.defaultMarkerHeight
    const size = markerList.length
    node.mw = this.defaultMarkerWidth * size - this.markerOverlap * (size - 1)
  }

  measureSelf (node) {
    node.cw = Math.max(node.tw + node.mw + this.textMarkersGap + this.padding * 2, this.defaultWidth)
    node.ch = Math.max(node.th + this.padding * 2, this.defaultHeight)
    node.w = node.cw
    node.h = node.ch
  }

  measureWithChildren (node) {
    const { children, depth } = node
    const maxW = Math.max(...children.map(c => c.w))
    if (depth === 0) {
      node.cw = maxW
      node.ch = Math.max(node.th + this.padding * 2, this.defaultRootHeight)
      node.w = node.cw
      node.h = node.ch + this.sumH(children)
    } else {
      node.cw = Math.max(node.tw + node.mw + this.textMarkersGap + this.padding * 2, this.defaultWidth)
      node.ch = this.sumH(children)
      node.w = node.cw + maxW
      node.h = node.ch
    }
  }

  sumH (nodes) {
    return nodes.reduce((p, c) => p + c.h, 0)
  }

  findRealLastNode (node) {
    const brothers = node.parent.children
    for (const index in brothers) {
      if (node.data.id === brothers[index].data.id) {
        return brothers[index - 1]
      }
    }
  }

  calculateInnerXY (node) {
    const { mw, cw, tw, th, mh, ch, children } = node
    if (children) {
      node.mx = this.padding
      node.my = (ch - mh) / 2

      node.tx = node.mx + mw + (mw ? this.textMarkersGap : 0)
      node.ty = (ch - th) / 2 - 5 // ? 没搞懂为啥需要-5才能看起来是垂直居中
    } else {
      node.ty = (ch - th) / 2 - 5
      node.tx = cw - this.padding - tw

      node.mx = node.tx - this.textMarkersGap - mw
      node.my = (ch - mh) / 2
    }
  }

  calculateXY (root) {
    // 算X值-前序遍历
    let lastNode
    root.eachBefore(node => {
      this.calculateInnerXY(node)
      const { depth } = node
      if (depth === 0) {
        node.x = 10
        node.y = 10
      } else if (depth === 1) {
        if (depth < lastNode.depth) {
          const realLastNode = this.findRealLastNode(node)
          node.x = realLastNode.x
          node.y = realLastNode.y + realLastNode.h
        } else {
          node.x = lastNode.x
          node.y = lastNode.y + lastNode.ch
        }
      } else {
        if (depth < lastNode.depth) {
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
      }
      lastNode = node
    })
  }
}

export default TreeTable
