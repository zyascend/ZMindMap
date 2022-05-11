/**
 * 导图和大纲笔记页面相关状态
 */
import { defineStore } from 'pinia'
import API from '@/hooks/api'
import { deepClone, ErrorTip } from '@/hooks/utils'
import { useUserStore } from './user'
import * as handler from './handler'
import { select } from 'd3-selection'

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
      noteList: undefined,
      treedData: undefined,

      // 设置Edit页面的数据的加载状态
      isSaving: false
    }
  },
  getters: {
    getRootNode: state => {
      return state.noteList ? state.noteList[0] : undefined
    },
    getChildNode: state => {
      return state.noteList ? state.noteList.splice(1) : undefined
    }
  },
  actions: {
    setRefs (refs) {
      this.refs = refs
      for (const key in refs) {
        this.selections[key] = select(refs[key])
      }
    },
    transform (content, id = 'map-root', level = 0, list = []) {
      if (typeof id === 'object') {
        id = id.id
      }
      const d = content[id]
      d.level = level
      list.push(d)
      if (d.children.length) {
        const newChildren = []
        for (const c of d.children) {
          newChildren.push(this.transform(content, c, level + 1, list)[0])
        }
        d.children = newChildren
      } else if (d._children.length) {
        const newChildren = []
        for (const c of d._children) {
          newChildren.push(this.transform(content, c, level + 1))
        }
        d._children = newChildren
      }
      return [d, list]
    },
    async setContent (content) {
      if (this.isSaving) {
        ErrorTip('操作过于频繁！')
        return
      }
      this.isSaving = true
      this.content = content
      // ! 必须使用deepClone 否则会改变this.content
      ;[this.treedData, this.noteList] = this.transform(deepClone(content))
      // ! 等待远程更新完成之后再更新焦点？
      await this.remoteUpdateMap(content)
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
      ;[this.treedData, this.noteList] = this.transform(deepClone(this.content))
    },
    async remoteUpdateMap (content) {
      const user = useUserStore().user
      const url = `${API.setDocContent}/${user._id}`
      const data = {
        ...this.mapData,
        definition: JSON.stringify(content)
      }
      const res = await handler.asyncHttp(url, { method: 'post', data })
      this.isSaving = false
      this.setData(res)
    }
  },
  persist: {
    enabled: false
  }
})
