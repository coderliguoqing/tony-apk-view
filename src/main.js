// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
import $ from 'jquery'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import AppConfig from '@/config'
import api from '@/api/url'
import { baseAjax } from '@/api/baseRequest'


Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(preview)
Vue.prototype.$ELEMENT = { size: 'mini' }
Vue.prototype.$echarts = echarts

global.baseAjax = baseAjax
global.api = api
global.AppConfig = AppConfig

/* eslint-disable no-new */
const instance = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

export default instance
