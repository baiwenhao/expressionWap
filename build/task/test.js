const webpackConfig = require('../webpack.dev')
webpackConfig.entry.app[0] = webpackConfig.entry.app[0].replace(/main/, 'cms')
const webpackTask = require('./build-common')
const log = console.log
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
fse.emptyDirSync(path.resolve(__dirname, '../../dist'))
webpackConfig.watch = true
webpackConfig.output.publicPath = `//maketest.51biaoqing.com/`
webpackTask(webpackConfig)
