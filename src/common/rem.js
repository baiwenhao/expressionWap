const FastClick = require('fastclick')

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body)
  }, false)
}

const max = 640
const db = document.body
const dc = document.children[0]
const fn = () => {
  const w = window.innerWidth
  if (w < max) {
    dc.style.fontSize = w / 3.2 + 'px'
    db.classList.remove('vue-box')
  } else {
    dc.style.fontSize = max / 3.2 + 'px'
    db.classList.add('vue-box')
  }
}
window.addEventListener('resize', fn)
fn()