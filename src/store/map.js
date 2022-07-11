/* eslint-disable no-restricted-syntax */
/**
 * 导图和大纲笔记页面相关状态
 */
import { defineStore } from 'pinia'
import { deepClone, ErrorTip } from '@/hooks/utils'
import { mapApi } from '@/hooks/http'

const useMapStore = defineStore('map', {
  state: () => ({
    mapData: undefined,
    content: undefined,
    noteList: undefined,
    treedData: undefined,

    // 设置Edit页面的数据的加载状态
    isSaving: false,
    idFocused: undefined
  }),
  getters: {
    getRootNode: state => (state.noteList ? state.noteList[0] : null),
    getChildNode: state =>
      state.noteList ? state.noteList.splice(1) : undefined
  },
  actions: {
    setIdFocused(id) {
      this.idFocused = id
    },
    // ! 是否该把此逻辑抽取到hooks/useContent中 store逻辑应该单一化
    transform(content, id = 'map-root', level = 0, list = []) {
      if (typeof id === 'object') {
        // eslint-disable-next-line no-param-reassign
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
    // eslint-disable-next-line space-before-function-paren
    async setContent(content, isLocal = false) {
      if (this.isSaving) {
        ErrorTip('操作过于频繁！')
        return
      }
      this.isSaving = true
      this.content = content
      // ! 必须使用deepClone 否则会改变this.content
      ;[this.treedData, this.noteList] = this.transform(deepClone(content))
      // 只在本地更新
      if (isLocal) {
        this.isSaving = false
        return
      }
      // ! 等待远程更新完成之后再更新焦点？
      const data = {
        ...this.mapData,
        definition: JSON.stringify(content)
      }
      await this.remoteUpdateMap(data)
    },
    async setStyle(newStyle) {
      if (this.isSaving) {
        ErrorTip('操作过于频繁！')
        return
      }
      this.isSaving = true
      const data = {
        ...this.mapData,
        styles: newStyle
      }
      await this.remoteUpdateMap(data)
    },
    async setMarkers(markerList) {
      if (this.isSaving) {
        ErrorTip('操作过于频繁！')
        return
      }
      if (!this.idFocused) return
      this.isSaving = true
      this.content[this.idFocused].markerList = markerList
      ;[this.treedData, this.noteList] = this.transform(deepClone(this.content))
      const data = {
        ...this.mapData,
        definition: JSON.stringify(this.content)
      }
      await this.remoteUpdateMap(data)
    },
    setData(data) {
      if (data && data.definition) {
        this.mapData = data
        this.content = JSON.parse(data.definition)
      } else {
        ErrorTip('保存失败')
      }
    },
    async fetchMap(docId) {
      const res = await mapApi.fetchMap(docId)
      this.setData(res)
      // eslint-disable-next-line semi-style
      ;[this.treedData, this.noteList] = this.transform(deepClone(this.content))
    },
    async remoteUpdateMap(data) {
      const res = await mapApi.remoteUpdateMap(data)
      this.isSaving = false
      this.setData(res)
    },
    async pasteImg({ file, nodeId, width, height }) {
      const formData = new FormData()
      if (file) {
        formData.append('file', file)
      }
      // 首先上传图片，获得图片的url
      const imgUrl = await mapApi.uploadImg({
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data;'
        },
        timeout: 20000
      })
      // 图片信息绑定到节点上
      this.content[nodeId].imgInfo = {
        url: imgUrl,
        width: 250,
        height: (250 * height) / width
      }
      await this.setContent(this.content)
    }
  },
  persist: {
    enabled: false
  }
})

export default useMapStore
