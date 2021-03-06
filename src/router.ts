import Vue from 'vue'
import Router from 'vue-router'
import Prediction from '@/views/Prediction.vue'
import Goup from '@/views/Goup.vue'
import Browse from '@/views/Browse.vue'
import Follow from '@/views/Follow.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import Etablissement from '@/components/Etablissement.vue'

Vue.use(Router)

const router = new Router({
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
    {
      path: '*',
      name: 'collector',
      component: PageNotFound,
    },
    {
      path: '/follow',
      name: 'follow',
      component: Follow,
    },
    {
      path: '/ets/:siret',
      name: 'etablissement',
      component: Etablissement,
      props: true,
    },
  ],
})

export default router
