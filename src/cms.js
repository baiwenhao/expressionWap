import { sync } from 'vuex-router-sync'
import App from './pages/AppCms'
import router from './router/indexCms'
import store from './store/index_cms'
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
