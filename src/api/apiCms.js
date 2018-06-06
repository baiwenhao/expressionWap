import { show, hide } from 'loading'
export const api = (key) => {
  // const r = window.config.siteUrl
  let r = ''
  if (location.protocol === 'https:') {
    r = 'https://m.51biaoqing.com/'
  } else {
    r = 'http://m.51biaoqing.com/'
  }
  return r + {
    save: 'templetImage/make',
    label: 'word/category',
    menu: 'templetCategory/list',
    post: 'templet/list',
    img: 'templetImage/list',
    random: 'word/random',
    hot: 'word/hot',
    list: 'word/list',
    msg: 'word/similar',
    loadimg: 'common/uploadFileTemp',
    uploadSave: 'track/jigsaws',
    uploadImg: 'track/jigsaw'
  }[key]
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
      return Promise.reject(res.data.errMsg)
    } else {
      return res.data
    }
  })
    // return new Promise((resolve, reject) => {
    //   wx.request({
    //     url: api(key),
    //     method: 'get',
    //     data: params,
    //     header: {
    //       'content-type': 'application/json'
    //     },
    //     success: (res) => {
    //       hide()
    //       if (res.status === 200 && res.data.status) {
    //         resolve(res.data)
    //       } else {
    //         reject(res.data.errMsg)
    //       }
    //     },
    //     fail: (e) => {
    //       Toast.top(e)
    //     }
    //   })
    // })
}

/*
<link href="//make.51biaoqing.com/dist/vendor.004731d8664a273ed4ca.css" rel="stylesheet">
  <link href="//make.51biaoqing.com/dist/app.004731d8664a273ed4ca.css" rel="stylesheet">
<script type="text/javascript" src="//make.51biaoqing.com/dist/vendor.d63c34e58d948cb4671b.js"></script>
  <script type="text/javascript" src="//make.51biaoqing.com/dist/app.9aa7c53748863c326a45.js"></script>
*/