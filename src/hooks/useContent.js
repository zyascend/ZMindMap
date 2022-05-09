import { useMapStore } from '@/store/map'
import { xss } from '@/hooks/utils'
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 5)

const store = useMapStore()
export async function addNode (pid, options = { isMap: false, cid: undefined }) {
  const content = store.content
  const node = content[pid]
  if (!node) return
  // 如果当前节点折叠 先打开
  if (node._children.length) {
    ;[node.children, node._children] = [node._children, node.children]
  }
  const id = nanoid()
  const { isMap, cid } = options
  if (!cid) {
    // 添加孩子 => 添加到第一个
    if (isMap) {
      node.children.push(id)
    } else {
      node.children.splice(0, 0, id)
    }
  } else {
    // 添加兄弟 => 添加到当前位置的下一个
    const index = node.children.indexOf(options.cid)
    node.children.splice(index + 1, 0, id)
  }
  const child = {
    html: id,
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

export async function deleteNode (id, list = undefined) {
  // 更新其父节点的信息
  const content = store.content
  console.log(content[id], id)
  const p = content[content[id].parent]
  // 没有父节点 => 是根节点 => 根节点不能被删除
  if (!p) return
  p.children = p.children.filter(v => v !== id)
  // 删除此节点和其所有后代
  const queue = [id]
  while (queue.length) {
    const front = queue.shift()
    queue.push(...content[front].children)
    delete content[front]
  }
  await store.setContent(content)
  // list==undefined => 是在map中删除 不需要定位焦点
  if (!list) return
  // 返回上一个ID
  let prevId
  // 删除的是第一个节点 焦点将给到第二个节点
  if (list[0].id === id) {
    prevId = list[1].id
  } else {
    for (const index in list) {
      if (list[index].id === id) {
        prevId = list[index - 1].id
        break
      }
    }
  }
  return prevId
}
export async function collapse (id) {
  const content = store.content
  const node = content[id]
  ;[node.children, node._children] = [node._children, node.children]
  await store.setContent(content)
}

export function moveToLastFocus (id) {
  // 把光标移到文字最后面
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
  // ! 由于debounce 此事件可能发生在deleteNode之后 此id节点可能被删除 需要判空
  if (!content[id]) return
  content[id].html = xss(html)
  await store.setContent(content)
}
