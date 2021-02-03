import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/log/Login.vue'
import PadHome from '@/components/page/PadHome'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },{
      path: '/login',
      name: 'Login',
      component: Login
    },{
      path: '/PadHome',
      name: 'PadHome',
      component: PadHome
    }
  ]
})
