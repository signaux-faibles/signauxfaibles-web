import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Prediction from '@/views/Prediction.vue'
import Goup from '@/views/Goup.vue'
import PageNotFound from '@/views/PageNotFound.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/',
    //   name: 'login',
    //   component: Login,
    // },
    {
      path: '/',
      name: 'prediction',
      component: Prediction,
    },
    {
      path: '/goup',
      name: 'goup',
      component: Goup,
    },
    { path: '*',
      name: 'collector',
      component: PageNotFound,
    },
  ],
})
