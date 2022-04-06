/**
 * 导图和大纲笔记页面相关状态
 */
import { defineStore } from 'pinia'
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
      }
    }
  },
  getters: {
    getUser: state => {
      return state.user
    },
    getToken: state => {
      return state.token || localStorage.getItem('token')
    }
  },
  actions: {
    setRefs (refs) {
      this.refs = refs
      for (const key in refs) {
        this.selections[key] = d3.select(refs[key])
      }
    }
  },
  persist: {
    enabled: false
  }
})
