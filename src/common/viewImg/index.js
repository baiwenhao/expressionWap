require('./style.css')

const PreView = (opt) => {
  const html = '' +
  '<div id="preview" class="preview">' +
  ' <b class="close iconfont icon-tianjia"></b>' +
  ' <div class="preview_box">' +
  '   <div id="preview_img" class="preview_img">' +
  '     <img src="' + opt.src + '" />' +
  '   </div>' +
  '   <div class="preview_mb">' +
  '     <div class="preview_btn">' + opt.text + '</div>' +
  '   </div>' +
  ' </div>' +
  '</div>'

  const p = document.querySelector('#preview')
  if (p) {
    p.querySelector('img').src = opt.src
    p.classList.add('active')
  } else {
    document.body.insertAdjacentHTML('beforeend', html)
    const close = document.querySelector('#preview .close')
    close.addEventListener('click', (e) => {
      close.parentNode.classList.remove('active')
      opt.load && opt.load(close.parentNode)
    })
  }
  setTimeout(() => {
    const preview = document.querySelector('#preview')
    preview.classList.add('active')
  }, 200)

  if (opt.load) {
    const btn = document.querySelector('#preview .preview_btn')
    const close = document.querySelector('#preview .close')
    btn.onclick = () => {
      opt.load(close.parentNode)
    }
  }
}

export default PreView