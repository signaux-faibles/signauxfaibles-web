import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Prediction from '@/views/Prediction.vue'
import PageNotFound from '@/views/PageNotFound.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/detection',
      name: 'prediction',
      component: Prediction,
    },
    { path: '*',
      name: 'collector',
      component: PageNotFound,
    },
  ],
})
