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
    transform (id = '0', level = 0, list = []) {
      const d = this.content[id]
      d.level = level
      list.push(d)
      if (d.children.length) {
        const newChildren = []
        for (const c of d.children) {
          newChildren.push(this.transform(c, level + 1, list)[0])
        }
        d.children = newChildren
      } else if (d._children.length) {
        const newChildren = []
        for (const c of d._children) {
          newChildren.push(this.transform(c, level + 1))
        }
        d._children = newChildren
      }
      return [d, list]
    },
    async setContent1 (content) {
      this.content = content
      ;[this.noteList, this.treedData] = this.transform()
      // ! 等待远程更新完成之后再更新焦点？
      // TODO 网速慢会发生什么
      // TODO 更新失败怎么处理
      await this.remoteUpdateMap(content)
    },
    async setContent (content) {
      let name = this.content.name
      let noteList = this.content.noteList
      if (content?.name) {
        name = content.name
      }
      if (content?.noteList) {
        noteList = content.noteList
      }
      // ! 等待远程更新完成之后再更新焦点？
      // TODO 网速慢会发生什么
      // TODO 更新失败怎么处理
      await this.remoteUpdateMap({ name, noteList })
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
