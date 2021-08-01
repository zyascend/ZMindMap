import { createStore } from 'vuex'
import * as d3 from '../hooks/d3'
import axios from '../hooks/useHttp'
import API from '../hooks/api'

const asyncAndCommit = async (url, mutationName, commit,
  config = { method: 'get' }, extraData = undefined) => {
  const { data } = await axios(url, config)
  console.log('[store] asyncAndCommit', data)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}

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
    fetchUser (state, user) {
      console.log('[store] fetchUser ', user)
      state.user = user
    },
    login (state, rawData) {
      const { token, user } = rawData.data
      state.token = token
      state.user = user
      localStorage.setItem('token', token)
    }
  },
  actions: {
    setRefs ({ commit }, refs) {
      return commit('setRefs', refs)
    },
    setData ({ commit }, data) {
      return commit('setData', data)
    },
    setUser ({ commit }, user) {
      return commit('setUser', user)
    },
    login ({ commit }, payload) {
      return asyncAndCommit(API.loginUrl, 'login', commit, { method: 'post', data: payload })
    },
    fetchUser ({ commit }) {
      return asyncAndCommit(API.currentUserUrl, 'fetchUser', commit)
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
