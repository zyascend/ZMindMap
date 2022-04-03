import * as d3 from './d3'
import store from '../store'

export class TreeDataCreater {
  constructor ({ measureSvg, treeStyle, gapY = 14, gapX = 60, maxNodeWidth = 250 } = {}) {
    this.measureSvg = measureSvg
    this.treeStyle = treeStyle
    this.gapY = gapY
    this.gapX = gapX
    this.maxNodeWidth = maxNodeWidth
    this.offsetBottom = 4
    this.borderXPadding = 8
    this.borderYPadding = 3
    this.borderXPaddingLeaf = 4
    this.borderYPaddingLeaf = 2
    this.borderRadius = 3
  }

  create (root) {
    this.measureWidthAndHeight(root)
    this.calculateXY(root)
    this.handleTranslate(root)
    const path = this.calcPaths(root.links())
    return {
      path,
      node: root.descendants()
    }
  }

  calcPaths (links) {
    return links.map(l => this.pathData(l))
  }

  pathData (d) {
    let bottomLine = ''
    let bezierLine = ''
    let bottomLineLeaf = ''

    const { x, y, contentWidth, rectHeight, depth } = d.source
    const bézierCurveGenerator = d3.linkHorizontal().x(d => d.x).y(d => d.y)

    if (depth === 0) {
      bezierLine = bézierCurveGenerator({
        source: { x: x + contentWidth + this.borderXPadding - 2, y: y - rectHeight / 2 - this.offsetBottom },
        target: { x: d.target.x - this.borderXPadding + 2, y: d.target.y - d.target.rectHeight / 2 - this.offsetBottom }
      })
    } else if (depth === 1) {
      const end = { x: d.target.x, y: d.target.y }
      bezierLine = bézierCurveGenerator({
        source: { x: x + contentWidth + this.borderXPadding - 2, y: y - rectHeight / 2 - this.offsetBottom },
        target: end
      })
      if (!d.target.children) {
        bottomLineLeaf = `M${end.x} ${end.y}L${end.x + d.target.contentWidth} ${end.y}`
      }
    } else {
      const start = { x: x + contentWidth, y }
      const end = { x: d.target.x, y: d.target.y }
      bottomLine = `M${x} ${y}L${start.x} ${y}`
      bezierLine = bézierCurveGenerator({
        source: start,
        target: end
      })
      if (!d.target.children) {
        bottomLineLeaf = `M${end.x} ${end.y}L${end.x + d.target.contentWidth} ${end.y}`
      }
    }
    return {
      data: `${bottomLine}${bezierLine}${bottomLineLeaf}`,
      id: `${d.source.id}|${d.target.id}`
    }
  }

  handleTranslate (root) {
    root.each(node => {
      node.tx = node.x
      node.ty = node.y - node.rectHeight - this.offsetBottom
    })
  }

  meanY (children) {
    if (children.length === 1) {
      return children[0].y
    }
    return children.reduce((y, c) => y + c.y, 0) / children.length
  }

  calculateXY (root) {
    let preNode
    // 算Y值-后序遍历
    root.eachAfter(node => {
      node._id = node.data.id
      const { children, rectHeight } = node
      if (children) {
        node.y = this.meanY(children)
        const extraY = node.children[0].y - this.gapY - (node.y - node.rectHeight)
        if (extraY > 0) {
          node.each(n => {
            n.y = n.y + extraY
          })
        }
      } else {
        node.y = preNode
          ? preNode.y + rectHeight + this.gapY
          : (node.y ? node.y : 30 + rectHeight)
        preNode = node
      }
    })
    // 算X值-前序遍历
    root.eachBefore(node => {
      const { depth, children, rectWidth } = node
      if (depth === 0) {
        node.x = node.x ? node.x : 10
      }
      if (children) {
        children.forEach(c => {
          c.x = node.x + rectWidth + this.gapX
        })
      }
    })
  }

  measureContent (root) {
    // ! 通过下面方式动态计算宽高 配合foreignObject实现自动换行
    const f = this.measureSvg.append('foreignObject').attr('width', this.maxNodeWidth)
    // 根节点字大一点
    const fontSize = root.depth === 0 ? 16 : 14
    f.append('xhtml:div')
      .attr('style', `word-break:normal; width:auto;width:fit-content;display:block;white-space:pre-wrap;word-wrap:break-word;overflow:hidden;font-size:${fontSize}px;`)
      .text(root.data.name)
    // ! 【大坑】：取这两值一定要在 f.remove() 之前
    const { clientWidth, clientHeight } = f.node().firstElementChild
    f.remove()
    return { clientWidth, clientHeight }
  }

  measureWidthAndHeight (root) {
    const { clientWidth, clientHeight } = this.measureContent(root)
    root.contentWidth = clientWidth
    root.contentHeight = clientHeight
    // 节点的内容相关属性提前计算好
    // 1.关于外边框
    root.rectX = root.children ? -this.borderXPadding : -this.borderXPaddingLeaf
    root.rectY = root.children ? -this.borderYPadding : -this.borderYPaddingLeaf
    root.rectRX = this.borderRadius
    root.rectRY = this.borderRadius
    root.rectWidth = root.contentWidth + (root.children ? this.borderXPadding : this.borderXPaddingLeaf) * 2
    root.rectHeight = root.contentHeight + (root.children ? this.borderYPadding : this.borderYPaddingLeaf) * 2
    // 2.关于foreignObject
    root.foWidth = root.contentWidth
    root.foHeight = root.contentHeight
    // 3.关于collapse按钮
    root.collapseX = root.contentWidth + this.borderXPadding
    root.collapseY = (root.contentHeight - 12) / 2
    root.collapseWidth = 12
    root.collapseHeight = 12

    if (root.children && root.children.length) {
      for (const child of root.children) {
        this.measureWidthAndHeight(child)
      }
    }
  }
}

const useMap = content => {
  const { name, noteList } = content
  const data = {
    name,
    id: '-1',
    children: noteList,
    _children: [],
    collapsed: false
  }
  // store.dispatch('setTreeData', data)
  const hierarchyData = d3.hierarchy(data)
  const measureSvg = store.getters.getSelections.measureSvg
  const creator = new TreeDataCreater({ measureSvg })
  const treedData = creator.create(hierarchyData)
  return treedData
}

export default useMap
