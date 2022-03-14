import persistedState from 'vuex-persistedstate'
import { createStore } from 'vuex'
import * as d3 from '@/hooks/d3'
import * as handler from './handler'
import axios from '@/hooks/useHttp'
import API from '@/hooks/api'

const asyncAndCommit = async (url, mutationName, commit,
  config = { method: 'get' }, extraData = undefined) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}

const store = createStore({
  state: {
    // TODO 待改造 分模块 https://vuex.vuejs.org/zh/guide/modules.html
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

    originMapData: null,
    // originData: null,

    token: '',
    user: {},
    allTreeDocs: [],
    originAllDocs: [],
    navigationLists: [],

    showTable: false
  },
  mutations: {
    toggleShowTable (state) {
      state.showTable = !state.showTable
    },
    setRefs (state, refs) {
      state.refs = refs
      for (const key in refs) {
        state.selections[key] = d3.select(refs[key])
      }
    },
    setMapData (state, data) {
      console.log('setMapData')
      console.log(data)
      state.originMapData = data
    },
    setNavigationLists (state, id) {
      // 根据当前Id找到父文件夹
    },
    fetchUser (state, user) {
      console.log('[store] fetchUser ', user)
      state.user = user
    },
    fetchAllDocuments (state, data) {
      state.originAllDocs = data
      state.allTreeDocs = handler.handleSiderData(data)
    },
    login (state, rawData) {
      const { token, user } = rawData
      state.token = token
      state.user = user
      localStorage.setItem('token', token)
    }
  },
  actions: {
    toggleShowTable ({ commit }) {
      commit('toggleShowTable')
    },
    login ({ commit }, payload) {
      const { isLogin, loginForm } = payload
      return asyncAndCommit(isLogin ? API.login : API.register, 'login', commit, { method: 'post', data: loginForm })
    },
    setNavigationLists ({ commit }, id) {
      commit('setNavigationLists', id)
      return true
    },
    setRefs ({ commit }, refs) {
      return commit('setRefs', refs)
    },
    setUser ({ commit }, user) {
      return commit('setUser', user)
    },
    postSetFolder ({ commit, getters }, data) {
      const url = `${API.setFolder}/${getters.getUser._id}`
      return asyncAndCommit(url, 'fetchAllDocuments', commit, { method: 'post', data })
    },
    postSetDoc ({ commit, getters }, data) {
      const url = `${API.setDoc}/${getters.getUser._id}`
      return asyncAndCommit(url, 'fetchAllDocuments', commit, { method: 'post', data })
    },
    postRemove ({ commit, getters }, data) {
      const url = `${API.remove}/${getters.getUser._id}`
      return asyncAndCommit(url, 'fetchAllDocuments', commit, { method: 'post', data })
    },
    fetchUser ({ commit }) {
      return asyncAndCommit(API.getCurrentUser, 'fetchUser', commit)
    },
    fetchAllDocuments ({ commit, getters }) {
      const url = `${API.getAllDocs}/${getters.getUser._id}`
      return asyncAndCommit(url, 'fetchAllDocuments', commit)
    },
    fetchDocContent ({ commit, getters }, payload) {
      const url = `${API.getDocContent}/${getters.getUser._id}/${payload}`
      return asyncAndCommit(url, 'setMapData', commit)
    }
  },
  getters: {
    showTable: state => state.showTable,
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
    },
    getMapData: state => {
      return {
        originMapData: state.originMapData
      }
    }
  },
  plugins: [
    persistedState({ storage: window.localStorage })
  ]
})
export default store
