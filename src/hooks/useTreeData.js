import * as d3 from './d3'
import store from '../store'
import useDrawMap from './useDrawMap'

let creator = null
class TreeDataCreater {
  constructor ({ measureSvg, treeStyle, gapY = 14, gapX = 70 } = {}) {
    this.measureSvg = measureSvg
    this.treeStyle = treeStyle
    this.gapY = gapY
    this.gapX = gapX
  }

  create (root, isUpdate = false) {
    !isUpdate && this.measureWidthAndHeight(root)
    this.caculateXY(root)
    return root
  }

  meanY (children) {
    return children.reduce((y, c) => y + c.y, 0) / children.length
  }

  caculateXY (root) {
    let preNode
    root.eachAfter(node => {
      node._id = node.data.nid
      const { children } = node
      if (children) {
        node.y = this.meanY(children)
      } else {
        node.y = preNode ? preNode.y + node.height + this.gapY : (node.y ? node.y : 30 + node.height)
        preNode = node
      }
    })
    root.eachBefore(node => {
      const { depth, children, width } = node
      if (depth === 0) {
        node.x = node.x ? node.x : 10
      }
      if (children) {
        children.forEach(c => {
          c.x = node.x + width + this.gapX
        })
      }
    })
  }

  measureWidthAndHeight (root, isUpdate = false) {
    const multiline = TreeDataCreater.getMultiline(root.data.name)
    const t = this.measureSvg.append('text')
    t.selectAll('tspan').data(multiline).enter().append('tspan').text((d) => d).attr('x', 0)
    const tBox = t.node().getBBox()
    t.remove()
    root.width = Math.max(tBox.width, 22)
    root.height = Math.max(tBox.height, 22) * multiline.length
    if (!isUpdate && root.children && root.children.length) {
      for (const child of root.children) {
        this.measureWidthAndHeight(child)
      }
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

const init = data => {
  const hierarchyData = d3.hierarchy(data)
  const measureSvg = store.getters.getSelections.measureSvg
  creator = new TreeDataCreater({ measureSvg })
  store.dispatch('setData', { treedData: creator.create(hierarchyData), originData: data })
}

const findNode = (root, id) => {
  if (!root) return null
  if (root.nid === id) return root
  if (root.children && root.children.length) {
    for (const child of root.children) {
      const res = findNode(child, id)
      if (res) return res
    }
  }
  return null
}

const updateEdit = (newName, id) => {
  // const root = store.getters.getTreedData
  // // 找到待更新的节点
  // const theNode = findNode(root, parseInt(id))
  // theNode.data.name = newName
  // // 重新计算宽高
  // creator.measureWidthAndHeight(theNode, true)
  // // 重新计算xy值
  // creator.create(root)
  // // 更新节点
  // console.log('更新节点')
  const root = store.getters.getOriginData
  // 找到待更新的节点
  const theNode = findNode(root, id)
  theNode.name = newName
  init(root)
  useDrawMap()
}

const afterEdit = () => {
  const { foreignObject, foreignDiv } = store.getters.getRefs
  foreignObject.style.display = 'none'
  const id = foreignObject.getAttribute('data-id')

  const gs = d3.select(`#g-id-${id}`)
  gs.attr('class', '')
  const newName = foreignDiv.textContent
  updateEdit(newName, id)
}

export const appendNewChild = parentId => {
  const root = store.getters.getOriginData
  // 找到待更新的节点
  const theNode = findNode(root, parentId)
  theNode.children.push({
    name: '输入文字',
    nid: `${theNode.nid}-${theNode.children.length}`,
    children: []
  })
  init(root)
  useDrawMap()
  console.log('appendNewChild => res: ', root)
}

export const getMultiline = TreeDataCreater.getMultiline

export default { init, afterEdit }
