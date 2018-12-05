import { fabric } from 'fabric'
import { filter } from '@common/util'
import './lib/Blob'
import './lib/canvas-toBlob'
import { saveAs } from 'file-saver'
import Axios from 'axios'

export const api = (key) => {
  const r = '//api.new.51biaoqing.com/api/v1.0.0/'
  return r + {
    list: 'match/infos',
    build: 'match/make',
    waterfull: 'matchExample/infos'
  }[key]
}

const nanoid = require('nanoid')
let canvas = ''
export const data = {
  pc: false
}
let fontSize = ''
// https://blog.csdn.net/yanzisu_congcong/article/details/77840526
export const cache = {
  test: 'http://testimg.51biaoqing.com',
  http: 'http://image.51biaoqing.com',
  https: 'http://openimg.51biaoqing.com'
}
export const setCanvas = (cb) => {
  if (IsPC()) {
    fontSize = 30
  } else {
    fontSize = 20
  }
  Axios.get(api('list')).then((res) => {
    res = res.data
    if (res.status) {
      cb(res.data.list, data.uuid)
    }
  })
}
export const getDiary = (opt, cd) => {
  Axios.get(api('waterfull'), {
    params: {
      pageSize: 20,
      matchId: opt.matchId,
      page: opt.page
    }
  }).then((res) => {
    res = res.data
    cd(res)
  })
}

export const imgBase64 = (url, crossOrigin) => {
  return new Promise(resolve => {
    const img = new Image()

    img.onload = () => {
      const c = document.createElement('canvas')

      c.width = img.naturalWidth
      c.height = img.naturalHeight

      const cxt = c.getContext('2d')

      cxt.drawImage(img, 0, 0)
      resolve(c.toDataURL('image/png'))
    }

    crossOrigin && img.setAttribute('crossOrigin', crossOrigin)
    img.src = url
  })
}

export const save = () => {
  const img = document.querySelector('#view img')
  img2base64(img.src).then((base64) => {
    const d = dataURItoBlob(base64, true) // Tainted canvases may not be exported.
    saveAs(d, (Math.random() + '').slice(2) + '.png')
    const fd = new FormData()
    fd.append('id', data.id)
    fd.append('word', document.querySelector('#area').innerHTML)
    fd.append('deviceToken', data.uuid)
    postData('http://mt.51biaoqing.com/match/make', fd)
  })
}

export const IsPC = () => {
  const userAgentInfo = navigator.userAgent
  const Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod")
  let flag = true
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break }
  }
  return flag
}

export const postData = (url, data, cb) => {
  Axios.post(url, data).then((res) => {
    cb(res.data)
  })
}

const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}

export const img2base64 = (url, crossOrigin) => {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      const cxt = c.getContext('2d')
      cxt.drawImage(img, 0, 0)
      resolve(c.toDataURL('image/png'))
    }
    img.setAttribute('crossOrigin', 'anonymous')
    img.src = url
  })
}

try {
  data.env = JSON.parse(window.navigator.userAgent)
  data.header = true
  data.uuid = data.env.deviceToken
  if (data.env.authToken) Axios.defaults.headers['token'] = data.env.authToken
} catch (err) {
  data.pc = IsPC()
  if (!localStorage.getItem('uuid')) {
    data.uuid = nanoid()
    localStorage.setItem('uuid', data.uuid)
  } else {
    data.uuid = localStorage.getItem('uuid')
  }
}
