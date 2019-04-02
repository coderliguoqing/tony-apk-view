import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index.vue'
import dict from '@/pages/system/dict_list.vue'
import menu from '@/pages/system/menu_list.vue'
import role from '@/pages/system/role_list.vue'
import user from '@/pages/system/user_list.vue'
import updatePassword from '@/pages/system/update_password.vue'
import generator from '@/pages/system/gen_list.vue'
import demo from '@/pages/demo.vue'
import banner from '@/pages/banner/banner_list.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/index', name: 'index', component: index },
    { path: '/dict', name: 'dict', component: dict },
    { path: '/menu', name: 'menu', component: menu },
    { path: '/role', name: 'role', component: role },
    { path: '/user', name: 'user', component: user },
    { path: '/updatePassword', name: 'updatePassword', component: updatePassword },
    { path: '/generator', name: 'generator', component: generator },
    { path: '/demo', name: 'demo', component: demo },
    { path: '/banner', name: 'banner', component: banner }
  ]
})
