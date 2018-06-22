export const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}

export const checkPlatform = () => {
  let t
  return navigator.userAgent.indexOf("Win") !== -1 && (t = "Windows"),
    navigator.userAgent.indexOf("Mac") !== -1 && (t = "Macintosh"),
    navigator.userAgent.indexOf("Linux") !== -1 && (t = "Linux"),
    navigator.userAgent.indexOf("Android") !== -1 && (t = "Android"),
    navigator.userAgent.indexOf("like Mac") !== -1 && (t = "IOS"),
    t
}

export const setData = (name, obj) => {
  if (typeof obj !== 'string' && typeof obj !== 'object') return
  if (typeof obj === 'object') obj = JSON.stringify(obj)
  window.localStorage.setItem(name, obj)
  return obj
}

export const delay = (() => {
  let timer = null
  return (cb, time = 300) => {
    clearTimeout(timer)
    timer = setTimeout(cb, time)
  }
})()

export const getData = (name) => {
  const obj = window.localStorage.getItem(name)
  if (obj) return (obj.charAt(0) === '{' || obj.charAt(0) === '[') ? JSON.parse(obj) : obj
}

export const getCode = (data, t) => {
  const len = data.length
  for (let i = 0; i < len; i++) {
    if (data[i].type === t) {
      return data[i].code
    }
  }
}

export const fileReader = (file, opt) => {
  const fr = new FileReader()

  if (opt.onabort) {
    fr.onabort = (e) => {
      opt.onabort(e)
    }
  }

  if (opt.onerror) {
    fr.onerror = (e) => {
      opt.onerror(e)
    }
  }

  if (opt.onload) {
    fr.onload = (e) => {
      opt.onload(e.target.result)
    }
  }

  if (opt.onloadend) {
    fr.onloadend = (e) => {
      opt.onloadend(e)
    }
  }

  if (opt.onloadstart) {
    fr.onloadstart = (e) => {
      opt.onloadstart(e)
    }
  }

  if (opt.onprogress) {
    fr.onprogress = (e) => {
      opt.onprogress(e)
    }
  }
  if (opt.readAsDataURL) {
    fr.readAsDataURL(file)
  }
  if (opt.readAsArrayBuffer) {
    fr.readAsArrayBuffer(file)
  }
  return fr
}

export const loadingImg = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = (e) => {
      resolve(img)
    }
    img.onerror = (e) => {
      reject(e)
    }
    img.src = src
  })
}

/*
const saveFile = (type, canvas, name) => {
  type = type || 'jpeg'
  if (typeof canvas === 'string') {
    canvas = document.querySelector(canvas)
  }
  var imgData = canvas.toDataURL(type)
  var _fixType = (type) => {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg')
    var r = type.match(/png|jpeg|bmp|gif/)[0]
    return 'image/' + r
  }
  imgData = imgData.replace(_fixType(type),'image/octet-stream')
  var sf = (data, filename) => {
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
    console.log(save_link)
    save_link.href = data;
    save_link.download = filename;

    var event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    save_link.dispatchEvent(event)
  }
  // var filename = 'baidufe_' + (new Date()).getTime() + '.' + type
  sf(imgData, name)
  // saveFile('jpeg', '#canvas', '哈哈')
}
*/

// const hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null
// const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
// const onVisibilityChange = function(){
//   if (!document[hiddenProperty]) {
//     console.log('页面非激活')
//   } else {
//     console.log('页面激活')
//   }
// }
// document.addEventListener(visibilityChangeEvent, onVisibilityChange)

// export const getByteLen = (val) => {
//   let len = 0
//   for (let i = 0; i < val.length; i++) {
//     const a = val.charAt(i)
//     if (a.match(/[^\x00-\xff]/ig) != null) {
//       len += 2
//     } else{
//       len += 1
//     }
//   }
//   return len
// }

export const sizeof = function(str, charset) {
  let total = 0,
    charCode,
    i,
    len
  charset = charset ? charset.toLowerCase() : ''
  if (charset === 'utf-16' || charset === 'utf16') {
    for (i = 0, len = str.length; i < len; i++) {
      charCode = str.charCodeAt(i)
      if (charCode <= 0xffff) {
        total += 2
      } else {
        total += 4
      }
    }
  } else {
    for (i = 0, len = str.length; i < len; i++) {
      charCode = str.charCodeAt(i)
      if (charCode <= 0x007f) {
        total += 1
      } else if (charCode <= 0x07ff) {
        total += 2
      } else if (charCode <= 0xffff) {
        total += 3
      } else {
        total += 4
      }
    }
  }
  return total
}

export const lock = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

/* group 只能替换遍布 */
export const filterSame = (opt) => {
  const recent = getData('RecentImg')
  if (recent) {
    const arr = []
    for (let i = 0; i < recent.length; i++) {
      if (recent[i].url !== opt.url) {
        arr.push(recent[i])
      }
    }
    arr.unshift(opt)
    setData('RecentImg', arr)
  } else {
    setData('RecentImg', [opt])
  }
}

export const filter = (w, h, _w) => {
  const p = {}
  if (w > _w && h > _w) {
    if (w > h) {
      p.w = _w
      p.h = Math.ceil(_w * h / w)
    } else {
      p.h = _w
      p.w = Math.ceil(_w * w / h)
    }
  } else if (w > _w) {
    p.w = _w
    p.h = Math.ceil(_w * h / w)
  } else if (h > _w) {
    p.h = _w
    p.w = Math.ceil(_w * w / h)
  } else if (w > h) {
    p.w = _w
    p.h = Math.ceil(_w * h / w)
  } else {
    p.h = _w
    p.w = Math.ceil(_w * w / h)
  }
  return p
}

export const textCenter = (c, t, o) => {
  return { left: (c.width - o.getBoundingRect().width) / 2 + 6, top: t + 6 }
}

export const demo = (canvas) => {
  // ADD YOUR CODE HEREvar canvas = new fabric.Canvas('canvas');
  canvas.setWidth(300);
  canvas.setHeight(300);

  // Double-click event handler
  var fabricDblClick = function(obj, handler) {
    return function() {
      if (obj.clicked) handler(obj);
      else {
        obj.clicked = true;
        setTimeout(function() {
          obj.clicked = false;
        }, 500);
      }
    };
  };

  // ungroup objects in group
  var groupItems = []
  var ungroup = function (group) {
      groupItems = group._objects;
      group._restoreObjectsState();
      canvas.remove(group);
      for (var i = 0; i < groupItems.length; i++) {
          groupItems[i].dirty = true;
          canvas.add(groupItems[i]);
      }
      // if you have disabled render on addition
      canvas.renderAll();
  };

  // Re-group when text editing finishes
  var dimensionText = new fabric.IText("Dimension Text", {
      fontFamily: 'Comic Sans',
      fontSize: 14,
      stroke: '#000',
      strokeWidth: 1,
      fill: "#000",
      left: 170,
      top: 60
  });
  dimensionText.on('editing:exited', function () {
      var items = [];
      groupItems.forEach(function (obj) {
          items.push(obj);
          canvas.remove(obj);
      });
      var grp = new fabric.Group(items.reverse(), {});
      canvas.add(grp);
      grp.on('mousedown', fabricDblClick(grp, function (obj) {
          ungroup(grp);
          canvas.setActiveObject(dimensionText);
          dimensionText.enterEditing();
          dimensionText.selectAll();
      }));
  });
  function addRuler() {
    var dimension_mark = new fabric.Path('M0,0L0,-5L0,5L0,0L150,0L150,-5L150,5L150,0z');
    dimension_mark.set({
      left: 150,
      top: 70,
      stroke: '#333333',
      strokeWidth: 2,
      scaleY: 1
    });
    var dimension_group = new fabric.Group([dimension_mark, dimensionText], {
      left: 50,
      top: 50
    });
    canvas.add(dimension_group);
    dimension_group.on('mousedown', fabricDblClick(dimension_group, function(obj) {
      ungroup(dimension_group)
      canvas.setActiveObject(dimensionText)
      dimensionText.enterEditing()
      dimensionText.selectAll()
    }))
  }
  addRuler()
}

export const tabText = (type) => {
  const btn = document.querySelector('#upload_text')
  if (type) {
    btn.parentNode.style.display = 'block'
    btn.innerHTML = `上传${type}`
  } else {
    btn.parentNode.style.display = 'none'
  }
}

export const compressImg = (file, cb) => {
  const name = file.name
  fileReader(file, {
    readAsDataURL: true,
    onload (src) {
      const img = new Image()
      img.src = src
      img.onload = () => {
        const w = img.width
        const h = img.height
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, w, h)
        ctx.drawImage(img, 0, 0, w, h)
        const base64 = canvas.toDataURL('image/jpeg', 0.5)
        // const d1 = (src.length / 1024).toFixed(2) + 'kb'
        // const d2 = (base64.length / 1024).toFixed(2) + 'kb'
        // document.title = d1 + '===' + d2
        cb(base64)
        // const d = window.atob(base64.split(',')[1])
        // const bytes = window.atob(base64.split(',')[1]);
        // const ab = new ArrayBuffer(bytes.length)
        // const ia = new Uint8Array(ab)
        // for (let i = 0; i < bytes.length; i++) {
        //   ia[i] = bytes.charCodeAt(i)
        // }
        // file = new Blob( [ab] , {type : 'image/jpeg'})
        // file.name = name
      }
    }
  })
}

// polyfill
if (typeof Object.assign === 'undefined') {
  Object.assign = function (target) {
    if (target === undefined || target === null) {
     throw new TypeError('Cannot convert undefined or null to object')
    }
    var output = Object(target)
    for (var index = 1; index < arguments.length; index++) {
     var source = arguments[index]
     if (source !== undefined && source !== null) {
       for (var nextKey in source) {
         if (source.hasOwnProperty(nextKey)) {
           output[nextKey] = source[nextKey]
         }
       }
     }
    }
    return output
  }
}
