const path = require('path')
const IS_PROD = process.env.NODE_ENV === 'production'
module.exports = {
  publicPath: 'https://cdn.kimjisoo.cn/',
  chainWebpack: config => {
    if (IS_PROD) {
      config.optimization.splitChunks({
        cacheGroups: {
          common: {
            name: 'chunk-common',
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            reuseExistingChunk: true
          },
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'initial',
            priority: 2,
            reuseExistingChunk: true,
            enforce: true
          },
          elementui: {
            name: 'chunk-ele',
            test: /[\\/]node_modules[\\/]element-plus[\\/]/,
            chunks: 'initial',
            priority: 3,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      })
    }
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .test(/\.svg$/)
      .include.add(path.resolve(__dirname, 'src/assets/pic'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    const fileRule = config.module.rule('file')
    fileRule.uses.clear()
    fileRule
      .test(/\.svg$/)
      .exclude.add(path.resolve(__dirname, 'src/assets/pic'))
      .end()
      .use('file-loader')
      .loader('file-loader')
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'ZMind思维导图'
        return args
      })
  }
}
