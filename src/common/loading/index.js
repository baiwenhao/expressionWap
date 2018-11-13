require('./style.css')
const src = require('./loading.gif')
const img = new Image()
img.src = src

const index = {
  show () {
    if (!this.loading) document.body.appendChild(this.createMask())
    this.loading.classList.add('active')
  },
  hide () {
    this.loading && this.loading.classList.remove('active')
  },
  createMask () {
    this.loading = document.createElement('div')
    this.loading.id = 'soqu_app'
    this.loading.appendChild(img)
    return this.loading
  }
}

export const show = () => {
  index.show()
}

export const hide = () => {
  index.hide()
}
