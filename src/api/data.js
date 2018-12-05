
export const Data = {

}

try {
  Data.env = JSON.parse(window.navigator.userAgent)
} catch (err) {

}

export const nav = [{
  code: 1,
  name: '身体',
  type: 'body',
  icon: 'icon-shenti'
}, {
  code: 2,
  name: '脸部',
  type: 'head',
  icon: 'icon-lianbu'
}, {
  code: 4,
  name: '贴纸',
  type: 'sticker',
  icon: 'icon-tiezhi'
}, {
  code: 0,
  name: '文字',
  type: 'text',
  icon: 'icon-wenzixuanzhong'
}]

export const navHeight = 50
export const menu = [{
  code: '',
  name: '最近使用',
  type: 'menuRecent'
}, {
  code: 1,
  name: '形象',
  type: 'menuImage'
}, {
  code: 2,
  name: '贴纸',
  type: 'menuSticker'
}, {
  code: 3,
  name: '其他',
  type: 'menuOther'
}]

export const list = {}
export const main = {}
export const cache = {
  getFont: (cb) => {
    $youzikuClient.getFontFace({
      // apikey: 'f1b2b0f7171d6c45e90a0d3b3363519a', // url 替代
      AccessKey: cache.family.AccessKey,
      Content: cache.tmp
    }, (res) => {
      const fontFamily = res ? res.FontFamily : 'PingFang SC'
      cb(fontFamily)
    })
  },
  time: 0, // 0.1
  timer: null, // 0.1
  removeObj: [],
  // hot
  family: {
    FontFamily: 'Yuppy SC'
  },
  body: '',
  head: '',
  sticker: '',
  history: { // app历史记录
    state: [],
    lock: 1,
    mods: 0
  },
  isRedoing: !1,
  text: '',
  _canvas: '',
  _history: '',
  menuActiveType: '',
  images: {},
  // 待删除
  test: 'http://testimg.51biaoqing.com',
  http: 'http://image.51biaoqing.com',
  https: 'http://openimg.51biaoqing.com'
}

window.cc = cache
