import store from '../store'
import { fabric } from 'fabric'
import { cache } from '../api/data'
import { axios, api } from '@api/api'
import { show, hide } from './loading'
import { Alert } from '@common/confirm'
import { _canvas, _control, Controls, Icons } from '../api/canvas'
import { dataURItoBlob, checkPlatform, sizeof, filter, filterSame, textCenter } from './util'
import 'fabric-customise-controls'
import viewImg from './viewImg'
const log = console.log

fabric.Object.prototype.originX = 'left'
fabric.Object.prototype.originY = 'top'

const h = cache.history
let c = ''

// fabric.Object.prototype.objectCaching = false
fabric.Object.prototype.set(_control)
cache.dev = checkPlatform()
cache.postSave = () => {
  const params = { local: 0 }
  const d = c.getObjects()
  for (let i = 0; i < d.length; i++) {
    if (d[i].type === 'image') {
      const s = d[i].__path.split('@')
      if (s[0] === 'local') {
        params.local += 1
      } else {
        params[s[0]] ? params[s[0]] += ',' + s[1] : params[s[0]] = s[1]
      }
    } else if (d[i].type === 'textbox') {
      params['font'] ? params['font'] += ',' + d[i].__path.split('@')[1] : params['font'] = d[i].__path.split('@')[1]
    }
  }
  params.deviceToken = cache.uuid
  if (!params.local) delete params.local
  axios('uploadSave', 'get', params, true)
}

const postData = (opt) => {
  opt.deviceToken = cache.uuid
  axios('postImg', 'get', opt, true)
}

/*
  type 类型
  url 链接
  obj 选中对象
  一个身体对应一句话，一个身体可能存在多个头部
*/
// const replaceFace = (obj, arr, cb) => {
//   const imgs = []
//   let text = ''
//   for (let i = 0; i < arr.length; i++) {
//     const img = new Image()
//     img.setAttribute('crossOrigin', 'anonymous')
//     img.src = arr[i].url
//     img.path = arr[i].__path
//     img.onload = () => {
//       imgs.push(img)
//       if (imgs.length === arr.length) {
//         const params = {
//           crossOrigin: 'anonymous',
//           __path: 'group@',
//           __length: obj.__length,
//           __text: obj.__text || [],
//           __face: obj.__face || []
//         }
//         if (obj.__text) {
//           text = obj.__text
//           delete obj.__text
//         }
//         const items = obj._objects
//         const current = []
//         for (let i = 0; i < items.length; i++) {
//           if (items[i].__path.split('@')[0] === 'face') {
//             current.push(items[i])
//           }
//         }
//         obj._restoreObjectsState()
//         c.remove(obj)
//         const group = new fabric.Group(items, params)
//         c.add(group)
//         if (text[0]) text[0].__parent = group
//         for (let i = 0; i < current.length; i++) {
//           let p = { __path: imgs[i].path }
//           const angle = current[i].angle
//           let d = ''
//           if (angle) {
//             current[i].set({ angle: 0 }).setCoords()
//             d = current[i].getBoundingRect()
//             p.scaleX = d.width / imgs[i].width
//             p.scaleY = d.height / imgs[i].height
//             p.angle = angle
//             current[i].set({ angle }).setCoords()
//           } else {
//             d = current[i].getBoundingRect()
//             p.scaleX = d.width / imgs[i].width
//             p.scaleY = d.height / imgs[i].height
//           }
//           p.left = d.left
//           p.top = d.top
//           current[i].__face = new fabric.Image(imgs[i], p)
//           current[i].__face.__body = group
//           group.__face.push(current[i].__face)
//           c.add(current[i].__face)
//           for (let i = 0; i < group.__face.length; i++) {
//             group.sendBackwards()
//           }
//           d = [group].concat(group.__face)
//           if (text[0]) d = d.concat(text[0])
//           handlerEvent('blur')
//           c.setActiveObject(new fabric.ActiveSelection(d, { canvas: c }))
//           c.requestRenderAll()
//           cb && cb()
//         }
//       }
//     }
//   }
// }

const loadImg = (type, url, obj, cb, __path) => {
  let index = ''
  let text = ''
  const img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  img.src = url
  img.onload = () => {
    let p = { __path: __path || cache.images.__path }
    if (obj) {
      if (type === 'face') {
        if (obj.type === 'group') {
          const params = {
            crossOrigin: 'anonymous',
            __path: 'group@',
            __length: obj.__length,
            __text: obj.__text || [],
            __face: obj.__face || []
          }
          if (obj.__text) {
            text = obj.__text
            delete obj.__text
          }
          const items = obj._objects
          let current = ''
          for (let i = 0; i < items.length; i++) {
            if (items[i].__path.split('@')[0] === 'face' && !items[i].__face) {
              current = items[i]
              break
            }
          }
          if (!current) return
          obj._restoreObjectsState()
          c.remove(obj)
          const angle = current.angle
          let d = ''
          if (angle) {
            current.set({ angle: 0 }).setCoords()
            d = current.getBoundingRect()
            p.scaleX = d.width / img.width
            p.scaleY = d.height / img.height
            p.angle = angle
            current.set({ angle }).setCoords()
          } else {
            d = current.getBoundingRect()
            p.scaleX = d.width / img.width
            p.scaleY = d.height / img.height
          }
          p.left = d.left
          p.top = d.top
          current.__face = new fabric.Image(img, p)
          const group = new fabric.Group(items, params)
          current.__face.__body = group
          group.__face.push(current.__face)
          if (text[0]) text[0].__parent = group
          c.add(group)
          c.add(current.__face)
          for (let i = 0; i < group.__face.length; i++) {
            group.sendBackwards()
          }
          d = [group].concat(group.__face)
          if (text[0]) d = d.concat(text[0])
          handlerEvent('blur')
          c.setActiveObject(new fabric.ActiveSelection(d, { canvas: c }))
          c.requestRenderAll()
          cb && cb(group)
        } else if (obj.type === 'activeSelection') {
          let group = ''
          for (let i = 0; i < obj._objects.length; i++) {
            if (obj._objects[i].__path.split('@')[0] === 'group') {
              group = obj._objects[i]
              if (group.__face.length === 1 && group.__length === 1) {
                loadImg(type, url, group.__face[0])
              } else if (group.__face.length < group.__length) {
                loadImg(type, url, group)
              } else {
                if (group.__index < group.__length - 1) {
                  group.__index += 1
                } else if (!group.__index || group.__index === group.__length - 1){
                  group.__index = 0
                }
                loadImg(type, url, group.__face[group.__index])
              }
              break
            }
          }
        } else if (obj.__path.split('@')[0] === 'face') {
          const _obj = c.getActiveObject()
          const angle = obj.angle
          if (angle) obj.set({ angle: 0 }).setCoords()
          const d = obj.getBoundingRect()
          if (_obj.type === 'activeSelection' || obj.__body) {
            d.w = d.width
            d.h = d.height
          } else {
            const w = d.width < 30 ? 30 : d.width
            d.w = w
            d.h = d.w * img.height / img.width
            d._top = d.height + d.top
          }
          p.scaleX = d.w / img.width
          p.scaleY = d.h / img.height
          if (angle) obj.set({ angle })
          obj.setSrc(url, (v) => {
            if (d._top) {
              v.setCoords()
              p.top = d._top - v.getBoundingRect().height
              v.set({ top: p.top }).setCoords()
            }
            c.renderAll()
          }, p)
        }
      } else if (type === 'paster') {
        const d = obj.getBoundingRect()
        d.height = d.width * img.height / img.width
        p.scaleX = d.width / img.width
        p.scaleY = d.height / img.height
        obj.setSrc(url, (v) => {
          c.renderAll()
        }, p)
      }
    } else {
      if (type === 'face') {
        const d = filter(img.width, img.height, parseInt(cache.base / 2.8))
        p.scaleX = d.w / img.width
        p.scaleY = d.h / img.height
        const t = new fabric.Image(img)
        t.set(p).setCoords()
        t.set({
          top: parseInt(c.height / 3) - t.getBoundingRect().height + 24,
          left: (c.width - t.getBoundingRect().width) / 2
        })
        c.add(t)
        c.setActiveObject(t)
      } else {
        const d = filter(img.width, img.height, cache.base)
        p.scaleX = d.w / img.width
        p.scaleY = d.h / img.height
        const t = new fabric.Image(img)
        t.set(p).setCoords()
        p.top = cache.top - t.getBoundingRect().height
        p.left = (c.width - t.getBoundingRect().width) / 2
        /*
          判断不要出画布，暂未实现
        */
        t.set({ top: p.top, left: p.left }).setCoords()
        c.add(t)
        c.setActiveObject(t)
      }
    }
  }
}

/*
  r 定位数据
  url 脸部地址
  cb 回调
*/
export const addGroup = (r, url, cb) => {
  if (typeof r.createDetail === 'string') r.createDetail = JSON.parse(r.createDetail)
  handlerEvent('blur')
  const group = []
  if (r.createDetail.body && r.createDetail.body[0]) {
    const bodyImg = new Image()
    bodyImg.setAttribute('crossOrigin', 'anonymous')
    bodyImg.src = r.url
    bodyImg.onload = () => {
      const body = new fabric.Image(bodyImg, r.createDetail.body[0])
      group.push(body)
      if (r.createDetail.face && r.createDetail.face.length) {
        for (let j = 0; j < r.createDetail.face.length; j++) {
          const faceImg = new Image()
          faceImg.setAttribute('crossOrigin', 'anonymous')
          faceImg.name = JSON.stringify(r.createDetail.face[j])
          if (location.protocol === 'https:') {
            faceImg.src = cache.https + '/make/face_location.png'
          } else if (location.hostname === 'make.51biaoqing.com') {
            faceImg.src = cache.http + '/make/face_location.png'
          } else {
            faceImg.src = cache.test + '/make/face_location.png'
          }
          faceImg.onload = () => {
            let success = 0
            const face = new fabric.Image(faceImg, JSON.parse(faceImg.name))
            face.__index = 0
            group.push(face)
            for (let i = 0; i < group.length; i++) {
              if (group[i].__index === 0) {
                success += 1
              }
            }
            if (success === r.createDetail.face.length) {
              const g = new fabric.Group(group, {
                __text: [],
                __face: [],
                __paster: [],
                __length: r.createDetail.face.length,
                __path: 'group@'
              })
              let d = g.getBoundingRect()
              const f = filter(d.width, d.height, cache.base)
              g.set({ scaleX: f.w / g.width, scaleY: f.h / g.height }).setCoords()
              d = g.getBoundingRect()
              g.set({ top: cache.top - d.height, left: (c.width - d.width) / 2 })
              c.add(g)
              if (r.createDetail.text) {
                for (let i = 0; i < r.createDetail.text.length; i++) {
                  if (i === r.createDetail.text.length - 1) {
                    addText(r.createDetail.text[i], 1, g, () => {
                      const group = [g]
                      for (let i = 0; i < g.__text.length; i++) {
                        group.push(g.__text[i])
                      }
                      c.setActiveObject(new fabric.ActiveSelection(group, { canvas: c }))
                      c.requestRenderAll()
                      cb && cb()
                    })
                  } else {
                    addText(r.createDetail.text[i], 1, g)
                  }
                }
              } else {
                cb && cb()
                c.setActiveObject(g)
              }
              if (url) {
                if (typeof url === 'string') {
                  loadImg('face', url, g, cb)
                } else {
                  // e_e!!! group 里面的对象
                  // loadImg('face', url[0].url, g, (G) => {
                  //   url = url.slice(1)
                  //   if (url.length) {
                  //     loadImg('face', url[0].url, G, (gg) => {
                  //       url = url.slice(1)
                  //       if (url.length) {
                  //         loadImg('face', url[0].url, G, '', url[0].__path)
                  //       }
                  //     }, url[0].__path)
                  //   }
                  // }, url[0].__path)
                  // replaceFace(g, url, cb)

                  const load = function (arr, g) {
                    const face = arr.shift()
                    if (face) {
                      loadImg('face', face.url, g, (G) => {
                        load(arr, G)
                      }, face.__path)
                    }
                  }
                  load(url, g)
                }
              }
            }
          }
        }
      }
    }
  }
}

/*
  opt 图片对象 createDetail区分是否代表标识头部的数据
*/
export const addImg = (opt) => {
  const url = opt.url
  const obj = c.getActiveObject()
  let path = cache.images.__path
  log(path)
  const s = path.split('@')
  postData({ type: s[0], path: s[1] })
  const p = { url, path }
  if (opt.createDetail) p.createDetail = opt.createDetail
  filterSame(p)
  path = path.split('@')[0]
  if (obj) {
    let t = ''
    if (obj.__path) {
      t = obj.__path.split('@')[0]
    } else {
      t = obj.type
    }
    if (opt.createDetail) {
      if (t === 'face') {
        cache.images.__path = obj.__path
        addGroup(opt, obj._element.src, () => {
          c.remove(obj)
        })
      } else if (t === 'group') {
        addGroup(opt, '', () => {
          c.remove(obj)
        })
      } else if (t === 'activeSelection') {
        let face = ''
        for (let i = 0; i < obj._objects.length; i++) {
          let type = obj._objects[i].__path.split('@')[0]
          if (type === 'group') {
            face = obj._objects[i].__face
            break
          }
        }
        if (face.length) {
          const arr = []
          for (let j = 0; j < face.length; j++) {
            const t = face[j].__path.split('@')[0]
            if (t === 'face') {
              arr.push({
                url: face[j]._element.src,
                __path: face[j].__path
              })
            }
          }
          for (let i = 0; i < obj._objects.length; i++) {
            c.remove(obj._objects[i])
          }
          addGroup(opt, arr)
        } else {
          addGroup(opt, '', () => {
            for (let i = 0; i < obj._objects.length; i++) {
              c.remove(obj._objects[i])
            }
          })
        }
      } else if (t === 'text') {
        addGroup(opt)
      } else if (t === 'body'){
        c.remove(obj)
        addGroup(opt)
      }
    } else {
      // 添加单图没有替换
      if (t === 'activeSelection' && path === 'face' || t === 'body' && path === 'body' || t === 'face' && path === 'face' || t === 'paster' && path === 'paster' || t === 'group' && path === 'face') {
        loadImg(path, url, obj)
      } else {
        log(t, path)
        if (t === 'group' && path === 'body') {
          c.remove(obj)
        } else if (t === 'activeSelection' && path === 'body') {
          for (let i = 0; i < obj._objects.length; i++) {
            c.remove(obj._objects[i])
          }
          handlerEvent('blur')
        }
        loadImg(path, url)
      }
      stateUser(obj.__path && obj.__path.split('@')[0])
    }
  } else {
    if (opt.createDetail) {
      addGroup(opt)
    } else {
      loadImg(path, url)
    }
  }
}

/*
  处理加号逻辑
*/
export const stateUser = (type) => {
  if (!c) return
  if (!type) {
    const tar = c.getActiveObject()
    if (tar && tar.type === 'activeSelection') {
      type = 'group'
    } else {
      type = tar ? tar.__path.split('@')[0] : ''
    }
  }
  const menu = store.state.navActive.type
  const parent = document.querySelector('#hotList')

  if (!parent) return
  if (menu === 'body' && type === 'group' || type === 'body') {
    parent.classList.add('show')
  } else if (menu === 'head' && type === 'group' || type === 'face') {
    parent.classList.add('show')
  } else if (menu === 'sticker' && type === 'paster') {
    parent.classList.add('show')
  } else {
    parent.classList.remove('show')
  }
}

export const setCanvas = (id, cb) => {
  if (!document.querySelector('#_canvas').getContext) {
    Alert({ title: '您的手机系统版本过低', text: '请升级Android6.0以上版本' })
    return
  }
  const par = document.querySelector(id)
  const width = par.offsetWidth
  const height = par.offsetHeight
  const bar = 50
  cache.rect = {}
  cache.rect.width = width - bar
  cache.rect.height = height - bar - 55
  cache.rect.top = bar
  cache.rect.left = bar / 2
  const d = par.querySelector('.canvas_rect')
  d.style.width = cache.rect.width + 'px'
  d.style.height = cache.rect.height + 'px'
  d.style.left = cache.rect.left + 'px'
  d.style.top = cache.rect.top + 'px'

  // par.insertAdjacentHTML('beforeend', '<canvas id="_canvas"></canvas>')
  cache.canvas = Object.assign(_canvas, { width, height })
  window.cs = c = new fabric.Canvas('_canvas', cache.canvas)
  fabric.Canvas.prototype.customiseControls(Controls)
  fabric.Object.prototype.customiseCornerIcons(Icons, () => { c.renderAll()})

  if (cache._canvas) {
    for (const key in cache._canvas) c.add(cache._canvas[key])
    const s = document.querySelector('#save_canvas')
    if (s) s.classList.add('save')
  }
  c.renderAll()
  if (cache.createDetail) {
    addImg(cache.createDetail)
    delete cache.createDetail
  } else if (cache.images && cache.images.url) {
    if (cache.activeObj) {
      c.setActiveObject(cache.activeObj)
      delete cache.activeObj
    }
    addImg({ url: cache.images.url })
    delete cache.images.url
  }

  cb && cb(cache)

  // app
  // h.lock = false
  if (!cache.base) {
    let top = cache.rect.height / 3 * 2
    if (top >= cache.rect.width) top = cache.rect.width - 12
    cache.base = top
  }
  if (!cache.top) cache.top = c.height - parseInt(c.height / 3)
  c.on({
    'object:moving': () => { cache.time = '' },
    'selection:cleared': (e) => {
      clearTimeout(cache.stateTime)
      cache.stateTime = setTimeout(() => {
        stateUser()
      }, 500)
    },
    'object:selected': (e) => {
      const t = e.target
      const obj = c.getObjects()
      store.commit('SELECTED', { name: 'flip', status: 1 })
      if (obj.length >= 2) {
        store.commit('SELECTED', { name: 'levels', status: 1 })
      }
      if (t.type === 'textbox' && t.fontFamily !== cache.family.FontFamily) {
        cache.tmp = t.text
        addText()
      }
      setTimeout(() => {
        if (!c.getActiveObject()) {
          store.commit('SELECTED', { name: 'levels', status: 0 })
          store.commit('SELECTED', { name: 'flip', status: 0 })
        }
      }, 100)
      if (t && t.type === 'group' && t.__face.length) targetSelection(t)
      if (t && t.__text && t.__text.length) targetSelection(t)
      stateUser(obj.__path && t.__path.split('@')[0])
      clearTimeout(cache.stateTime)
    },
    'object:added': (e) => {
        if (e.target && e.target.type !== 'textbox') {
          if (!cache.isRedoing) h.state = []
          cache.isRedoing = 0
          update()
        }
        // setTimeout(() => {
        //   addHistory()
        // }, 100)
      const obj = c.getObjects()
      const s = document.querySelector('#save_canvas')
      if (s) s.classList.add('save')
      if (obj.length >= 2) {
        store.commit('SELECTED', { name: 'levels', status: 1 })
      }
      if (e.target.type === 'textbox') {
        e.target['bringForward']()
      } else {
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].type === 'textbox') obj[i]['bringForward']()
        }
      }
    },
    'object:removed': (e) => {
      // 如果只有一个text 就保留下来 暂时未实现
      const tar = e.target
      if (tar.__text && tar.__text.length) {
        for (let i = 0; i < tar.__text.length; i++) {
          c.remove(tar.__text[i])
        }
      } else if (tar.__parent && tar.type === 'textbox') {
        const d = tar.__parent.__text
        if (d && d.length) {
          for (let i = 0; i < d.length; i++) {
            if (d[i] === tar) {
              d.splice(i, 1)
            }
          }
        }
      }
      if (tar.__body) {
        const i = tar.__body.__face.indexOf(tar)
        if (i >= 0) {
          const face = tar.__body.__face.splice(i, 1)
          const objs =  tar.__body._objects
          for (let j = 0; j < objs.length; j++) {
            if (objs[j].__face === face[0]) {
              delete objs[j].__face
            }
          }
        }
      }
      cache.time = ''
      h.state.push(e.target)
      update()
      // store.commit('SELECTED', false) // 它的执行在 object:selected 之前
      // addHistory()
      store.commit('SELECTED', { name: 'levels', status: 0 })
      store.commit('SELECTED', { name: 'flip', status: 0 })
      if (c.getObjects().length === 0) document.querySelector('#save_canvas').classList.remove('save')
    },
    // 'object:modified': () => {
      // addHistory()
    // },
    'mouse:down': (e) => {
      const t = e.target
      if (t && t.type === 'group' && t.__face.length) targetSelection(t)
      if (t && t.__text && t.__text.length) targetSelection(t)
      if (!t) {
        store.commit('SELECTED', {
          name: 'levels',
          status: 0
        })
        store.commit('SELECTED', {
          name: 'flip',
          status: 0
        })
      }
      if (!t || t.type !== 'textbox') return
      if (cache.time === 0) return cache.time = new Date().getTime()
      clearTimeout(cache.timer)
      cache.timer = setTimeout(() => {
        cache.time = 0
      }, 500)
      if (new Date().getTime() - cache.time < 500) {
        setTimeout(() => {
          cache.router.push({ name: 'search' })
        }, 100)
        const input = document.querySelector('#searchInput')
        if (!input.value.replace(/\s/g, '') && cache.tmp !== '双击修改') input.value = cache.tmp
      }
      cache.time = 0
    }
  })
  update()
  // updateStatus()
}

/*
  文字处理
  opt 自定义参数
  status 是否选中
  group 是否需要挂到组上
  cd 回调
*/
export const addText = (opt = {}, status, group, cb) => {
  if (opt.text) cache.tmp = opt.text
  let obj = ''
  if (opt.obj) {
    obj = opt.obj
    delete opt.obj
  } else {
    obj = c.getActiveObject()
  }
  const conf = Object.assign({
    text: cache.tmp,
    fill: cache.color,
    __path: 'text@/' + cache.family.FontFamily + '/' + cache.color + '/' + cache.tmp,
    fontFamily: cache.family.FontFamily || 'PingFang SC'
  }, opt)
  if (conf.width) delete conf.width
  if (conf.height) delete conf.height
  if (obj && obj.type === 'activeSelection') {
    let visibity = 0
    for (let i = 0; i < obj._objects.length; i++) {
      if (obj._objects[i].type === 'textbox') {
        visibity = 1
        addText({ obj: obj._objects[i] })
      }
    }
    if (!visibity) {
      handlerEvent('blur')
      addText(opt)
    }
  } else if (obj && obj.type === 'textbox') {
    postData({ type: 'font', path: conf.__path.split('@')[1] })
    delete obj.width
    delete obj.height
    if (cache.family.AccessKey) {
      cache.getFont((fontFamily) => {
        obj.set(Object.assign(conf, { fontFamily }))
        c.renderAll()
        cb && cb()
      })
    } else {
      obj.set(conf)
      c.renderAll()
      cb && cb()
    }
  } else {
    if (typeof opt === 'string') return
    cache.firstText = 1
    const params = {
      fontSize: 26,
      padding: 6,
      textAlign: 'center',
      editable: false
    }
    const obj = new fabric.Textbox(cache.tmp, Object.assign(conf, params))
    if (group) {
      group.__text.push(obj)
      obj.__parent = group
    }
    obj.set(textCenter(c, cache.top, obj))
    if (cache.family.AccessKey) {
      cache.getFont((fontFamily) => {
        obj.set({ fontFamily })
        c.add(obj)
        if (!status) c.setActiveObject(obj)
        c.renderAll()
        cb && cb()
      })
    } else {
      c.add(obj)
      if (!status) {
        c.setActiveObject(obj)
      }
      c.renderAll()
      cb && cb()
    }
  }
}
export const save = (e) => {
  e.preventDefault()
  const obj = c.getObjects()
  if (obj.length === 0) return
  handlerEvent('blur')
  cache.postSave()
  const d = obj[0].getBoundingRect()
  const p = {
    left: d.left,
    top: d.top,
    left_max: d.left,
    top_max: d.top
  }
  for (let i = 0; i < obj.length; i++) {
    const o = obj[i].getBoundingRect()
    if (!p._top) p._top = parseInt(o.height + o.top)
    if (p.top > o.top) p.top = parseInt(o.top)
    if (o.top + o.height > p._top) p._top = parseInt(o.top + o.height)

    if (!p._left) p._left = parseInt(o.width + o.left)
    if (o.left < p.left) p.left = parseInt(o.left)
    if (o.left + o.width > p._left) p._left = parseInt(o.width + o.left)
  }
  p.width = parseInt(p._left - p.left)
  p.height = parseInt(p._top - p.top)
  c.set({ 'backgroundColor': '#fff' })
  const src = c.toDataURL({
    format: "image/png",
    multiplier: 2,
    left: p.left,
    top: p.top,
    width: p.width,
    height: p.height
  })
  c.set({ 'backgroundColor': '' }).renderAll()
  // document.title = sizeof(src, 'utf-8')
  // viewImg({ src, text: '长按图片保存' })
  // if (true) return
  // const u = 'https://image.baidu.com/search/detail?ct=503316480&z=&tn=baiduimagedetail&ipn=d&word=%E5%9B%BE%E7%89%87&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=-1&cs=3588772980,2454248748&os=1031665791,326346256&simid=0,0&pn=1&rn=1&di=97987891320&ln=1982&fr=&fmq=1520915597475_R&ic=0&s=undefined&se=&sme=&tab=0&width=&height=&face=undefined&is=0,0&istype=2&ist=&jit=&bdtype=0&spn=0&pi=0&gsm=0&objurl=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F0142135541fe180000019ae9b8cf86.jpg%401280w_1l_2o_100sh.png&rpstart=0&rpnum=0&adpicid=0'
  if (window.__wxjs_environment === 'miniprogram') {
    viewImg({ src, text: '长按图片保存' })
  } else if (cache.dev === 'IOS' && window.webkit && window.webkit.messageHandlers) {
    show()
    store.dispatch('uploadImg', {
      src,
      type: 'png',
      callback: (res) => {
        hide()
        if (res.status) {
          window.webkit.messageHandlers.jsHandler.postMessage({
            cmd: 'save',
            param: { imageUrl: res.data }
          })
        } else {
          Toast.top(res.msg)
        }
      }
    })
  } else if (cache.dev === 'Android' && window.jsHandler) {
    show()
    store.dispatch('uploadImg', {
      src,
      type: 'png',
      callback: (res) => {
        hide()
        if (res.status) {
          window.jsHandler.postMessage('{ cmd: "save", src: "' + res.data + '"}')
        } else {
          Toast.top(res.msg)
        }
      }
    })
  } else if (window.__wxjs_environment === 'browser') {
    viewImg({ src, text: '长按图片保存或右键另存' })
  } else {
    viewImg({ src, text: '长按图片保存' })
  }
}

/* 微信小程序 */
const update = () => {
  const p = document.querySelector('#previous')
  const n = document.querySelector('#next')
  if (c._objects.length) {
    p.classList.add('active')
  } else {
    p.classList.remove('active')
  }
  if (h.state.length) {
    n.classList.add('active')
  } else {
    n.classList.remove('active')
  }
}
// app 和 小程序 公用
export const undo = () => {
  handlerEvent('blur')
  if (c._objects.length > 0) {
    const d = c._objects.pop()
    if (d.type !== 'textbox') {
      h.state.push(d)
    }
    c.renderAll()
    update()
  }
  // if (h.mods < h.state.length - 1) {
  //   loadState(h.state[h.state.length - h.mods - 2])
  //   h.mods += 1
  //   updateStatus()
  // }
}

export const redo = () => {
  handlerEvent('blur')
  if (h.state.length > 0) {
    cache.isRedoing = true
    c.add(h.state.pop())
    update()
  }
  // if (h.mods > 0) {
  //   loadState(h.state[h.state.length - h.mods])
  //   h.mods -= 1
  //   updateStatus()
  // }
}

/* app */
// const addHistory = () => {
//   if (!h.lock) {
//     // const d = c.toJSON()
//     const d = JSON.stringify(c)
//     if (h.mods > 0) {
//       h.state = h.state.slice(0, h.state.length - h.mods)
//       h.mods = 0
//     }
//     h.state.push(d)
//     updateStatus()
//   }
// }
// const loadState = (state) => {
//   c.includeDefaultValues = false
//   h.lock = true
//   c.clear().renderAll()
//   c.loadFromJSON(state, () => {
//     c.renderAll()
//     // 重新设置状态
//     setTimeout(() => {
//       h.lock = false
//     }, 200)
//     const d = c.getObjects()
//     for (let i = 0; i < d.length; i++) {
//       if (d[i].type === 'i-text') {
//         d[i].set({ editable: false }).setCoords()
//       }
//     }
//   })
// }
// const updateStatus = () => {
//   const p = document.querySelector('#previous')
//   const n = document.querySelector('#next')
//   if (p) {
//     if (h.mods < h.state.length - 1) {
//       p.classList.add('active')
//     } else {
//       p.classList.remove('active')
//     }
//   }
//   if (n) {
//     if (h.state.length > 1 && h.mods > 0) {
//       n.classList.add('active')
//     } else {
//       n.classList.remove('active')
//     }
//   }
// }

/*
  type 事件类型
  name 参数名称
*/
export const handlerEvent = (type, name) => {
  const obj = c.getActiveObject()
  if (type === 'back') {
    if (cache.dev === 'Android') {
      window.jsHandler.postMessage('{ cmd: "goBack" }')
    } else if (cache.dev === 'IOS') {
      window.webkit.messageHandlers.jsHandler.postMessage({ cmd: 'goBack' })
    }
  } else if (type === 'blur') {
    c.discardActiveObject()
    if (c.requestRenderAll) {
      c.requestRenderAll()
    } else if (c.requestAll) {
      c.requestAll()
    }
  } else if (type === 'changeLevel') {
    if (!obj) return
    obj[name]()
  } else if (type === 'fanzhuan') {
    if (!obj) return
    const flip = {}
    flip[name] = obj[name] ? 0 : 1
    obj.set(flip)
    c.renderAll()
  } else if (type === 'copy') {
    cache.activeObj = c.getActiveObject()
    c.discardActiveObject()
    const obj = fabric.util.object.clone(c.getObjects())
    cache._canvas = obj
    name && name()
  }
}

export const addLocalImg = (data, type) => {
  if (!data) return
  if (store.state.navActive.type === 'head') {
    show()
    store.dispatch('uploadImg', {
      type,
      src: data,
      callback: (res) => {
        if (res.status) {
          const fd = new FormData()
          if (location.protocol === 'https:') {
            res.data = res.data.replace(cache.http, cache.https)
          } else if (location.hostname === 'maketest.51biaoqing.com') {
            res.data = res.data.replace(cache.http, cache.test)
          }
          const src = res.data
          fd.append('url', src)
          fd.append('deviceToken', cache.uuid)
          const url = api('postFace')
          const x = new XMLHttpRequest()
          x.open('POST', url)
          x.onreadystatechange = () => {
            if (x.readyState === 4) {
              if (x.status === 200) {
                const d = JSON.parse(x.responseText)
                if (d.status) {
                  cache.images.__path = 'face@/' + d.data.url
                  addImg({ url: d.data.url })
                } else {
                  Toast.top('未识别出人物脸部,请重新上传！')
                  cache.images.__path = 'local@'
                  addImg({ url: src })
                }
              }
              hide()
            }
          }
          x.send(fd)
        } else {
          hide()
          Toast.top('上传失败')
        }
      }
    })
  } else {
    const _img = new Image()
    _img.src = data
    _img.onload = () => {
      const d = filter(_img.width, _img.height, cache.base)
      const img = new fabric.Image(_img)
      const params = {
        __path: 'local@',
        scaleX: d.w / _img.width,
        scaleY: d.h / _img.height
      }
      img.set(params).setCoords()
      img.set({ left: (c.width - img.getBoundingRect().width) / 2, top: cache.top - img.getBoundingRect().height })
      c.add(img)
      c.setActiveObject(img)
    }
  }
}

/* 框选头部 */
const targetSelection = (t) => {
  handlerEvent('blur')
  const group = [t]
  for (let i = 0; i < t.__face.length; i++) {
    group.push(t.__face[i])
  }
  if (t.__text && t.__text.length) {
    for (let i = 0; i < t.__text.length; i++) {
      group.push(t.__text[i])
    }
  }
  c.setActiveObject(new fabric.ActiveSelection(group, { canvas: c }))
  c.requestRenderAll()
}