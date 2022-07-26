/* eslint-disable no-param-reassign */
import axios from 'axios'
import { ErrorTip } from '@/hooks/utils'

/**
 * 跳转登录页
 * 携带当前页面路由，在登录页面完成登录后返回当前页面
 */
const toLoginPage = () => {
  localStorage.clear()
  window.location.replace(`/login?redirect=${window.location.pathname}`)
}

const errorMap = {
  401: toLoginPage,
  403: () => ErrorTip('操作失败 无权限'),
  404: msg => {
    ErrorTip(msg?.error || '【404】找不到资源')
  }
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, msg) => {
  // 状态码判断
  const handler = errorMap[status]
  if (handler) handler(msg)
  else {
    ErrorTip('系统错误 请稍后再试')
  }
}

// 创建axios实例
const isPrd = process.env.NODE_ENV === 'production'
const { apiCfg } = window.CFG
const instance = axios.create({
  timeout: 1000 * 12,
  baseURL: isPrd ? apiCfg.prdHost : apiCfg.devHost
})
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/json'
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') || ''
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
