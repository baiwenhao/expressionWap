import { sync } from 'vuex-router-sync'
import App from './pages/App'
import router from './router/index'
import store from './store'
import VueLazyload from 'vue-lazyload'
import png from './assets/b.png'
import '@common/rem'

Vue.use(VueLazyload, {
  error: png,
  loading: png,
  attempt: 1
})

new Vue({
  el: '#root',
  store,
  router,
  render: h => h(App),
  renderError (h, err) {
    return h('pre', { style: { color: 'red' }}, err.stack)
  }
})

sync(store, router)
// http://fabricjs.com/manage-selection