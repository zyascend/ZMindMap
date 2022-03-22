import * as d3 from './d3'
import store from '../store'
import useDrawMap from './useDrawMap'

export class TreeDataCreater {
  constructor ({ measureSvg, treeStyle, gapY = 14, gapX = 60, maxNodeWidth = 250 } = {}) {
    this.measureSvg = measureSvg
    this.treeStyle = treeStyle
    this.gapY = gapY
    this.gapX = gapX
    this.maxNodeWidth = maxNodeWidth
  }

  create (root, isUpdate = false) {
    !isUpdate && this.measureWidthAndHeight(root)
    this.calculateXY(root)
    return root
  }

  meanY (children) {
    return children.reduce((y, c) => y + c.y, 0) / children.length
  }

  calculateXY (root) {
    let preNode
    root.eachAfter(node => {
      node._id = node.data.id
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
    root.width = clientWidth
    root.height = clientHeight
    if (!isUpdate && root.children && root.children.length) {
      for (const child of root.children) {
        this.measureWidthAndHeight(child)
      }
    }
  }
}

const init = content => {
  const { name, noteList } = content
  const data = {
    name,
    id: '-1',
    children: noteList,
    _children: [],
    collapsed: false
  }
  store.dispatch('setTreeData', data)
}

const findNode = (root, id) => {
  if (!root) return null
  if (root.id === id) return root
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

export const afterEdit = () => {
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
    id: `${theNode.id}-${theNode.children.length}`,
    children: []
  })
  init(root)
  useDrawMap()
  console.log('appendNewChild => res: ', root)
}

export const toggleExpandOrCollapse = parentId => {
  const root = store.getters.getOriginData
  // 找到待更新的节点
  const theNode = findNode(root, parentId)
  theNode.collapsed = !theNode.collapsed
  ;[theNode._children, theNode.children] = [theNode.children, theNode._children]
  init(root)
  useDrawMap()
  console.log('collapseChildren => res: ', root)
}

export const deleteNode = (parentId, childId) => {
  if (!parentId || !childId) {
    return
  }
  const root = store.getters.getOriginData
  const parentNode = findNode(root, parentId)
  for (let i = 0; i < parentNode.children.length; i++) {
    if (parentNode.children[i].id === childId) {
      parentNode.children.splice(i, 1)
      break
    }
  }
  init(root)
  useDrawMap()
}

export default { init }
