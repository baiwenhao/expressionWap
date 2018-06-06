const ip = require('ip').address()
const conf = {
  tpl: {
    title: 'vx-dev',
    staticUrl: `静态地址`,
    siteUrl: `请求地址`,
    inject: true,
    template: './build/views/HtmlwebpackPlugin.ejs',
    chunks: ['vendor', 'app']
  },
  output: {
    test: `//maketest.51biaoqing.com/dist/`,
    beta: `//make.51biaoqing.com/`,
    prod: `//make.51biaoqing.com/dist/`,
    oss: `//static.51biaoqing.com/wap/prod/0131/`
  },
  provide: {
    Vue: 'vue',
    Toast: 'toast',
    Axios: 'axios'
  }
}
if (process.env.DEV === 'edit') {
  conf.tpl.chunks.splice(1, 1, 'edit')
}
module.exports = conf
