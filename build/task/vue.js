const webpackConfig = require('../webpack.dev')
if (process.env.DEV === 'cms') {
  webpackConfig.entry.app = webpackConfig.entry.app[0].replace(/main/, 'cms')
}
const webpackTask = require('./build-common')
// const ip = require('ip').address()
const log = console.log
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
// const ip = require('ip').address()
fse.emptyDirSync(path.resolve(__dirname, '../../dist'))
const port = process.env.port || 6666

webpackConfig.watch = true
if (process.env.DEV === 'app') {
  webpackConfig.output.publicPath = `//make.51biaoqing.com/`
} else {
  webpackConfig.output.publicPath = `//make.51biaoqing.com/`
}
webpackTask(webpackConfig)
// 是你 生成多余dist到这个上级目录