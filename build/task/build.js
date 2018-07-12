if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse('"production"')
}
const log = console.log
const fs = require('fs-extra')
const chalk = require('chalk')
const env = require('../utils/config')
const inquirer = require('inquirer')
const webpackTask = require('./build-common')
const webpackConfig = require('../webpack.prod')
const compile = (buildEnv) => {
  if (process.env.DEV === 'cms') {
    const src = webpackConfig.entry.app[0]
    delete webpackConfig.entry.app
    delete webpackConfig.entry.edit
    webpackConfig.entry.cms = src.replace(/main/, 'cms')
    const common = webpackConfig.entry.vendor.slice(0)
    delete webpackConfig.entry.vendor
    webpackConfig.entry.common = common
  }
  webpackConfig.output.publicPath = env.output[buildEnv]
  return Promise.resolve()
    .then(() => webpackTask(webpackConfig, buildEnv))
    .catch((err) => {
      console.log(chalk.red('Compiler encountered an error.'), err)
      process.exit(1)
    })
}
fs.removeSync('./dist')
fs.remove('./zip', () => {
  inquirer.prompt({
    type: 'rawlist',
    name: 'env',
    message: '\n\n选择编译到哪个环境?',
    choices: ['test', 'beta', 'prod', 'oss'],
    default: ['test']
  }).then((res) => {
    compile(res.env)
  })
})

