import Vue from 'vue'
import './filter'
import App from './App.vue'
import router from './router'
import store from './store/store'
import VuePhotoZoomPro from 'vue-photo-zoom-pro'
// import Alert from 'COMPONENTS/alert/alert.js'
// 自定义的组件
// 引入vue实例扩展函数库
// import './util'
import '@/elementui/index.js'

Vue.config.productionTip = false
Vue.use(VuePhotoZoomPro) // 预览图片库
// Vue.prototype.$Alert = Alert
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
