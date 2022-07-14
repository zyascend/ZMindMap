import axios from './axios'
import apis from './apis'

const asyncHttp = async (
  url,
  config = { method: 'get' },
  extraData = undefined
) => {
  const [error, result] = await axios(url, config)
    .then(res => [null, res])
    .catch(err => [err, null])
  if (error || !result) {
    return null
  }
  return result.data
}

const withUserIdUrl = url => {
  const { user } = JSON.parse(localStorage.getItem('zmindmap_user'))
  return `${url}/${user?._id}`
}

const normalGet = async (url, withUserId = true) => {
  let res
  if (withUserId) {
    res = await asyncHttp(withUserIdUrl(url))
  } else {
    res = await asyncHttp(url)
  }
  return res
}

const normalPost = async (url, data, withUserId = true) => {
  let requestUrl
  if (withUserId) {
    requestUrl = withUserIdUrl(url)
  } else {
    requestUrl = url
  }
  const res = await asyncHttp(requestUrl, {
    method: 'post',
    data
  })
  return res
}

export const docApi = {
  fetchAllDocuments: async () => {
    const res = await normalGet(apis.getAllDocs)
    return res
  },
  postSetFolder: async data => {
    const res = await normalPost(apis.setFolder, data)
    return res
  },
  postSetDoc: async data => {
    const res = await normalPost(apis.setDoc, data)
    return res
  },
  postRemove: async data => {
    const res = await normalPost(apis.remove, data)
    return res
  }
}
export const mapApi = {
  fetchMap: async docId => {
    const url = `${withUserIdUrl(apis.getDocContent)}/${docId}`
    const res = await normalGet(url, false)
    return res
  },
  remoteUpdateMap: async data => {
    const res = await normalPost(apis.setDocContent, data)
    return res
  },
  uploadImg: async config => {
    const res = await asyncHttp(withUserIdUrl(apis.uploadImg), {
      method: 'post',
      ...config
    })
    return res
  }
}

export const userApi = {
  login: async data => {
    const res = await normalPost(apis.login, data, false)
    return res
  },
  register: async data => {
    const res = await normalPost(apis.register, data, false)
    return res
  },
  updateUser: async config => {
    const res = await asyncHttp(withUserIdUrl(apis.editProfile), {
      method: 'post',
      ...config
    })
    return res
  },
  generateCode: async () => {
    const res = await normalGet(apis.getCode, false)
    return res
  },
  getCodeStatus: async qid => {
    const res = await normalGet(`${apis.getCodeStatus}?qid=${qid}`, false)
    return res
  }
}

export const websiteApi = {
  fetchMapStyles: async () => {
    const res = await normalGet(apis.getStyles, false)
    return res
  }
}
