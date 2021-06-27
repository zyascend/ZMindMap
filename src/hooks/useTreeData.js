import * as d3 from './d3'
import { useStore } from 'vuex'

class TreeDataCreater {
  constructor ({ measureSvg, treeStyle, gapY = 14, gapX = 70 } = {}) {
    this.measureSvg = measureSvg
    this.treeStyle = treeStyle
    this.gapY = gapY
    this.gapX = gapX
  }

  create (root) {
    this.measureWidthAndHeight(root)
    this.caculateXY(root)
    return root
  }

  meanY (children) {
    return children.reduce((y, c) => y + c.y, 0) / children.length
  }

  caculateXY (root) {
    let preNode
    root.eachAfter(node => {
      const { children } = node
      if (children) {
        node.y = this.meanY(children)
      } else {
        node.y = preNode ? preNode.y + node.height + this.gapY : 30 + node.height
        preNode = node
      }
    })
    root.eachBefore(node => {
      const { depth, children, width } = node
      if (depth === 0) {
        node.x = 10
      }
      if (children) {
        children.forEach(c => {
          c.x = node.x + width + this.gapX
        })
      }
    })
  }

  measureWidthAndHeight (root) {
    const multiline = getMultiline(root.data.name)
    const t = this.measureSvg.append('text')
    t.selectAll('tspan').data(multiline).enter().append('tspan').text((d) => d).attr('x', 0)
    const tBox = t.node().getBBox()
    t.remove()
    root.width = Math.max(tBox.width, 22)
    root.height = Math.max(tBox.height, 22) * multiline.length
    let childHeight = 0
    if (root.children && root.children.length) {
      for (const child of root.children) {
        this.measureWidthAndHeight(child)
        childHeight += child.childHeight
      }
      childHeight += this.gapY * (root.children.length - 1)
      root.childHeight = Math.max(childHeight, root.height)
    } else {
      root.childHeight = root.height
    }
  }

  static getMultiline (str) {
    const multiline = str.split('\n')
    if (multiline.length > 1 && multiline[multiline.length - 1] === '') {
      multiline.pop()
    }
    return multiline
  }
}

const useTreeData = (data) => {
  const hierarchyData = d3.hierarchy(data).sum(d => d.value)
  const store = useStore()
  const measureSvg = store.getters.getSelections.measureSvg
  const creator = new TreeDataCreater({ measureSvg })
  return creator.create(hierarchyData)
}

export const getMultiline = TreeDataCreater.getMultiline

export default useTreeData
