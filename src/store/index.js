import { createStore } from 'vuex'
import * as d3 from '../hooks/d3'
import * as handler from './handler'
import axios from '../hooks/useHttp'
import API from '../hooks/api'

import tables from '@/mock/tables'

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
    user: {},
    allTreeDocs: [],
    originAllDocs: [],
    navigationLists: []
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
    setNavigationLists (state, id) {
      // 根据当前Id找到父文件夹
    },
    fetchUser (state, user) {
      console.log('[store] fetchUser ', user)
      state.user = user
    },
    fetchAllDocuments (state, tables) {
      state.originAllDocs = tables
      state.allTreeDocs = handler.handleSiderData(tables)
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
    },
    fetchAllDocuments ({ commit }) {
      commit('fetchAllDocuments', tables)
      return tables
    },
    setNavigationLists ({ commit }, id) {
      commit('setNavigationLists', id)
      return true
    }
  },
  getters: {
    getTreedData: state => state.treedData,
    getOriginData: state => state.originData,
    getSelections: state => state.selections,
    getRefs: state => state.refs,
    getToken: state => state.token,
    getUser: state => state.user,
    getAllDocuments: state => id => {
      if (!id) {
        return state.allTreeDocs
      } else {
        return handler.findChildren(id, state.originAllDocs)
      }
    },
    getNavigationLists: state => id => {
      return handler.findNavigationPaths(id, state.originAllDocs)
    }
  }
})
export default store
