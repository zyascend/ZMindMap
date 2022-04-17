import { useMapStore } from '@/store/map'
// let newId = ''
// const lastNode = ''
const store = useMapStore()
export function addNode (pid) {
  const content = store.content
  const node = content[pid]
  const id = `${pid}-${node.children.length}`
  node.children.push(id)
  const child = {
    content: '',
    id,
    children: [],
    _children: [],
    parent: pid
  }
  content[id] = child
  store.setContent(content)
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
export function deleteNode (id) {
  const content = store.content
  const p = content[content[id].parent]
  p.children = p.children.filter(v => v !== id)
  deleteDic(id, content)
  store.setContent(content)
  // TODO 返回上一个ID
  return id
}
export function collapse (id) {
  const content = store.content
  const node = content[id]
  ;[node.children, node._children] = [node._children, node.children]
  store.setContent(content)
}
