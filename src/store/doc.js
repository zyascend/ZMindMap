/* eslint-disable no-param-reassign */
/**
 * 文档相关状态
 */
import { defineStore } from 'pinia'
import { dateFormatter } from '@/hooks/utils'
import { docApi } from '@/hooks/http'

const useDocStore = defineStore({
  id: 'doc',
  state: () => ({
    originAllDocs: undefined,
    allTreeDocs: undefined
  }),
  getters: {
    getAllDocuments: state => id => {
      if (!id) {
        return state.allTreeDocs
      }
      const { folders, documents } = state.originAllDocs
      return [...folders, ...documents].filter(doc => doc.folderId === id)
    },
    getNavigationLists: state => curFolderId => {
      const paths = []
      const folderList = state.originAllDocs.folders
      const curFolder = folderList.find(f => f.id === curFolderId)
      if (curFolder) {
        paths.unshift(curFolder)
        let prevFolderId = curFolder.folderId
        while (prevFolderId !== '0') {
          // eslint-disable-next-line no-loop-func
          const prevFolder = folderList.find(f => f.id === prevFolderId)
          if (!prevFolder) break
          paths.unshift(prevFolder)
          prevFolderId = prevFolder.folderId
        }
      }
      paths.unshift({ name: '我的文件', id: '0' })
      console.log(paths, curFolderId)
      return paths
    }
  },
  actions: {
    setDoc(data) {
      this.originAllDocs = data
      this.allTreeDocs = processTreeData(data)
    },
    async fetchAllDocuments() {
      const data = await docApi.fetchAllDocuments()
      this.setDoc(data)
    },
    async postSetFolder(data) {
      // const { user } = useUserStore()
      // const url = `${API.setFolder}/${user._id}`
      // const res = await handler.asyncHttp(url, { method: 'post', data })
      const res = await docApi.postSetFolder(data)
      this.setDoc(res)
    },
    async postSetDoc(data) {
      // const { user } = useUserStore()
      // const url = `${API.setDoc}/${user._id}`
      // const res = await handler.asyncHttp(url, { method: 'post', data })
      const res = await docApi.postSetDoc(data)
      this.setDoc(res)
    },
    async postRemove(data) {
      // const { user } = useUserStore()
      // const url = `${API.remove}/${user._id}`
      // const res = await handler.asyncHttp(url, { method: 'post', data })
      const res = await docApi.postRemove(data)
      this.setDoc(res)
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'zmindmap_docs',
        storage: localStorage
      }
    ]
  }
})

function processTreeData(data) {
  const docs = [...data.folders, ...data.documents]
  const treeData = docs.filter(item => {
    item.formatedUpdateTime = dateFormatter(item.updateTime)
    item.formatedCreateTime = dateFormatter(item.createTime)
    item.children = docs.filter(e => {
      return item.id === e.folderId
    })
    return item.folderId === '0'
  })
  return treeData
}

export default useDocStore
