import axios from '@/hooks/useHttp'
/**
 * 侧边树形列表的预处理
 * @param {*}
 * @returns tree data for Eltree
 */
import { dateFormatter } from '@/hooks/utils'

export const handleSiderData = data => {
  const folderMap = new Map()
  const res = []
  for (const doc of [...data.folders, ...data.documents]) {
    const { folderId, updateTime, createTime } = doc
    doc.formatedUpdateTime = dateFormatter(updateTime)
    doc.formatedCreateTime = dateFormatter(createTime)
    if (folderId === '0') {
      res.push(doc)
    }
    if (folderMap.has(folderId)) {
      folderMap.set(folderId, [...folderMap.get(folderId), doc])
    } else {
      folderMap.set(folderId, [doc])
    }
  }
  const appendChildren = (parent) => {
    if (!parent) return
    const children = folderMap.get(parent.id)
    if (!children) return
    for (const child of children) {
      if (folderMap.has(child.id)) {
        appendChildren(child)
      }
    }
    parent.children = children
  }
  for (const root of res) {
    appendChildren(root)
  }
  return res
}

export const findChildren = (id, data) => {
  if (!id || !('folders' in data)) return []
  const all = [...data.folders, ...data.documents]
  return all.filter(doc => doc.folderId === id)
}

export const findNavigationPaths = (id, data) => {
  const defaultPath = { name: '我的文件', id: '' }
  if (!id || !('folders' in data)) return [defaultPath]
  let currentFolder = null
  for (const folder of data.folders) {
    if (id === folder.id) {
      currentFolder = folder
      break
    }
  }
  if (!currentFolder) return [defaultPath]
  let parent = currentFolder.folderId
  const paths = [currentFolder]
  // TODO 【危险：假如返回的不是'0', 则进入死循环】待改进
  while (parent !== '0') {
    for (const f of data.folders) {
      if (parent === f.id) {
        parent = f.folderId
        console.log(parent)
        paths.push(f)
        break
      }
    }
  }
  paths.push(defaultPath)
  return paths.reverse()
}

export const asyncHttp = async (url, config = { method: 'get' }, extraData = undefined) => {
  const [err, res] = await axios(url, config).then(res => [null, res]).catch(err => [err, null])
  if (err || !res) {
    return null
  }
  return res.data
}
