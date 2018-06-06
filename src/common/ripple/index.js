require('./style.css')
const ripple = function (e) {
  const tar = e.target
  const ripple = document.querySelector('#ripple')
  ripple && ripple.parentNode.removeChild(ripple)
  let w = tar.offsetWidth
  let h = tar.offsetHeight
  w >= h ? h = w : w = h
  const left = e.clientX - getOffset(tar, 'offsetLeft') - w / 2
  const top = e.clientY - getOffset(tar, 'offsetTop') - h / 2
  const r = '<div style="width:' + w + 'px;height:' + h + 'px;left:' + left + 'px;top:' + top + 'px" id="ripple" class="ripple"></div>'
  tar.insertAdjacentHTML('afterbegin', r) // afterbegin
  tar.querySelector('#ripple').classList.add('ripple_active') // 为什么不用docuemnt，知道了把
}

const getOffset = (el, type) => {
  let off = el[type]
  let par = el.offsetParent
  while (par) {
    off += par[type]
    par = par.offsetParent
  }
  return off
}

export default ripple