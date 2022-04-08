/**
 * 导图和大纲笔记页面相关状态
 */
import { defineStore } from 'pinia'
import API from '@/hooks/api'
import { ErrorTip } from '@/hooks/utils'
import { useUserStore } from './user'
import * as handler from './handler'
import * as d3 from 'd3-selection'
export const useMapStore = defineStore('map', {
  state: () => {
    return {
      refs: {
        mainSvg: undefined,
        mainG: undefined,
        measureSvg: undefined
      },
      selections: {
        mainSvg: undefined,
        mainG: undefined,
        measureSvg: undefined
      },
      mapData: undefined,
      content: undefined,

      // 设置Edit页面的数据的加载状态
      isSaving: false
    }
  },
  getters: {
    getMap: state => {
      return state.mapData
    },
    getContent: state => {
      return state.content
    }
  },
  actions: {
    setRefs (refs) {
      this.refs = refs
      for (const key in refs) {
        this.selections[key] = d3.select(refs[key])
      }
    },
    setData (data) {
      if (data && data.definition) {
        this.mapData = data
        this.content = JSON.parse(data.definition)
      } else {
        ErrorTip('保存失败')
      }
    },
    async fetchMap (docId) {
      const user = useUserStore().user
      const url = `${API.getDocContent}/${user._id}/${docId}`
      const res = await handler.asyncHttp(url)
      this.setData(res)
    },
    async remoteUpdateMap (content) {
      const user = useUserStore().user
      const url = `${API.setDocContent}/${user._id}`
      const data = {
        ...this.mapData,
        definition: JSON.stringify(content)
      }
      this.isSaving = true
      const res = await handler.asyncHttp(url, { method: 'post', data })
      this.isSaving = false
      this.setData(res)
    }
  },
  persist: {
    enabled: false
  }
})
