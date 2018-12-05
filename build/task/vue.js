const iterm = require('set-iterm2-badge')
const name = process.env.DEV
const webpackConfig = require('../webpack.dev')
if (name === 'cms') {
  iterm('表情cms')
  webpackConfig.output.publicPath = `//make.51biaoqing.com/`
  webpackConfig.entry.app = webpackConfig.entry.app[0].replace(/main/, 'cms')
  delete webpackConfig.entry.edit
} else if (name === 'edit') {
  webpackConfig.output.publicPath = '/'
  iterm('记仇')
  delete webpackConfig.entry.app
} else if (name === 'app') {
  delete webpackConfig.entry.edit
  // webpackConfig.output.publicPath = `//make.51biaoqing.com/`
  webpackConfig.output.publicPath = '/'
  iterm('表情制作')
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
webpackConfig.output.filename = '[name].js'
webpackConfig.output.chunkFilename = '[name].js'

webpackTask(webpackConfig)
