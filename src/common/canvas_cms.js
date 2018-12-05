import store from '../store/index_cms'
import { fabric } from 'fabric'
// import './lib/gif'
// import './lib/Blob'
// import './lib/canvas-toBlob'
import 'fabric-customise-controls'
import viewImg from './viewImg'
import { dataURItoBlob, setData, getData, checkPlatform, sizeof, filter } from './util'
import { cache } from '../api/data'
import {
  _canvas,
  _control,
  Controls,
  Icons
} from '../api/canvas'
import { axios } from '@api/apiCms'
import { show, hide } from './loading'
import rectImg from '../assets/rect.png'

if (window.innerWidth !== 375 || window.innerHeight !== 603) {
  alert('窗口调整为宽：375，高：603')
}

const dev = checkPlatform()
const h = cache.history
const log = console.log
const padding = _control.padding * 2
let c = ''
const fontSize = 28
let scale = 300
let type = ''

fabric.Object.prototype.set(_control)
export const setCanvas = (id) => {
  const par = document.querySelector(id)
  const width = par.offsetWidth
  const height = par.offsetHeight
  par.insertAdjacentHTML('beforeend', '<canvas id="_canvas"></canvas>')
  cache.canvas = Object.assign(_canvas, { width, height })
  window.cs = c = new fabric.Canvas('_canvas', cache.canvas)
  fabric.Canvas.prototype.customiseControls(Controls)
  fabric.Object.prototype.customiseCornerIcons(Icons, () => {
    c.renderAll()
  })

  if (cache._canvas) {
    for (const key in cache._canvas) {
      c.add(cache._canvas[key])
    }
  } else {
    // addRect()
  }

  const bar = 50
  cache.rect = {}
  cache.rect.width = width - bar
  cache.rect.height = height - bar - 55
  cache.rect.top = bar
  cache.rect.left = bar / 2
  const d = document.createElement('div')
  d.style.width = cache.rect.width + 'px'
  d.style.height = cache.rect.height + 'px'
  d.style.left = cache.rect.left + 'px'
  d.style.top = cache.rect.top + 'px'
  d.className = "canvas_rect"
  document.querySelector('#canvas').insertAdjacentElement('afterbegin', d)

  c.renderAll()

  if (!cache.base) cache.base = cache.rect.height / 3 * 2
  if (!cache.top) cache.top = c.height - parseInt(c.height / 3)
  c.on({
    'mouse:down': (e) => {
      const tar = e.target
      if (!tar) {
        store.commit('SELECTED', {
          name: 'levels',
          status: false
        })
        store.commit('SELECTED', {
          name: 'flip',
          status: false
        })
        if (cache.targetObject) {
          const top = c.height - parseInt(c.height / 3) + 40
          cache.targetObject.setCoords()
          cache.targetObject.set({ top: top - (cache.targetObject.height / 2), left: (c.width - cache.targetObject.width) / 2 })
          cache.targetObject = ''
        }
      }
      if (!tar || tar.type !== 'i-text') return
    },
    'object:selected': (e) => {
      const t = e.target
      if (t.type === 'textbox') cache.targetObject = t
      const obj = c.getObjects()
      store.commit('SELECTED', {
        name: 'flip',
        status: true
      })
      if (obj.length >= 2) {
        store.commit('SELECTED', {
          name: 'levels',
          status: true
        })
      }
      if (t.type === 'i-text' && t.fontFamily !== cache.family.FontFamily) {
        cache.tmp = t.text
        if (t.fontFamily !== cache.family.FontFamily) {
          changeFamily()
        }
      }
      setTimeout(() => {
        if (!c.getActiveObject()) {
          store.commit('SELECTED', {
            name: 'levels',
            status: false
          })
          store.commit('SELECTED', {
            name: 'flip',
            status: false
          })
        }
      }, 100)
    },
    'object:added': (e) => {
      const t = e.target.__path.split('@')[0]
      if (t && t !== 'face') {
        e.target['sendBackwards']()
      }
    },
    'object:removed': (e) => {

    }
  })
}
const scaleImg = (img) => {
  const d = img.getBoundingRect()
  const p = {}
  p.left = (c.width - d.width) / 2
  p.top = (c.height - d.height) / 2
  img.set(p).setCoords()
  c.add(img)
  c.setActiveObject(img)
  c.renderAll()
}

const clearFacePaster = (cb) => {
  const d = c.getObjects()
  if (d.length >= 1) {
    let body = ''
    for (let i = 0; i < d.length; i++) {
      if (d[i].__path.split('@')[0] === 'body') {
        body = Object.assign(d[i])
      }
    }
    c.clear()
    c.add(body)
    c.renderAll()
    cb && cb()
  }
}

export const addLocalImg = (img) => {
  const t = new fabric.Image(img)
  t.__path = 'local@'
  scale = 300
  scaleImg(t)
}
export const build_old = () => {
  blur()
  c.clear()
  const d = store.state.hotMain
  let r = ''
  for (let i = 0; i < d.length; i++) {
    if (d[i].active) {
      r = d[i]
      break
    }
  }
  if (typeof r.createDetail === 'string') r.createDetail = JSON.parse(r.createDetail)
  for (let i = 0; i < r.createDetail.length; i++) {
    const type = r.createDetail[i].__path.split('@')[0]
    if (type !== 'text') {
      const img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')
      if (type === 'body') {
        img.src = r.url
      } else if (type === 'face') {
        img.src = rectImg
      }
      img.onload = () => {
        const im = new fabric.Image(img, r.createDetail[i])
        c.add(im)
      }
    } else {
      addText('', r.createDetail[i])
    }
  }
  c.renderAll()
}

export const build = () => {
  blur()
  c.clear()
  const d = store.state.hotMain
  let r = ''
  for (let i = 0; i < d.length; i++) {
    if (d[i].active) {
      r = d[i]
      break
    }
  }
  if (typeof r.createDetail === 'string') r.createDetail = JSON.parse(r.createDetail)
  if (!r.createDetail.body) {
    build_old()
    return
  }
  if (r.createDetail.body[0]) {
    const body_img = new Image()
    body_img.setAttribute('crossOrigin', 'anonymous')
    if (location.hostname === 'maketest.51biaoqing.com"') {
      _src = _src.replace('image', 'testimg')
    }
    body_img.src = r.url
    body_img.onload = () => {
      const _body = new fabric.Image(body_img, r.createDetail.body[0])
      c.add(_body)
      if (r.createDetail.face && r.createDetail.face.length) {
        for (let j = 0; j < r.createDetail.face.length; j++) {
          const face_img = new Image()
          face_img.src = rectImg
          face_img.detail = r.createDetail.face[j]
          face_img.onload = (e) => {
            const _face = new fabric.Image(face_img, face_img.detail)
            c.add(_face)
            c.renderAll()
          }
        }
      }
      if (r.createDetail.paster && r.createDetail.paster.length) {
        for (let n = 0; n < r.createDetail.paster.length; n++) {
          let _src = r.createDetail.paster[n].__path.split('@/')[1]
          if (location.hostname === 'maketest.51biaoqing.com"') {
            _src = _src.replace('image', 'testimg')
          }
          const paster_img = new Image()
          paster_img.setAttribute('crossOrigin', 'anonymous')
          paster_img.src = _src
          paster_img.onload = () => {
            const _paster = new fabric.Image(paster_img, r.createDetail.paster[n])
            c.add(_paster)
            c.renderAll()
          }
        }
      }
    }
    if (r.createDetail.text) {
      for (let i = 0; i < r.createDetail.text.length; i++) {
        addText('', r.createDetail.text[i])
      }
    }
  } else {
    alert('身体图片不存在')
  }
}

export const addRect = () => {
  const obj = c.getObjects()
  let n = 0
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].__path.split('@')[0] === 'face') {
      n += 1
    }
  }
  if (n >= 5) {
    alert('暂不支持更多脸部定位了')
    return
  }
  const d = c.getObjects()
  const img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  img.src = rectImg
  img.onload = () => {
    const params = {
      left : Math.floor((c.width - 100) * Math.random()),
      top : Math.floor((c.height - 100) * Math.random()),
      _controlsVisibility: Object.assign({}, _control._controlsVisibility, { tr: false })
    }
    const i = new fabric.Image(img, params)
    i.__path = 'face@' // 是否给个绝对地址
    c.add(i)
    c.setActiveObject(i)
    c.renderAll()
  }
}

const loadImg = (type, url, obj) => {
  const img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  img.src = url
  img.onload = () => {
    const params = {
      __path: cache.images.__path,
      crossOrigin: 'anonymous'
    }
    const top = c.height - parseInt(c.height / 3)
    if (type === 'face' && obj) { // obj true
      const angle = obj.angle
      obj.set({ angle: 0 }).setCoords()
      const w = obj.getBoundingRect().width
      const h = obj.getBoundingRect().height
      params.scaleX = (w - padding) / img.width
      params.scaleY = (h - padding) / img.height
      obj.set({ angle }).setCoords()
    } else {
      const d = filter(img.width, img.height, cache.base)
      params.scaleX = (d.w - padding * 2) / img.width
      params.scaleY = (d.h - padding * 2) / img.height
      // params.top = (cache.rect.height - d.h) / 2 + 34
    }
    if (obj) {
      obj.setSrc(url, (v) => {
        if (type !== 'face') {
          v.setCoords()
          v.set({ top: top - v.getBoundingRect().height, left: (c.width - v.getBoundingRect().width + padding) / 2 }).setCoords()
        }
        c.setActiveObject(v)
        c.renderAll()
      }, params)
    } else {
      if (cache.images.__path.split('@')[0] === 'body') params._controlsVisibility = Object.assign({}, _control._controlsVisibility) // { br: false }
      const t = new fabric.Image(img)
      t.set(params).setCoords()
      t.set({
        top: top - t.getBoundingRect().height,
        left: (c.width - t.getBoundingRect().width + padding) / 2
      }).setCoords()
      c.add(t)
      c.setActiveObject(t)
      c.renderAll()
    }
  }
}

export const addImg = (src) => {
  const objs = c.getObjects()
  const d = c.getActiveObject()
  let type = cache.images.__path.split('@')[0]
  const url = src
  if (d) {
    const t = d.__path.split('@')[0]
    if (t === 'body') {
      if (type === 'body') {
        clearFacePaster(() => {
          loadImg(type, url, d)
        })
      } else if (type === 'paster') {
        blur()
        loadImg(type, url)
      } else if (type === 'face') {
        cache.lock = 0
        for (let i = 0; i < objs.length; i++) {
          if (objs[i].__path.split('@')[0] === 'face') {
            cache.lock += 1
          }
        }
        if (cache.lock === 1) {
          for (let i = 0; i < objs.length; i++) {
            if (objs[i].__path.split('@')[0] === 'face') {
              loadImg(type, url, objs[i])
              break
            }
          }
        } else {
          alert('选择一个脸部')
        }
      }
    } else if (t === 'face') {
      if (type === 'face') {
        loadImg(type, url, d)
      } else if (type === 'body') {
        blur()
        cache.lock = 0
        for (let i = 0; i < objs.length; i++) {
          if (objs[i].__path.split('@')[0] === 'body') {
            cache.lock += 1
            loadImg(type, url, objs[i])
            break
          }
        }
        if (!cache.lock) loadImg(type, url)
      } else if (type === 'paster') {
        blur()
        loadImg(type, url)
      }
    } else if (t === 'paster') {
      blur()
      loadImg(type, url)
    } else if (t === 'text') {
      blur()
      for (let i = 0; i < objs.length; i++) {
        if (objs[i].__path.split('@')[0] === type) {
          loadImg(type, url, objs[i])
          return
        }
      }
      loadImg(type, url)
    }
  } else {
    if (type === 'body') {
      clearFacePaster()
      cache.lock = 0
      for (let i = 0; i < objs.length; i++) {
        if (objs[i].__path.split('@')[0] === 'body') {
          cache.lock = 1
          loadImg(type, url, objs[i])
          break
        }
      }
      if (!cache.lock) {
        loadImg(type, url)
        cache.lock = 0
      }
    } else if (type === 'face') {
      cache.lock = 0
      if (objs.length === 1) {
        loadImg(type, url, objs[0])
      } else {
        for (let i = 0; i < objs.length; i++) {
          if (objs[i].__path.split('@')[0] === 'face') {
            cache.lock += 1
          }
        }
        if (cache.lock === 1) {
          for (let i = 0; i < objs.length; i++) {
            if (objs[i].__path.split('@')[0] === 'face') {
              loadImg(type, url, objs[i])
              break
            }
          }
        } else if (cache.lock > 1) {
          alert('选择一个脸部图片')
        } else {
          alert('nothing')
        }
      }
    } else if (type === 'paster') {
      loadImg(type, url)
    }
  }
}

export const back = () => {
  if (dev === 'Android') {
    window.jsHandler.postMessage('{ cmd: "goBack" }')
  } else if (dev === 'IOS') {
    window.webkit.messageHandlers.jsHandler.postMessage({
      cmd: 'goBack'
    })
  }
}

export const blur = () => {
  if (c.discardActiveObject) {
    c.discardActiveObject()
  } else if (c.requestRenderAll) {
    c.requestRenderAll()
  } else if (c.requestAll) {
    c.requestAll()
  }
}

export const modifyText = (text) => {
  cache.tmp = text
  const obj = c.getActiveObject()
  if (obj && obj.type === '') {
    obj.set({ text })
    c.renderAll()
  } else {
    addText(text)
  }
}

export const getLength = () => {
  return c.getObjects()
}

export const addText = (text, opt) => {
  cache.tmp = text
  const obj = c.getActiveObject()
  const top = c.height - parseInt(c.height / 3) + 40

  const conf = Object.assign({
    fontSize,
    fill: cache.color,
    __path: 'text@',
    lockMovementX: true,
    lockMovementY: true,
    selectable: true,
    textAlign: 'center',
    _controlsVisibility: Object.assign({}, _control._controlsVisibility, { br: false, bl: false })
    // editable: false
  }, opt)
  if (!cache.family.AccessKey) {
    Object.assign(conf, { fontFamily: cache.family.FontFamily || 'PingFang SC' })
    if (obj && obj.type === 'textbox') {
      obj.set({ fontSize, fill: cache.color, text  }).setCoords()
      obj.set({ top: top - (obj.height / 2), left: (c.width - obj.width) / 2 })
    } else {
      const t = new fabric.Textbox(cache.tmp, conf)
      t.setCoords()
      t.set({ top: top - (t.height / 2), left: (c.width - t.width) / 2 })
      c.add(t)
      c.setActiveObject(t)
      cache.targetObject = t
      // t.enterEditing()
      // t.hiddenTextarea.focus()
      // t.setSelectionStart(t.text.length)
      // t.setSelectionEnd(t.text.length)
    }
    c.renderAll()
  } else {
    $youzikuClient.getFontFace({
      AccessKey: cache.family.AccessKey,
      Content: text
    }, (res) => {
      if (!res) {
        if (obj) {
          obj.set(Object.assign({ text, fontSize }, { fontFamily: 'PingFang SC' })).setCoords()
        } else {
          blur()
          const t = new fabric.Textbox(text, Object.assign(conf, { fontFamily: 'PingFang SC' }))
          t.setCoords()
          t.set({ top: top - (t.height / 2), left: (c.width - t.width) / 2 })
          c.add(t)
          c.setActiveObject(t)
          cache.targetObject = t
        }
      } else {
        if (!obj) {
          blur()
          const t = new fabric.Textbox(text, Object.assign(conf, { fontFamily: res.FontFamily }))
          t.setCoords()
          t.set({ top: top - (t.height / 2), left: (c.width - t.width) / 2 })
          c.setActiveObject(t)
          cache.targetObject = t
        } else {
          obj.set(Object.assign({ text, fontSize }, { fontFamily: res.FontFamily })).setCoords()
        }
      }
      c.renderAll()
    })
  }
}

export const save = (route, id) => {
  blur()
  // c.deactivateAll().renderAll() // 1.7.17
  let _face = 0
  let obj = c.getObjects()
  if (!obj.length) return
  if (obj.length === 1) return alert('请添加身体!')
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].__path.split('@')[0] === 'face') {
      _face += 1
      break
    }
  }
  if (_face === 0) return alert('请添加脸部!')
  show()
  c.renderAll()
  const top = c.height - parseInt(c.height / 3) + 40
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].__path.split('@')[0] === 'face') {
      obj[i].set({ visible: false }).setCoords()
    }
    if (obj[i].__path.split('@')[0] === 'text') {
      obj[i].set({ fontSize: 32 }).setCoords()
      obj[i].set({ top: top - (obj[i].height / 1.9), left: (c.width - obj[i].getBoundingRect().width) / 2 })
    }
  }

  // const first = obj[0].getBoundingRect()
  // const params = {
  //   left: first.left,
  //   top: first.top,
  //   left_max: first.left,
  //   top_max: first.top
  // }
  // for (let i = 0; i < obj.length; i++) {
  //   const o = obj[i].getBoundingRect()
  //   if (!params._top) params._top = parseInt(o.height + o.top)
  //   if (params.top > o.top) params.top = parseInt(o.top)
  //   if (o.top + o.height > params._top) params._top = parseInt(o.top + o.height)

  //   if (!params._left) params._left = parseInt(o.width + o.left)
  //   if (o.left < params.left) params.left = parseInt(o.left)
  //   if (o.left + o.width > params._left) params._left = parseInt(o.width + o.left)
  // }
  // params.width = parseInt(params._left - params.left)
  // params.height = parseInt(params._top - params.top)
  // c.set({ 'backgroundColor': '#fff' })
  // const src = c.toDataURL({
  //   format: "image/png",
  //   multiplier: 1,
  //   left: params.left,
  //   top: params.top,
  //   width: params.width,
  //   height: params.height
  // })
  // c.set({ 'backgroundColor': '' }).renderAll()

  c.set({ 'backgroundColor': '#fff' })
  const src = c.toDataURL({
    format: "png",
    multiplier: 1,
    left: cache.rect.left,
    top: cache.rect.top,
    width: cache.rect.width,
    height: cache.rect.height
  })

  for (let i = 0; i < obj.length; i++) {
    if (obj[i].__path.split('@')[0] === 'text') {
      obj[i].set({ fontSize: 28 }).setCoords()
      obj[i].set({ top: top - (obj[i].height / 2), left: (c.width - obj[i].getBoundingRect().width) / 2 })
    }
  }
  c.set({ 'backgroundColor': '' }).renderAll()

  const p = {}
  const o = obj.slice(0)
  const body = []
  const face = []
  const text = []
  const paster = []
  for (let j = 0; j < o.length; j++) {
    const obj = {}
    const type = o[j].__path.split('@')[0]

    if (type !== 'text' && obj.width) obj.width = o[j].width
    if (type !== 'text' && obj.height) obj.height = o[j].height
    if (type === 'text') obj.fill = o[j].fill
    if (o[j].text) obj.text = o[j].text
    if (o[j].flipX) obj.flipX = o[j].flipX
    if (o[j].flipY) obj.flipY = o[j].flipY
    if (o[j].angle) obj.angle = o[j].angle

    if (type === 'paster') {
      if (location.hostname === 'maketest.51biaoqing.com"') {
        _src = _src.replace('image', 'testimg')
      }
      obj.__path = o[j].__path
    } else {
      obj.__path = o[j].__path.split('@')[0] + '@'
    }

    obj.scaleY = o[j].scaleY
    obj.scaleX = o[j].scaleX
    obj.left = o[j].left
    obj.top = o[j].top

    if (type === 'body') {
      body.push(obj)
    } else if (type === 'face') {
      face.push(obj)
    } else if (type === 'text') {
      text.push(obj)
    } else if (type === 'paster') {
      paster.push(obj)
    }
  }

  if (body.length) p.body = body
  if (face.length) p.face = face
  if (text.length) p.text = text
  if (paster.length) p.paster = paster

  const arr = store.state.hotMain.slice(0)
  store.commit('HOTMAIN', [])
  store.commit('HOTMAIN', arr)
  const d = {}

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].active) {
      d.index = i
      arr[i].createDetail = p
      arr[i].previewUrl = src
      store.commit('HOTMAIN', arr)
      break
    }
  }
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].__path.split('@')[0] === 'face') {
      obj[i].set({ visible: true })
    }
  }
  c.renderAll()
  const fd = new FormData()
  fd.append('id', id)
  fd.append('imageType', 'png')
  fd.append('base64Str', src.replace('data:image/png;base64,', ''))
  fd.append('createDetail', JSON.stringify(p))
  let url = 'http://cms.51biaoqing.com/templetImage/make'
  const x = new XMLHttpRequest()
  x.open('POST', url)
  x.onload = (res) => {
    hide()
    c.clear()
    Toast.top('提交成功')
    if (d.index < arr.length - 1) {
      const i = d.index += 1
      if (!arr[d.index].createDetail) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].active) {
            delete arr[i].active
          }
        }
        arr[i].active = 1
        cache.images.__path = 'body@/'
        store.commit('HOTMAIN', [])
        store.commit('HOTMAIN', arr)
        addImg(arr[i].url, true)
        setTimeout(() => {
          addRect()
          const x = document.querySelector('#scrollHot')
          const o = x.querySelector('.cont_active')
          x.scrollLeft = o.offsetLeft - o.offsetWidth
        }, 500)
      }
    }
  }
  x.send(fd)
}

export const changeLevel = (type) => {
  const obj = c.getActiveObject()
  if (!obj) return
  obj[type]()
}

export const clear = () => {
  c.clear()
  addRect()
}

export const changeFamily = (opt) => {
  const obj = c.getActiveObject()
  if (!obj) return
  const text = cache.tmp
  const fill = cache.color
  if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
    if (opt) {
      obj.set({ fill })
      c.renderAll()
    } else if (cache.family.AccessKey) {
      $youzikuClient.getFontFace({
        apikey: 'f1b2b0f7171d6c45e90a0d3b3363519a',
        AccessKey: cache.family.AccessKey,
        Content: cache.tmp
      }, (res) => {
        if (res && res.Code === 200) {
          obj.set({ fontFamily: res.FontFamily, text, fill })
          c.renderAll()
        }
      })
    } else {
      obj.set({ fontFamily: cache.family.FontFamily, text, fill })
      c.renderAll()
    }
  }
}
export const fanzhuan = (t) => {
  const obj = c.getActiveObject()
  if (!obj) return
  const flip = {}
  flip[t] = obj[t] ? 0 : 1
  obj.set(flip)
  c.renderAll()
}
export const copyCanvas = () => {
  c.discardActiveObject()
  const obj = fabric.util.object.clone(c.getObjects())
  cache._canvas = obj
}

document.addEventListener('keydown', (e) => {
  const el = document.activeElement
  const name = el.tagName.toLowerCase()
  const code = e.keyCode
  const obj = c.getActiveObject()
  if (name === 'textarea' || name === 'input') return
  if (!obj) return
  if (code === 38) {
    obj.set({ top: obj.top -= 1 })
  } else if (code === 40) {
    obj.set({ top: obj.top += 1 })
  } else if (code === 37) {
    obj.set({ left: obj.left -= 1 })
  } else if (code === 39) {
    obj.set({ left: obj.left += 1 })
  }
  obj.setCoords()
  c.renderAll()
})

// export const handlerEvent = () => {
//   if (activeObj) {
//     const activeType = activeObj.__path.split('@')[0]
//     if (activeType === 'body') {
//       if (type === 'body') {

//       } else if (type === 'face') {

//       } else if (type === 'paster') {

//       }
//     } else if (activeType === 'face') {

//     } else if (activeType === 'paster') {

//     }
//   } else {
//     if (type === 'body') {

//     } else if (type === 'face') {

//     } else if (type === 'paster') {

//     }
//   }
// }

