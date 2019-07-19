// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Axios from 'axios'
import store from './store/store'
import $ from 'jquery'
import "babel-polyfill"
import '../static/ueditor/ueditor.config.js'
import '../static/ueditor/ueditor.all.js'
import '../static/ueditor/lang/zh-cn/zh-cn.js'
import '../static/ueditor/ueditor.parse.js'

import '@/assets/iconfont.css'
import '@/assets/styles/main.scss'

//import VueQuillEditor from 'vue-quill-editor'
//Vue.use(VueQuillEditor)
Vue.config.productionTip = false


Vue.use(ElementUI)
/* eslint-disable no-new */
Vue.prototype.$http = Axios

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
