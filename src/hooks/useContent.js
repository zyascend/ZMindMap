import { useMapStore } from '@/store/map'
// let newId = ''
// const lastNode = ''
const store = useMapStore()
export async function addNode (pid) {
  const content = store.content
  const node = content[pid]
  const id = `${pid}-${node.children.length}`
  node.children.push(id)
  const child = {
    html: '新节点',
    id,
    children: [],
    _children: [],
    parent: pid,
    collapsed: false
  }
  content[id] = child
  await store.setContent(content)
  return id
}

function deleteDic (id, content) {
  const children = content[id].children
  if (children.length) {
    for (const c of children) {
      deleteDic(c)
    }
  }
  delete content[id]
}
export async function deleteNode (id, list) {
  let prevNode
  // 删除的是第一个节点 焦点将给到第二个节点
  if (list[0].id === id) {
    prevNode = list[1]
  } else {
    for (const index in list) {
      if (list[index].id === id) {
        prevNode = list[index - 1]
        break
      }
    }
  }
  const content = store.content
  const p = content[content[id].parent]
  p.children = p.children.filter(v => v !== id)
  deleteDic(id, content)
  await store.setContent(content)
  // TODO 返回上一个ID
  return prevNode
}
export async function collapse (id) {
  const content = store.content
  const node = content[id]
  console.log(node)
  ;[node.children, node._children] = [node._children, node.children]
  console.log(node)
  await store.setContent(content)
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

export async function tabNode (id, noteList) {
  // TODO
  return id
}

export async function changeNodeHtml (id, html) {
  const content = store.content
  content[id].html = html
  await store.setContent(content)
}
