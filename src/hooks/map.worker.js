import md5 from 'js-md5'

onmessage = function (e) {
  const { source, type } = e.data
  let result
  switch (type) {
    case 'MD5':
      result = md5(source)
      break
    default:
      break
  }
  postMessage({ type, result })
}
