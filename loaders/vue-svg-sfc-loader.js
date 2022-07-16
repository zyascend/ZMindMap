const { compileTemplate } = require('@vue/compiler-sfc')

module.exports = function (content, map, meta) {
  const loaderContext = this
  const { resourcePath } = loaderContext
  const { code } = compileTemplate({
    id: JSON.stringify(resourcePath),
    source: content,
    filename: resourcePath,
    transformAssetUrls: false
  })
  return `${code}\nexport default { render: render }`
}
