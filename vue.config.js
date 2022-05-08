const path = require('path')
const webpack = require('webpack')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const IS_PROD = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: IS_PROD ? 'https://cdn.kimjisoo.cn/' : '/',
  pages: {
    index: {
      entry: './src/main.js',
      template: './public/index.html',
      title: 'ZMind思维导图',
      chunks: ['chunk-vendors', 'chunk-common', 'chunk-ele', 'index']
    },
    mlogin: {
      entry: './src/mlogin/main.js',
      template: './public/mlogin.html',
      title: '扫码登录ZMindMap',
      chunks: ['chunk-vendors', 'chunk-common', 'mlogin']
    }
  },
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
            test: /[\\/]node_modules[\\/]@?element-plus[\\/]/,
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
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .end()
    const fileRule = config.module.rule('file')
    fileRule.uses.clear()
    fileRule
      .test(/\.svg$/)
      .exclude.add(path.resolve(__dirname, 'src/assets/pic'))
      .end()
      .use('file-loader')
      .loader('file-loader')
    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .end()
    // 解决：worker 热更新问题
    config.module
      .rule('js').exclude.add(/\.worker\.js$/)
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        BASE_API_URL: IS_PROD ? JSON.stringify('https://mapapi.kimjisoo.cn')
          : JSON.stringify('http://localhost:3003')
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      require('unplugin-element-plus/webpack')({}),
      new SentryWebpackPlugin({
        dryRun: !IS_PROD, // 只有生成环境才上传source map
        include: 'dist',
        ignore: ['node_modules', 'webpack.config.js']
      })
    ]
  }
}
