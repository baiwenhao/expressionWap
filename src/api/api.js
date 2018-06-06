import { show, hide } from 'loading'
import { Confirm } from '@common/confirm'

export const api = (key) => {
  if (window.navigator.onLine) {
    // const r = window.config.siteUrl
    let r = ''
    if (location.protocol === 'https:') {
      r = 'https://m.51biaoqing.com/'
    } else {
      r = 'http://m.51biaoqing.com/'
    }
    return r + {
      label: 'word/category',
      menu: 'templetCategory/list',
      post: 'templet/list',
      img: 'templetImage/list',
      random: 'word/random',
      hot: 'word/hot',
      list: 'word/list',
      msg: 'word/similar',
      uploadOss: 'common/uploadFileTemp',
      uploadSave: 'track/jigsaws',
      postImg: 'track/jigsaw',
      postFace: 'make/cutFace'
    }[key]
  } else {
    setTimeout(() => {
      Confirm({
        title: '网络异常',
        text: '是否重新加载'
      }, (status) => {
        if (status === 'ok') {
          window.location.assign(window.location.href)
        }
      })
    }, 2000)
  }
}

export const axios = (key, method, params, status) => {
  if (!status) show()
  // window.__wxjs_environment !== 'miniprogram'
  const opt = {
    method,
    url: api(key)
  }
  if (method === 'post' || method === 'patch' || method === 'put') {
    opt.data = params
  } else {
    opt.params = params
  }
  return Axios(opt)
  .then((res) => {
    if (!status) hide()
    if (res.status !== 200 || !res.data.status) {
      Toast.top(res.data.errMsg)
      return Promise.reject(res.data.errMsg)
    } else {
      return res.data
    }
  })
}

Axios.defaults.retry = 4
Axios.defaults.timeout = 5000
Axios.defaults.retryDelay = 1000

Axios.interceptors.request.use((conf) => {
  return conf
}, (err) => {
  hide()
  return Promise.reject(err)
})

Axios.interceptors.response.use((res) => {
  if (res.status === 200) {
    return res
  } else {
    return Promise.reject(err)
  }
}, (err) => {
  hide()
  return Promise.reject(err)
})

// const originalRequest = error.config
// if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout')!=-1 && !originalRequest._retry) {
//   originalRequest._retry = true
//   return Axios.request(originalRequest)
// } else {
//   return Promise.reject(err)
// }