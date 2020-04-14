import Vue from 'vue'
import App from './App.vue'
import router from './router'
// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// axios
import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://127.0.0.1:3000'
axios.interceptors.request.use(function (config) {
  const { token } = JSON.parse(sessionStorage.getItem('news-vant')) || {}
  config.headers = {
    Authorization: token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
