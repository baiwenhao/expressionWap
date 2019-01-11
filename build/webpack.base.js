const log = console.log
const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'
const resolve = (dir) => path.join(__dirname, '..', dir)
const utils = require('./utils')
const ip = require('ip').address()

const conf = {
  entry: {
    app: [resolve('src/main.js')],
    // edit: [resolve('src/edit.js')],
    vendor: [
      'vue',
      'fabric',
      './src/common/iconfont/iconfont.css',
      './src/common/common.css'
    ]
  },
  output: {
    path: resolve('dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.vue', '.js', '.json'],
    modules: [ // 去哪写目录下寻找第三方模块
      resolve('node_modules')
    ],
    alias: {
      'vue': 'vue/dist/vue.runtime.min.js',
      'vuex': 'vuex/dist/vuex.js',
      'vue-router': 'vue-router/dist/vue-router.min.js',
      'fabric': 'fabric/dist/fabric.js',
      'loading': resolve('src/common/loading'),
      'ripple': resolve('src/common/ripple'),
      'toast': resolve('src/common/toast'),
      '@common': resolve('src/common'),
      '@components': resolve('src/components'),
      '@pages': resolve('src/pages'),
      '@assets': resolve('src/assets'),
      '@api': resolve('src/api')
    }
  },
  // resolveLoader: {
  //   root: resolve('node_modules')
  // },
  module: {
    noParse: [/vue\.runtime\.min/, /vue-router\.min/],
    rules: [
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: [
          resolve('src')
        ],
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: utils.cssLoaders({
            sourceMap: isProduction ? false : true,
            extract: isProduction
          })
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [
          resolve('src'),
          resolve('node_modules/jsdom/lib/jsdom/living/generated/utils.js') // es6
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|swf|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: '[name].[hash:7].[ext]'
        }
      }
    ]
  },
  cache: true
}

module.exports = conf

/*
location ~* /(.*).(js|css)$ {
  add_header Access-Control-Allow-Origin *;
  root /Users/baiwenhao/workSpace/expressionWap/dist/$1.$2;
}
*/
