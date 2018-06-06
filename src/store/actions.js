import * as types from './mutations-types'
import { getCode } from '@common/util'
import { nav, cache } from '@api/data'
import { addText } from '@common/canvas'
import { axios, api } from '@api/api'

export const setNav = ({ commit, state }, opt) => {
  for (let i = 0; i < nav.length; i++) {
    if (nav[i].type === opt.type) {
      commit(types.SETNAV, nav[i])
      break
    }
  }
  if (opt.type === 'text') return opt.cb()
  commit(types.HOTMAIN, [])
  const main = cache[opt.type]
  if (main) {
    commit(types.HOTMAIN, main)
    opt.cb()
  } else {
    const i = getCode(nav, opt.type)
    axios('img', 'get', { categoryCode: i }).then((res) => {
      if (res.status && res.data) {
        if (location.protocol === 'https:') {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].url = res.data[i].url.replace(cache.http, cache.https)
          }
        } else if (location.protocol === 'http:' && location.host === 'maketest.51biaoqing.com') {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].url = res.data[i].url.replace(cache.http, cache.test)
          }
        }
        // res.data = res.data.sort((a, b) => { return 0.5 - Math.random() })
        cache[opt.type] = res.data
        commit(types.HOTMAIN, res.data)
        opt.cb()
        if (opt.type === 'body') {
          // if (cache[opt.type][0].createDetail) {
          //   cache.images.__path = 'body@/' + cache[opt.type][0].url
          //   addImg(cache[opt.type][0])
          // }
        }
      }
    })
  }
}
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
      pageSize: 12
    }).then((res) => {
      params.cb(res.data)
    })
  } else if (params.name === 'label') {
    axios(params.name, 'get').then((res) => { params.cb(res) })
  } else if (params.name === 'hot') {
    axios(params.name, 'get', {
      tag: '热门',
      page: params.page,
      pageSize: 12
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
