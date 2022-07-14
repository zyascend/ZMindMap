// const { getOptions } = require('loader-utils')
// const { validate } = require('schema-utils')
// const schema = require('./i-babel-schema.json')
// const babel = require('@babel/core')
// const util = require('util')

// [📕babel.transform是普通的异步方法📕]
// const transform = util.promisify(babel.transform)
// eslint-disable-next-line import/no-extraneous-dependencies
const { compileTemplate } = require('@vue/compiler-sfc')

module.exports = function (content, map, meta) {
  const loaderContext = this
  const { resourcePath, loaderIndex } = loaderContext
  console.log(resourcePath, loaderIndex)
  const { code } = compileTemplate({
    id: JSON.stringify(resourcePath),
    source: content,
    filename: resourcePath,
    transformAssetUrls: false
  })
  if (resourcePath.indexOf('404') > 0) {
    console.log(`${code}\nexport default { render: render }`)
  }
  return `${code}\nexport default { render: render }`
}
