import axios from 'axios'
// 创建axios实例
const instance = axios.create({
  timeout: 1000 * 12,
  // eslint-disable-next-line no-undef
  baseURL: BASE_API_URL
})
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/json'

export async function asyncHttp(
  url,
  config = { method: 'get' },
  extraData = undefined
) {
  const [error, result] = await instance(url, config)
    .then(res => [null, res])
    .catch(err => [err, null])
  if (error || !result) {
    return null
  }
  return result.data
}

export function getUrlParams() {
  const { search } = window.location
  if (!search) return null
  const queryStr = search.split('?')[1]
  const arr = queryStr.split('&')
  const params = {}
  arr.forEach(query => {
    const [key, val] = query.split('=')
    params[key] = val
  })
  return params
}
