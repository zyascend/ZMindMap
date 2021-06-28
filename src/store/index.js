import { createStore } from 'vuex'
import * as d3 from '../hooks/d3'

const store = createStore({
  state: {
    refs: {
      mainSvg: undefined,
      mainG: undefined,
      measureSvg: undefined,
      foreignObject: undefined,
      foreignDiv: undefined
    },
    selections: {
      mainSvg: undefined,
      mainG: undefined,
      measureSvg: undefined,
      foreignObject: undefined,
      foreignDiv: undefined
    },

    treedData: null

  },
  mutations: {
    setRefs (state, refs) {
      state.refs = refs
      for (const key in refs) {
        state.selections[key] = d3.select(refs[key])
      }
    },
    setTreedData (state, treedData) {
      state.treedData = treedData
    }
  },
  actions: {
    setRefs ({ commit }, refs) {
      return commit('setRefs', refs)
    },
    setTreedData ({ commit }, treedData) {
      return commit('setTreedData', treedData)
    }
  },
  getters: {
    getTreedData: state => {
      return state.treedData
    },
    getSelections: state => {
      return state.selections
    },
    getRefs: state => {
      return state.refs
    }
  }
})
export default store
