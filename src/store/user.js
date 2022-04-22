/**
 * 用户相关状态
 */
import { defineStore } from 'pinia'
import { asyncHttp } from './handler'
import API from '@/hooks/api'
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: undefined,
      user: undefined
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
    async login (payload) {
      const { isLogin, loginForm } = payload
      const data = await asyncHttp(isLogin ? API.login : API.register, { method: 'post', data: loginForm })
      this.token = data?.token
      this.user = data?.user
    },
    logout () {
      this.token = undefined
      this.user = undefined
      localStorage.clear()
    },
    async updateUser (data) {
      const url = `${API.editProfile}/${this.user._id}`
      const formData = new FormData()
      formData.append('user', encodeURIComponent(JSON.stringify(data.user)))
      if (data.file) {
        formData.append('file', data.file)
      }
      const res = await asyncHttp(url, {
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data;'
        },
        timeout: 20000
      })
      this.user = res
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'zmindmap_user',
        storage: localStorage
      }
    ]
  }
})
