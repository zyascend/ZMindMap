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
  console.log('HOOKS-updateTab ', _node)
  return _node
}

export function moveToLastFocus (id) {
  const $el = document.getElementById(id)
  const range = document.createRange()
  range.selectNodeContents($el)
  range.collapse(false)
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}
