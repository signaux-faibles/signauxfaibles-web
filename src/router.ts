import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Prediction from '@/views/Prediction.vue'
import Goup from '@/views/Goup.vue'
import Browse from '@/views/Browse.vue'
import PageNotFound from '@/views/PageNotFound.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/prediction',
      name: 'prediction',
      component: Prediction,
    },
    {
      path: '/',
      name: 'browse',
      component: Browse,
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
