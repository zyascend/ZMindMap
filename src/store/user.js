/**
 * 用户相关状态
 */
import { defineStore } from 'pinia'
import API from '@/hooks/api'
import { asyncHttp } from './handler'

const useUserStore = defineStore('user', {
  state: () => ({
    token: undefined,
    user: undefined
  }),
  getters: {
    getUser: state => state.user,
    getToken: state => state.token || localStorage.getItem('token')
  },
  actions: {
    async login(payload) {
      const { isLogin, loginForm } = payload
      const data = await asyncHttp(isLogin ? API.login : API.register, {
        method: 'post',
        data: loginForm
      })
      this.setUser(data)
    },
    setUser(data) {
      this.token = data?.token
      // ? 更安全的做法：不用[token]关键字
      localStorage.setItem('token', this.token)
      this.user = data?.user
    },
    logout() {
      this.token = undefined
      this.user = undefined
      localStorage.clear()
    },
    async updateUser(data) {
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

export default useUserStore
