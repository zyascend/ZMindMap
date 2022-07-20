/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/**
 * 导图和大纲笔记页面相关状态
 */
import { defineStore } from 'pinia'
import { ErrorTip } from '@/hooks/utils'
import { mapApi } from '@/hooks/http'

const useMapStore = defineStore('map', {
  state: () => ({
    // ? 【还是TypeScript好】
    mapData: null, // 导图所有原始数据：包括id，内容，风格等
    content: null, // 导图内容的纯数据扁平结构
    treeContent: null, // 导图内容的纯数据树形结构
    isSaving: false, // 设置Edit页面的数据的加载状态
    idFocused: null // 当前时刻被选中的节点ID
  }),
  actions: {
    setIdFocused(id) {
      this.idFocused = id
    },
    // 更新content 同时统一处理isSaving的状态
    async updateWithLoading(makeNewData) {
      if (!makeNewData || typeof makeNewData !== 'function') return
      if (this.isSaving) {
        ErrorTip('操作过于频繁！')
        return
      }
      this.isSaving = true
      const data = makeNewData()
      await this.remoteUpdateMap(data)
      this.isSaving = false
    },
    //  一般的导图节点级别更新
    async setContent(content) {
      await this.updateWithLoading(() => {
        this.content = content
        this.treeContent = flatToTree(content)
        return {
          ...this.mapData,
          definition: JSON.stringify(content)
        }
      })
    },
    // 整个导图的风格更新
    async setStyle(newStyle) {
      this.updateWithLoading(() => {
        return {
          ...this.mapData,
          styles: newStyle
        }
      })
    },
    // async setMarkers(markerList) {
    //   if (!this.idFocused) return
    //   this.updateWithLoading(() => {
    //     this.content[this.idFocused].markerList = markerList
    //     return {
    //       ...this.mapData,
    //       definition: JSON.stringify(this.content)
    //     }
    //   })
    // },
    /**
     * 从网络拿到导图信息后 放入store
     * @param {*} data
     */
    setDataFromRemote(data) {
      if (data && data.definition) {
        this.mapData = data
        this.content = JSON.parse(data.definition)
        this.treeContent = flatToTree(this.content)
      } else {
        ErrorTip('保存失败')
      }
    },
    /**
     * 初始获取导图数据
     * @param {*} docId
     */
    async fetchMap(docId) {
      const res = await mapApi.fetchMap(docId)
      this.setDataFromRemote(res)
    },
    /**
     * 向数据库提交更新
     * @param {*} data
     * @param {*} onFinish
     */
    async remoteUpdateMap(data) {
      const res = await mapApi.remoteUpdateMap(data)
      this.setDataFromRemote(res)
    },
    /**
     *  粘贴图片的逻辑
     * @param {*} param0
     * @returns
     */
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
      if (!imgUrl) {
        ErrorTip('图片上传失败')
        return
      }
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

function flatToTree(data) {
  if (!data) return null
  const values = Object.values(data)
  console.log('values', values)
  const treeData = values.filter(item => {
    const { _children, id } = item
    if (_children.length) {
      item._children = values.filter(e => {
        return id === e.parent
      })
    } else {
      item.children = values.filter(e => {
        return id === e.parent
      })
    }
    return item.parent === '-1'
  })
  console.log('[processTreeData]', treeData[0])
  return treeData[0]
}

export default useMapStore
