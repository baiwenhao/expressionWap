import * as types from './mutations-types'
import { getCode } from '@common/util'
import { nav, cache } from '@api/data'
import { addText } from '@common/canvas'
import { axios, api } from '@api/api'

export const setNav = ({ commit }, opt) => {
  for (let i = 0; i < nav.length; i++) {
    if (nav[i].type === opt.type) {
      commit(types.SETNAV, nav[i])
      break
    }
  }
  if (opt.type === 'text') {
    opt.cb && opt.cb()
    return
  }
  commit(types.HOTMAIN, [])
  const main = cache[opt.type]
  if (main) {
    setTimeout(() => {
      commit(types.HOTMAIN, main)
    }, 0)
    opt.cb && opt.cb()
  } else {
    const i = getCode(nav, opt.type)
    axios('img', 'get', { categoryCode: i }).then((res) => {
      if (res.status && res.data) {
        res.data = res.data.sort((a, b) => { return 0.5 - Math.random() })
        cache[opt.type] = res.data
        commit(types.HOTMAIN, res.data)
        opt.cb && opt.cb()
      }
    })
  }
}

axios('img', 'get', { categoryCode: 2 }).then((res) => {
  if (res.status && res.data) {
    cache['head'] = res.data
  }
})

export const search = ({ commit }, params) => {
  if (params.name === 'hotMain') {
    commit(types.HOTMAIN, params.data)
  } else if (params.name === 'random') {
    axios(params.name, 'get').then((res) => {
      addText({ text: res.data })
    })
  } else if (params.name === 'list') {
    axios(params.name, 'get', {
      tag: params.tag,
      page: params.page,
      pageSize: 16
    }).then((res) => {
      params.cb(res.data)
    })
  } else if (params.name === 'label') {
    axios(params.name, 'get').then((res) => { params.cb(res) })
  } else if (params.name === 'hot') {
    axios(params.name, 'get', {
      tag: '热门',
      page: params.page,
      pageSize: 16
    }).then((res) => {
      params.cb(res.data)
    })
  } else if (params.name === 'msg') {
    axios(params.name, 'get', { word: params.word }).then((res) => {
      params.cb(res.data)
    })
  }
}
export const uploadImg = ({ commit }, obj) => {
  obj.src = obj.src.replace(/data:image\/(png|jpeg|gif);base64,/, '')
  const fd = new FormData()
  fd.append('imageType', 'png')
  fd.append('base64Str', obj.src)
  fd.append('deviceToken', cache.uuid)
  const url = api('uploadOss')
  const x = new XMLHttpRequest()
  x.open('POST', url)
  x.onload = (res) => {
    if (x.status === 200) {
      obj.callback(JSON.parse(x.responseText))
    } else {
      Toast.top('上传出错')
    }
  }
  x.send(fd)
}

export const uploadApp = ({ commit }, obj) => {
  obj.base64 = obj.base64.replace(/data:image\/(png|jpeg|gif);base64,/, '')
  const fd = new FormData()
  fd.append('bucket', 'meme')
  fd.append('base64Str', obj.base64)
  const x = new XMLHttpRequest()
  // const r = '//101.132.125.218:3080/api/v1.0.0/common/uploadFileTemp'
  const r = '//api.new.51biaoqing.com/api/v1.0.0/common/uploadFileTemp'
  x.open('POST', r)
  x.onload = (res) => {
    if (x.status === 200) {
      obj.callback(JSON.parse(x.responseText))
    }
  }
  x.send(fd)
}
