const path = require('path')
const webpack = require('webpack')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const { ESBuildMinifyPlugin } = require('esbuild-loader')

const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const IS_PROD = process.env.NODE_ENV === 'production'
const getAliasPath = dir => path.join(__dirname, dir)

module.exports = {
  productionSourceMap: false,
  lintOnSave: !IS_PROD,
  publicPath: IS_PROD ? 'https://cdn.kimjisoo.cn/' : '/',
  pages: {
    index: {
      entry: './src/main.js',
      template: './public/index.html',
      title: 'ZMind思维导图',
      chunks: [
        'chunk-vendors',
        'chunk-vendors-2',
        'chunk-ele',
        'index'
      ]
    }
  },
  chainWebpack: config => {
    config.when(!IS_PROD, config => {
      const rule = config.module.rule('js');
      // 清理自带的 babel-loader
      rule.uses.clear();
      // 添加 esbuild-loader
      rule
        .use('esbuild-loader')
        .loader('esbuild-loader')
        .options({
          target: 'es2015'
        })
      // 删除底层 terser, 换用esbuild-minimize-plugin
      config.optimization.minimizers.delete('terser');
      // 使用 esbuild 优化 css 压缩
      config.optimization
        .minimizer('esbuild')
        .use(ESBuildMinifyPlugin, [{ minify: true, css: true }]);
    })

    config.when(IS_PROD, config => {
      // 移除prefetch插件 减少对首页加载的带宽占用
      // config.plugins.delete('prefetch')
      // config.optimization.runtimeChunk({
      //   // https://webpack.docschina.org/configuration/optimization/#optimizationruntimechunk
      //   name: (entrypoint) => `runtime~${entrypoint.name}`,
      // }),
      config.optimization.splitChunks({
        cacheGroups: {
          // 其他的第三方库集中在一起
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'initial',
            priority: 2,
            reuseExistingChunk: true,
            enforce: true
          },
          // @sentry|@vueuse|cropperjs 很大 单独分包
          vendors2: {
            name: 'chunk-vendors-2',
            test: /[\\/]node_modules[\\/]@sentry|@vueuse|cropperjs/,
            chunks: 'initial',
            priority: 3,
            reuseExistingChunk: true,
            enforce: true
          },
          // 只有index入口用 且很大 需要单独打包
          elementui: {
            name: 'chunk-ele',
            test: /[\\/]node_modules[\\/]@?element-plus[\\/]/,
            chunks: 'initial',
            priority: 5,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }),
      config.optimization.minimizer('terser').tap(args => {
        // 移除 debugger
        args[0].terserOptions.compress.drop_debugger = true
        // 移除 console.log
        args[0].terserOptions.compress.pure_funcs = ['console.log']
        // 移除 注释
        args[0].terserOptions.output = {
          comments: false
        }
        return args
      })
    })
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
      .options({
        name: 'removeAttrs',
        params: { attrs: 'fill' }
      })
      .end()
    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .end()
    // 解决：worker 热更新问题
    config.module.rule('js').exclude.add(/\.worker\.js$/)
    config.resolve.alias
      .set('@', getAliasPath('src'))
      .set('assets', getAliasPath('src/assets'))
      .set('hooks', getAliasPath('src/hooks'))
      .set('views', getAliasPath('src/views'))
      .set('store', getAliasPath('src/store'))
      .set('components', getAliasPath('src/components'))
  },
  configureWebpack: {
    resolveLoader: {
      modules: ['node_modules', path.resolve(__dirname, 'loaders')],
    },
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
      new HardSourceWebpackPlugin(),
      new webpack.DefinePlugin({
        BASE_API_URL: IS_PROD
          ? JSON.stringify('https://mapapi.kimjisoo.cn')
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
        ignore: ['node_modules', 'vue.config.js']
      }),
      //* 实际上 七牛cdn对打包好的源文件自动进行了gzip
      // new CompressionWebpackPlugin({
      //   filename: '[path].gz[query]',
      //   algorithm: 'gzip',
      //   test: /\.js$|\.css$|\.html$|\.ttf$|\.eot$|\.woff$/,
      //   threshold: 10240,
      //   minRatio: 0.8,
      //   deleteOriginalAssets: false
      // }),
      new SpeedMeasurePlugin()
    ]
  }
}
