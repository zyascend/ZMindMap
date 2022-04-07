/**
 * 文档相关状态
 */
import { defineStore } from 'pinia'
import * as handler from './handler'
import API from '@/hooks/api'
import { useUserStore } from './user'
export const useDocStore = defineStore({
  id: 'doc',
  state: () => {
    return {
      originAllDocs: undefined,
      allTreeDocs: undefined
    }
  },
  getters: {
    getAllDocuments: state => id => {
      if (!id) {
        return state.allTreeDocs
      } else {
        return handler.findChildren(id, state.originAllDocs)
      }
    },
    getNavigationLists: state => id => {
      return handler.findNavigationPaths(id, state.originAllDocs)
    }
  },
  actions: {
    setDoc (data) {
      console.log('PINIA > doc > setDoc > ', data)
      this.originAllDocs = data
      this.allTreeDocs = handler.handleSiderData(data)
    },
    // TODO 相同逻辑封装？
    async fetchAllDocuments () {
      const user = useUserStore().user
      const url = `${API.getAllDocs}/${user?._id || 'null'}`
      const data = await handler.asyncHttp(url)
      this.setDoc(data)
    },
    async postSetFolder (data) {
      const user = useUserStore().user
      const url = `${API.setFolder}/${user._id}`
      const res = await handler.asyncHttp(url, { method: 'post', data })
      this.setDoc(res)
    },
    async postSetDoc (data) {
      const user = useUserStore().user
      const url = `${API.setDoc}/${user._id}`
      const res = await handler.asyncHttp(url, { method: 'post', data })
      this.setDoc(res)
    },
    async postRemove (data) {
      const user = useUserStore().user
      const url = `${API.remove}/${user._id}`
      const res = await handler.asyncHttp(url, { method: 'post', data })
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
