import axios from 'axios'
// 创建axios实例
const instance = axios.create({
  timeout: 1000 * 12,
  // eslint-disable-next-line no-undef
  baseURL: BASE_API_URL
})
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/json'

export async function asyncHttp (url, config = { method: 'get' }, extraData = undefined) {
  const [err, res] = await instance(url, config).then(res => [null, res]).catch(err => [err, null])
  if (err || !res) {
    return null
  }
  return res.data
}

export function getUrlParams () {
  const search = location.search
  if (!search) return null
  const queryStr = search.split('?')[1]
  const arr = queryStr.split('&')
  const params = {}
  for (let i = 0; i < arr.length; i++) {
    const p = arr[i].split('=')
    params[p[0]] = p[1]
  }
  return params
}
