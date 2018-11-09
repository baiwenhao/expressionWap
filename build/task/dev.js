if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse('"development"')
}

const port = process.env.PORT || 80
const log = console.log
const resolve = (dir) => path.join(__dirname, '..', dir)
const express = require('express')
const app = express()
const opn = require('opn')
const path = require('path')
const chalk = require('chalk')
// const webpack = require('webpack')
// const webpackTask = require('./build-common')
const ip = require('ip').address()
// const webpackDevMiddleware = require('webpack-dev-middleware')
// const dev = require('../webpack.dev')
// dev.output.publicPath = '/'
// const compiler = webpack(dev)
// const devMiddleware = webpackDevMiddleware(compiler, {
//   publicPath: compiler.options.output.publicPath,
//   noInfo: true,
//   quiet: true
// })
// webpackTask(dev)
app.set('views', path.resolve(__dirname, '../../dist'))
app.use(express.static(path.resolve(__dirname, '../../dist')))
app.engine('html', require('ejs').renderFile)
app.use('/assets', express.static(resolve('../src/assets')))
app.use('/templet', express.static(resolve('../templet')))
// app.use(devMiddleware)

// app.use((req, res) => {
//   const i = req.url.indexOf('templet')
//   if (i) {
//   }
// })

app.use('/edit', (req, res) => {
  res.render('index.html')
})

// app.use((req, res) => {
//   res.render('dev.html', {
//     title: 'dev',
//     vendor: dev.output.publicPath + 'vendor',
//     item: dev.output.publicPath + 'app'
//   })
// })
app.listen(port)

// devMiddleware.waitUntilValid(() => {
//   opn(`http://${ip}:${port}`)
//   log(chalk.yellow(`http://${ip}:${port}\n`))
// })
