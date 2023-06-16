import Vue from 'vue'
import Router from 'vue-router'
import Prediction from '@/components/prediction/main.vue'
import Browse from '@/components/Browse.vue'
import Follow from '@/components/follow/main/main.vue'
import PageNotFound from '@/components/PageNotFound.vue'
import Etablissement from '@/components/Etablissement/Main.vue'
import Campaigns from '@/components/campaigns/main/main.vue'

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
      path: '/campaigns',
      name: 'campaigns',
      component: Campaigns,
    },
    {
      path: '/campaigns/:urlCampaignID',
      name: 'campaignDetails',
      component: Campaigns,
      props: true,
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
