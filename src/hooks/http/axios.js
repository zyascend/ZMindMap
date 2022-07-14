/* eslint-disable no-param-reassign */
import axios from 'axios'
import { ErrorTip } from '@/hooks/utils'

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  window.location.replace(`/login?redirect=${window.location.pathname}`)
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  console.log('[errorHandle] status', other)
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      toLogin()
      break
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      ErrorTip('登录过期，请重新登录')
      localStorage.removeItem('token')
      // store.commit('loginSuccess', null)
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
    // 404请求不存在
    case 404:
      ErrorTip(other.error || '资源不存在')
      break
    default:
      ErrorTip('系统繁忙！操作失败')
  }
}

// 创建axios实例
const instance = axios.create({
  timeout: 1000 * 12,
  // TODO 如何动态获取域名？
  // baseURL: process.env.NODE_ENV === 'production' ? 'https://mapapi.kimjisoo.cn' : 'http://localhost:3003'
  // eslint-disable-next-line no-undef
  baseURL: BASE_API_URL
})
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/json'
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    token && (config.headers.Authorization = `Bearer ${token}`)
    return config
  },
  error => Promise.error(error)
)

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => (res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res)),
  // 请求失败
  error => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data)
      return Promise.reject(response)
    }
    // TODO 处理断网的情况
    return Promise.reject(error)
  }
)

export default instance
