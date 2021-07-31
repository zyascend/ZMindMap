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

    treedData: null,
    originData: null,

    token: 

  },
  mutations: {
    setRefs (state, refs) {
      state.refs = refs
      for (const key in refs) {
        state.selections[key] = d3.select(refs[key])
      }
    },
    setData (state, data) {
      state.treedData = data.treedData
      state.originData = data.originData
    },
    setToken (state, token) {
      state.token = token
    }
  },
  actions: {
    setRefs ({ commit }, refs) {
      return commit('setRefs', refs)
    },
    setData ({ commit }, data) {
      return commit('setData', data)
    },
    setToken ({ commit }, token) {
      return commit('setToken', token)
    }
  },
  getters: {
    getTreedData: state => {
      return state.treedData
    },
    getOriginData: state => {
      return state.originData
    },
    getSelections: state => {
      return state.selections
    },
    getRefs: state => {
      return state.refs
    },
    getToken: state => {
      return state.token
    }
  }
})
export default store
