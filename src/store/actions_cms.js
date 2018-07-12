import * as types from './mutations-types'
import { nav, cache } from '@api/data'
import { addText } from '@common/canvas_cms'
import { getCode } from '@common/util'
import { axios } from '@api/apiCms'

export const setNav = ({ commit, state }, opt) => {
  let main = ''
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
  // setTimeout(() => {
  if (cache.categoryCode) {
    main = cache[cache.categoryCode]
    cache[opt.type] = cache[cache.categoryCode]
    cache.categoryCode = ''
  } else if (cache[opt.type]) {
    main = cache[opt.type]
  }
  if (main) {
    setTimeout(() => {
      commit(types.HOTMAIN, main)
    }, 200)
    opt.cb && opt.cb()
  } else {
    const i = getCode(nav, opt.type)
    axios('img', 'get', { categoryCode: i }).then((res) => {
      if (res.status && res.data) {
        if (res.data.length) {
          if (location.protocol === 'https:') {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].url = res.data[i].url.replace(cache.http, cache.https)
            }
          } else if (location.protocol === 'http:' && location.host === 'maketest.51biaoqing.com') {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].url = res.data[i].url.replace(cache.http, cache.test)
            }
          } else if (location.protocol === 'http:' && location.host === 'make.51biaoqing.com') {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].url = res.data[i].url.replace(cache.http, cache.http)
              // console.log(res.data[i])
            }
          }
        } else {
          res.data = []
        }
        cache[opt.type] = res.data
        commit(types.HOTMAIN, res.data)
        opt.cb && opt.cb()
      }
    })
  }
  // }, 2000)
}

export const setHotMain = ({ commit }, data) => {
  commit(types.HOTMAIN, data)
}

export const searchRandom = ({ commit }) => {
  axios('random', 'get').then((res) => {
    addText(res.data || '双击查询下')
  })
}

export const searchTag = ({ commit }, params) => {
  axios('list', 'get', { tag: params.tag }).then((res) => {
    params.cb(res.data)
  })
}

export const searchHot = ({ commit }, cb) => {
  axios('hot', 'get', { tag: '热门' }).then((res) => {
    cb(res.data)
  })
}
export const searchLabel = ({ commit }, cb) => {
  axios('label', 'get').then((res) => {
    cb(res)
  })
}
export const searchVal = ({ commit }, params) => {
  axios('msg', 'get', { word: params.word }).then((res) => {
    params.cb(res.data)
  })
}
export const searchStatus = ({ commit }, obj) => {
  // commit(types.STATESEARCH, obj.status || false)
  // obj.input.value = ''
}
export const uploadImg = ({ commit }, obj) => {
  obj.src = obj.src.replace('data:image/png;base64,', '')
  const fd = new FormData()
  fd.append('imageType', 'png')
  fd.append('base64Str', obj.src)
  const url = 'http://m.51biaoqing.com/common/uploadFileTemp' // todo
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
