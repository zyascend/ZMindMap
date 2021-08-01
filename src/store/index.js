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

    token: '',
    user: {}

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
      const bearerToken = `Bearer ${token}`
      localStorage.setItem('token', bearerToken)
      state.token = bearerToken
    },
    setUser (state, user) {
      state.user = user
      console.log('[store] setUser ', user)
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
    },
    setUser ({ commit }, user) {
      return commit('setUser', user)
    }
  },
  getters: {
    getTreedData: state => state.treedData,
    getOriginData: state => state.originData,
    getSelections: state => state.selections,
    getRefs: state => state.refs,
    getToken: state => state.token,
    getUser: state => state.user
  }
})
export default store
