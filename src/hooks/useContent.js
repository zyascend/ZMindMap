import useMapStore from '@/store/map'
import { xss, getImageWH } from '@/hooks/utils'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdef', 5)
const store = useMapStore()

export async function addNode(pid, options = { isMap: false, cid: undefined }) {
  const { content } = store
  const node = content[pid]
  if (!node) return null
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
    html: '请输入内容',
    id,
    children: [],
    _children: [],
    parent: pid,
    markerList: [],
    collapsed: false
  }
  content[id] = child
  await store.setContent(content)
  return id
}

export async function deleteNode(id, list = undefined) {
  // 更新其父节点的信息
  const { content } = store
  console.log(content[id], id)
  const p = content[content[id].parent]
  // 没有父节点 => 是根节点 => 根节点不能被删除
  if (!p) return null
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
  if (!list) return null
  // 返回上一个ID
  let prevId
  // 删除的是第一个节点 焦点将给到第二个节点
  if (list[0].id === id) {
    prevId = list[1].id
  } else {
    // eslint-disable-next-line no-restricted-syntax
    for (const index in list) {
      if (list[index].id === id) {
        prevId = list[index - 1].id
        break
      }
    }
  }
  return prevId
}
export async function collapse(id) {
  const { content } = store
  const node = content[id]
  ;[node.children, node._children] = [node._children, node.children]
  await store.setContent(content)
}

export function moveToLastFocus(id) {
  // 把光标移到文字最后面
  const $el = document.getElementById(id)
  const range = document.createRange()
  range.selectNodeContents($el)
  range.collapse(false)
  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

export async function tabNode(id, noteList) {
  // 1. 首先判断能不能tab
  // 该节点作为第一个孩子节点时 不能tab
  const { content } = store
  const node = content[id]
  const pNode = content[node.parent]
  const index = pNode.children.indexOf(id)
  const canTab = index !== 0
  if (!canTab) return null
  // 2. 找到要tab到哪个节点下
  let newPid
  // eslint-disable-next-line no-restricted-syntax
  for (const i in noteList) {
    if (id === noteList[i].id) {
      newPid = noteList[i - 1].id
      break
    }
  }
  // 3. 旧的父node删除该节点
  pNode.children.splice(index, 1)
  // 4. 该节点重新赋值新的父node id
  node.parent = newPid
  // 5. 如果newPid折叠了，打开
  const newPNode = content[newPid]
  if (newPNode._children.length) {
    ;[newPNode.children, newPNode._children] = [
      newPNode._children,
      newPNode.children
    ]
  }
  // 6. 该节点作为newPid的最后一个孩子
  newPNode.children.push(id)
  await store.setContent(content)
  return id
}

// 获取当前光标位置
export function getCursortPosition(element) {
  var caretOffset = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  // 谷歌、火狐
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    // 选中的区域
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      // 克隆一个选中区域
      var preCaretRange = range.cloneRange();
      // 设置选中区域的节点内容为当前节点
      preCaretRange.selectNodeContents(element);
      // 重置选中区域的结束位置
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
    // IE浏览器
  } else if ((sel = doc.selection) && sel.type != "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}

// 设置光标位置
export function setCaretPosition(element, pos) {
  var range, selection;
  // Firefox, Chrome, Opera, Safari, IE 9+
  if (document.createRange) {
    // 创建一个选中区域
    range = document.createRange();
    // 选中节点的内容
    range.selectNodeContents(element);
    if (element.innerHTML.length > 0) {
      // 设置光标起始为指定位置
      range.setStart(element.childNodes[0], pos);
    }
    // 设置选中区域为一个点
    range.collapse(true);
    // 获取当前选中区域
    selection = window.getSelection();
    // 移除所有的选中范围
    selection.removeAllRanges();
    // 添加新建的范围
    selection.addRange(range);
    //IE 8 and lower
  }else if (document.selection){
    // 创建一个范围（范围与所选内容类似但不可见）
    range = document.body.createTextRange();
    // 选择范围的元素的全部内容
    range.moveToElementText(element);
    // 将范围折叠到终点
    range.collapse(false);
    // 选择范围
    range.select();
  }
}

export async function changeNodeHtml(id, html) {
  const { content } = store
  // ! 由于debounce 此事件可能发生在deleteNode之后 此id节点可能被删除 需要判空
  if (!content[id]) return
  content[id].html = xss(html)
  await store.setContent(content, true)
}

export async function changeColorHtml(id, color) {
  const { content } = store
  if (!content[id]) return
  content[id].color = color
  await store.setContent(content, true)
}

export async function changeNodeMarkers(id, markerList) {
  const { content } = store
  // ! 由于debounce 此事件可能发生在deleteNode之后 此id节点可能被删除 需要判空
  if (!content[id]) return
  content[id].markerList = markerList
  await store.setContent(content)
}

export async function pasteImg(file, nodeId) {
  const { width, height } = await getImageWH(file)
  const { content } = store
  // TODO 把这些默认值写在一个统一的配置文件里
  // 在上传过程种设置一个loading占位
  content[nodeId].imgInfo = {
    url: 'https://cdn.kimjisoo.cn/pic%2Floading.svg',
    width: 250,
    height: (250 * height) / width
  }
  store.setContent(content, true)
  await store.pasteImg({ file, nodeId, width, height })
}

export async function deleteImg(nodeId) {
  const { content } = store
  content[nodeId].imgInfo = undefined
  await store.setContent(content)
}
