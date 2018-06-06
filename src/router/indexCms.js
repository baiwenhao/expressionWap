import Router from 'vue-router'
import { cache, menu } from '@api/data'
import { getData, setData } from '@common/util'
import store from '../store/index_cms'
import Make from '@pages/MakeCms'
import Hot from '@components/HotCms'
import Expression from '@pages/ExpressionCms'
// 保存
// https://stackoverflow.com/questions/24395076/canvas-generated-by-canvg-is-blurry-on-retina-screen
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'make',
      component: Make,
      beforeEnter: (to, from, next) => {
        next()
      },
      children: [
        {
          path: '',
          name: 'body',
          component: Hot
        },
        {
          path: 'head',
          name: 'head',
          component: Hot
        },
        {
          path: 'sticker',
          name: 'sticker',
          component: Hot
        },
        {
          path: 'text',
          name: 'text',
          component: Hot
        }
      ]
    },
    {
      path: '/expression',
      name: 'expression',
      component: Expression,
      beforeEnter: (to, from, next) => {
        const type = to.query.type
        const recnet = getData('recent_expression')
        if (!recnet) {
          for (let i = 0; i < menu.length; i++) {
            if (menu[i].type === 'menuRecent') {
              cache.menuRecent = menu.splice(i, 1)
              break
            }
          }
        } else if (cache.menuRecent) {
          menu.unshift(cache.menuRecent)
          delete cache.menuRecent
        }
        let t = ''
        switch (type) {
          case 'body':
          case 'head':
            t = 'menuImage'
            break
          case 'sticker':
            t = 'menuSticker'
            break
          case 'menuOther':
            t = 'menuOther'
            break
        }
        for (let i = 0; i < menu.length; i++) {
          menu[i].active = menu[i].type !== t ? 0 : 1
        }
        cache.menuActive = t
        next()
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'expression') {
    const name = getData('menuActive')
    const params = { cb: next }
    if (name) {
      params.type = name
      setData('menuActive', '')
    } else {
      params.type = to.name
    }
    store.dispatch('setNav', params)
    next()
  } else {
    next()
  }
})

router.onReady(() => {

})

export default router
