import Router from 'vue-router'
import { cache, menu } from '@api/data'
import { getData, setData } from '@common/util'
import store from '../store'

const nanoid = require('nanoid')
const Make = r => require.ensure([], () => r(require('@pages/Make')), 'make')
const Hot = r => require.ensure([], () => r(require('@components/Hot')), 'hot')
const Expression = r => require.ensure([], () => r(require('@pages/Expression')), 'expression')

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
          path: 'search',
          name: 'search',
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
        const recnet = getData('RecentImg')
        if (!recnet) {
          menu[0].code = ''
        } else {
          menu[0].code = 1
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
  if (to.name !== 'expression' && to.name !== 'search') {
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
  if (!localStorage.getItem('uuid')) {
    cache.uuid = nanoid()
    localStorage.setItem('uuid', cache.uuid)
  } else {
    cache.uuid = localStorage.getItem('uuid')
  }
  localStorage.removeItem('recent_expression')
})

export default router
