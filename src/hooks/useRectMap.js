import { hierarchy } from 'd3-hierarchy'
import { useMapStore } from '@/store/map'

export class TreeDataCreater {
  constructor ({ measureSvg, treeStyle } = {}) {
    this.measureSvg = measureSvg
    this.treeStyle = treeStyle
    this.dw = 250
    this.dh = 60
    this.drh = 60
  }

  create (root) {
    this.measureWidthAndHeight(root)
    this.calculateXY(root)
    return {
      node: root.descendants()
    }
  }

  measureWidthAndHeight (root) {
    root.eachAfter(node => {
      const { children } = node
      if (!children) {
        this.measureSelf(node)
      } else {
        this.measureWithChildren(node)
      }
    })
    root.eachBefore(node => {
      const { children } = node
      if (!children) return
      const maxW = Math.max(...children.map(c => c.w))
      for (const child of children) {
        if (child.w < maxW) {
          child.w = maxW
          if (!child.children) {
            child.cw = child.w
          }
        }
        if (node.cw + child.w < node.w) {
          child.cw = child.w = node.w - node.cw
        }
      }
    })
  }

  measureSelf (node) {
    node.cw = this.dw
    node.ch = this.dh
    node.w = node.cw
    node.h = node.ch
  }

  measureWithChildren (node) {
    const { children, depth } = node
    const maxW = Math.max(...children.map(c => c.w))
    if (!depth) {
      node.cw = maxW
      node.ch = this.dh
      node.w = node.cw
      node.h = node.ch + this.sumH(children)
    } else {
      node.cw = this.dw
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

  calculateXY (root) {
    // 算X值-前序遍历
    let lastNode
    root.eachBefore(node => {
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

const useMap = content => {
  const hierarchyData = hierarchy(content)
  const store = useMapStore()
  const measureSvg = store.selections.measureSvg
  const creator = new TreeDataCreater({ measureSvg })
  const treedData = creator.create(hierarchyData)
  return treedData
}

export default useMap
