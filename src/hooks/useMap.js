import * as d3 from './d3'
import { useMapStore } from '@/store/map'

export class TreeDataCreater {
  constructor ({ measureSvg, treeStyle, gapY = 14, gapX = 60, maxNodeWidth = 250 } = {}) {
    this.measureSvg = measureSvg
    this.treeStyle = treeStyle
    this.gapY = gapY
    this.gapX = gapX
    this.maxNodeWidth = maxNodeWidth
    this.offsetBottom = 4
    this.borderXPadding = 4
    this.borderYPadding = 3
    this.borderRadius = 3
    this.offsetPath = 8
    this.btnSize = 10
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
      const horiStart = {
        x: x + contentWidth + this.borderXPadding,
        y: y - rectHeight / 2 - this.borderYPadding - this.offsetBottom
      }
      const horiEnd = {
        x: x + contentWidth + this.borderXPadding + this.offsetPath,
        y: y - rectHeight / 2 - this.borderYPadding - this.offsetBottom
      }
      bottomLine = `M${horiStart.x} ${horiStart.y}L${horiEnd.x} ${horiEnd.y}`
      bezierLine = bézierCurveGenerator({
        source: horiEnd,
        target: {
          x: d.target.x - this.borderXPadding,
          y: d.target.y - d.target.rectHeight / 2 - this.offsetBottom - this.borderYPadding
        }
      })
    } else if (depth === 1) {
      const end = { x: d.target.x, y: d.target.y }
      const horiStart = {
        x: x + contentWidth + this.borderXPadding,
        y: y - rectHeight / 2 - this.borderYPadding - this.offsetBottom
      }
      const horiEnd = {
        x: x + contentWidth + this.borderXPadding + this.offsetPath,
        y: y - rectHeight / 2 - this.borderYPadding - this.offsetBottom
      }
      bottomLine = `M${horiStart.x} ${horiStart.y}L${horiEnd.x} ${horiEnd.y}`
      bezierLine = bézierCurveGenerator({
        source: horiEnd,
        target: end
      })
      bottomLineLeaf = `M${end.x} ${end.y}L${end.x + d.target.contentWidth + this.borderXPadding} ${end.y}`
    } else {
      const horiStart = { x: x + contentWidth + this.borderXPadding, y }
      const horiEnd = { x: x + contentWidth + this.borderXPadding + this.offsetPath, y }
      const bezierEnd = { x: d.target.x, y: d.target.y }
      bottomLine = `M${horiStart.x} ${horiStart.y}L${horiEnd.x} ${horiEnd.y}`
      bezierLine = bézierCurveGenerator({
        source: horiEnd,
        target: bezierEnd
      })
      bottomLineLeaf = `M${bezierEnd.x} ${bezierEnd.y}L${bezierEnd.x + d.target.contentWidth + this.borderXPadding} ${bezierEnd.y}`
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

      const extraX = node.contentWidth + this.borderXPadding + this.offsetPath - this.btnSize / 2
      const extraY = node.depth > 1
        ? node.contentHeight + this.offsetBottom
        : (node.contentHeight - this.btnSize) / 2

      node.colx = node.tx + extraX
      node.coly = node.ty + extraY
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
      .text(root.data.html)
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
    root.rectX = (-this.borderXPadding)
    root.rectY = (-this.borderYPadding)
    root.rectRX = this.borderRadius
    root.rectRY = this.borderRadius
    root.rectWidth = root.contentWidth + this.borderXPadding * 2
    root.rectHeight = root.contentHeight + this.borderYPadding * 2
    // 2.关于foreignObject
    root.foWidth = root.contentWidth
    root.foHeight = root.contentHeight
    // 3.关于image按钮
    root.imageWidth = this.btnSize
    root.imageHeight = this.btnSize
    // 3.1 折叠按钮位置
    root.collapseX = root.contentWidth + this.borderXPadding + this.offsetPath - this.btnSize / 2
    root.collapseY = root.depth > 1 ? root.contentHeight + this.offsetBottom : (root.contentHeight - this.btnSize) / 2
    // 3.2 添加按钮位置
    root.addX = root.contentWidth + this.borderXPadding - this.btnSize / 2
    root.addY = root.contentHeight - this.btnSize / 2

    if (root.children && root.children.length) {
      for (const child of root.children) {
        this.measureWidthAndHeight(child)
      }
    }
  }
}

const useMap = content => {
  const hierarchyData = d3.hierarchy(content)
  const store = useMapStore()
  const measureSvg = store.selections.measureSvg
  const creator = new TreeDataCreater({ measureSvg })
  const treedData = creator.create(hierarchyData)
  return treedData
}

export default useMap
