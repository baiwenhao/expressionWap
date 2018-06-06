const port = process.env.PORT || 6500
const log = console.log
const resolve = (dir) => path.join(__dirname, '..', dir)
const express = require('express')
const app = express()
const logger = require('morgan')
const opn = require('opn')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const ip = require('ip').address()
app.use(logger())
app.engine('html', require('ejs').renderFile)
app.set('views', resolve( './views'))
app.use('/dist', express.static(resolve('../dist')))
app.use('/make', (req, res) => {
  res.render('make.html')
})
app.use('/*', express.static(resolve('../dist')))
app.listen(port, () => {
  log(chalk.yellow(`http://${ip}:${port}\n`))
})