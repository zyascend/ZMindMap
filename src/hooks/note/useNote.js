/* eslint-disable no-param-reassign */
import { watchEffect, ref } from 'vue'
import useMapStore from '@/store/map'

export default function useNoteList() {
  const store = useMapStore()
  const rootNode = ref(null)
  const childNodes = ref([])
  watchEffect(() => {
    if (!store.treeContent) return
    // 监听treeContent的变化 改变大纲编辑页需要展示的数据
    // TODO 【可优化】：需要每次更新都重新全量地获取先序序列么？
    const preOrder = cyclePreOrder(store.treeContent)
    // eslint-disable-next-line prefer-destructuring
    rootNode.value = preOrder[0]
    childNodes.value = preOrder.slice(1)
  })
  return [rootNode, childNodes]
}

/**
 * 获取多叉树的先序序列 = 大纲编辑页的展示顺序
 * @param {*} root
 * @returns
 */
function cyclePreOrder(root) {
  const stack = []
  const res = []
  root.level = 0
  stack.push(root)
  while (stack.length) {
    const cur = stack.pop()
    res.push(cur)
    const len = cur?.children?.length
    if (len) {
      cur.children.forEach((v, i) => {
        // ! 倒序入栈才能顺序出栈
        const child = cur.children[len - 1 - i]
        child.level = cur.level + 1
        stack.push(child)
      })
    }
  }
  return res
}
