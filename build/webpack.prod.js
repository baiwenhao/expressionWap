const os = require('os')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlwebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ManifestPlugin = require('./utils/manifest')
const ZipWebpackPlugin = require('zip-webpack-plugin')
const OptimizeJsPlugin = require('optimize-js-plugin')
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')
const CompressionPlugin = require("compression-webpack-plugin")
const webpackConfig = require('./webpack.base')
const pkg = require('../package.json')
const utils = require('./utils')
const conf = require('./utils/config')
const resolve = (dir) => path.join(__dirname, '..', dir)
let name = ''
let _chunks = ''

const params = {
  dev: '"production"',
  title: '全民表情',
  staticUrl: '静态地址',
  siteUrl: '请求地址',
  timer: new Date().toLocaleString(),
  template: './build/views/HtmlwebpackPlugin.ejs',
  inject: 'body'
}

if (process.env.DEV === 'cms') {
  params.chunks = ['common', 'cms']
  params.filename = 'make.html'
  name = 'common'
} else if (process.env.DEV === 'edit') {
  params.chunks = ['vendor', 'edit']
  params.filename = 'edit.html'
  name = 'vendor'
} else {
  params.chunks = ['vendor', 'app']
  name = 'vendor'
}
const wb= merge(webpackConfig, {
  module: {
    rules: utils.styleLoaders({ extract: true })
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.ProvidePlugin(conf.provide),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      },
      output: {
        comments: false
      },
      sourceMap: false
    }),

    // new UglifyJsParallelPlugin({
    //   workers: os.cpus().length
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: name,
      minChunks: Infinity
    }),
    new ExtractTextPlugin({
      filename: '[name].[hash].css'
      // allChunks: true
    }),
    // CompressionPlugin
    // new CompressionPlugin({
    //   asset: "[path].gz[query]",
    //   algorithm: "gzip",
    //   test: /.(js|html)$/,
    //   threshold: 10240,
    //   minRatio: 0.8
    // }),
    new HtmlwebpackPlugin(params),
    new CleanWebpackPlugin(['dist', 'zip'], { root: `${process.cwd()}` }),
    // new ManifestPlugin({
    //   versionFiles: [
    //     'vendor.css',
    //     'vendor.js',
    //     'app.css',
    //     'app.js'
    //   ],
    //   hashNum: 7
    // }),
    new OptimizeJsPlugin({ sourceMap: false }),
    new webpack.optimize.ModuleConcatenationPlugin(), // https://github.com/lishengzxc/bblog/issues/34
    new ZipWebpackPlugin({
      path: '../zip',
      filename: `${pkg.name}.zip`
      // exclude: [/\.html$/]
    })
  ],
  devtool: false
})

module.exports = wb
