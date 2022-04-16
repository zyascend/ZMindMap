/**
 * ? 抽取对导图原始数据的公共逻辑方便Note组件和Map组件的调用
 * ? 包括：折叠/删除/Tab/文字更改/...
 * TODO 切换遍历算法为栈式遍历
 */
import { useMapStore } from '@/store/map'
let newId = ''
// const lastNode = ''
const store = useMapStore()

export const flatter = data => {
  const flatedList = []
  const iter = list => {
    if (!list || !list.length) return
    for (const v of list) {
      flatedList.push(v)
      iter(v.children)
    }
  }
  iter(data)
  return flatedList
}

export const updateTab = _node => {
  const iter = node => {
    const { id, level } = node
    // 当前子节点没折叠
    if (node.children && node.children.length) {
      for (const i in node.children) {
        node.children[i].id = `${id}-${i}`
        node.children[i].pId = id
        node.children[i].level = level + 1
        iter(node.children[i])
      }
    } else if (node._children && node._children.length) {
      // 当前子节点折叠了
      for (const i in node._children) {
        node._children[i].id = `${id}-${i}`
        node._children[i].pId = id
        node._children[i].level = level + 1
        iter(node._children[i])
      }
    }
  }
  iter(_node)
  return _node
}

export const moveToLastFocus = id => {
  const $el = document.getElementById(id)
  const range = document.createRange()
  range.selectNodeContents($el)
  range.collapse(false)
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

// 处理折叠
const collapse = (list, _id) => {
  if (!list || !list.length) return
  for (const v of list) {
    if (v.id === _id) {
      if (v.collapsed) v.collapsed = false
      else {
        v.collapsed = true
      }
      [v.children, v._children] = [v._children, v.children]
    }
    collapse(v.children, _id)
  }
}
export const toggleCollapse = async (_id, originData) => {
  collapse(originData, _id)
  await store.setContent({ noteList: originData })
  return originData
}

// 添加子节点
const addBrother = (node, list) => {
  if (!list || !list.length) return
  for (const i in list) {
    if (list[i].id === node.id) {
      newId = `${node.pId}-${list.length + 1}`
      // ! 大坑：【for in】得到的数组下标是字符串形式的 typeof i == string
      list.splice(Number(i) + 1, 0, {
        name: '',
        collapsed: false,
        level: node.level,
        id: newId,
        pId: node.pId,
        _children: [],
        children: []
      })
      break
    } else {
      addBrother(node, list[i].children)
    }
  }
}
const addChild = (node, list) => {
  if (!list || !list.length) return
  for (const n of list) {
    if (n.id === node.id) {
      newId = `${n.id}-${n.children.length + 1}`
      n.children.splice(0, 0, {
        name: '',
        collapsed: false,
        level: node.level + 1,
        id: newId,
        pId: n.id,
        _children: [],
        children: []
      })
      break
    } else {
      addChild(node, n.children)
    }
  }
}
export const addNewNode = async (node, originData) => {
  if (node.children.length) {
    console.log('add child', originData)
    // 代表该节点现在有子节点且处于展开状态
    addChild(node, originData)
    console.log('add child', originData)
  } else {
    // 代表该节点没有子节点或者处于折叠状态
    addBrother(node, originData)
  }
  console.log(newId)
  await store.setContent({ noteList: originData })
  return newId
}

const findAndDelete = (list, node) => {
  if (!list || !list.length) return
  for (const i in list) {
    if (list[i].id === node.id) {
      list.splice(i, 1)
      break
    } else {
      findAndDelete(list[i].children, node)
    }
  }
}
// 删除节点
export const deleteNode = async (node, originData, noteList) => {
  let lastNode = null
  // 找到上一个节点 方便聚焦
  for (const i in noteList) {
    if (noteList[i].id === node.id) {
      // ! 有问题 => noteList.value[1]
      lastNode = i === '0' ? noteList[1] : noteList[i - 1]
    }
  }
  findAndDelete(originData, node)
  // ! 假如删光了 需要重新放置一个初始节点
  if (!originData.length) {
    originData.push({
      name: '',
      collapsed: false,
      level: 0,
      id: 'node-0',
      pId: 'node-root',
      _children: [],
      children: []
    })
  }
  await store.setContent({ noteList: originData })
  return lastNode
}

const findAndTab = (list, node) => {
  if (!list || !list.length) return
  for (const i in list) {
    if (list[i].id === node.id) {
      const index = Number(i)
      if (index !== 0) {
        // 不是第一个子节点 可以tab成它的兄弟的子节点
        // 首先如果兄弟节点折叠了 那么打开
        if (list[index - 1]._children.length) {
          [list[index - 1]._children, list[index - 1].children] = [list[index - 1].children, list[index - 1]._children]
        }
        // 兄弟节点没折叠或者没子节点
        // ! 首先要更新当前节点的数据：[pId, id, level, children的[pId, id, level]]
        const _node = list[index]
        _node.pId = list[index - 1].id
        newId = `${list[index - 1].id}-${list[index - 1].children.length + 1}`
        _node.id = newId
        _node.level = _node.level + 1
        // 更新所有子节点的数据
        const updatedNode = updateTab(_node)
        // 原层级要删除当前节点
        list.splice(index, 1)
        // 添加
        list[index - 1].children.push(updatedNode)
      }
      break
    } else {
      findAndTab(list[i].children, node)
    }
  }
}
// tab节点(切换层级)
export const tabNode = async (node, originData) => {
  // 首先要找到此节点
  findAndTab(originData, node)
  await store.setContent({ noteList: originData })
  return newId
}
