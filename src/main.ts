// @ts-ignore
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import VueApexCharts from 'vue-apexcharts'
// @ts-ignore
import VueMatomo from 'vue-matomo'
import globals from '@/globals'


Vue.config.productionTip = true

Vue.prototype.$axios = store.axiosClient
Vue.prototype.$store = store.sessionStore
Vue.prototype.$localStore = store.localStore

function tokenInterceptor() {
  Vue.prototype.$axios.interceptors.request.use((config: any) => {
    config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`
    return config
  }, (error: any) => {
    return Promise.reject(error)
  })
}

function responseInterceptor() {
  Vue.prototype.$axios.interceptors.response.use((response: any) => {
    return Promise.resolve(response)
  }, (error: any) => {
    if (error.response && error.response.status === 401) {
      Vue.prototype.$localStore.commit('setExpiredSession', true)
    }
    return Promise.reject(error)
  })
}

Vue.component('apexchart', VueApexCharts)

if (process.env.VUE_APP_MATOMO_ENABLED && !!JSON.parse(process.env.VUE_APP_MATOMO_ENABLED)) {
  Vue.use(VueMatomo, {
    host: process.env.VUE_APP_MATOMO_URL,
    siteId: process.env.VUE_APP_MATOMO_SITE_ID,
    router,
    trackInitialView: false,
  })
}

Vue.prototype.$bus = new Vue();

Vue.use(VueKeyCloak, {
  init: {
    onLoad: 'check-sso',
    checkLoginIframe: true,
  },
  config: {
    realm: process.env.VUE_APP_KEYCLOAK_REALM,
    url: process.env.VUE_APP_KEYCLOAK_URL,
    clientId: process.env.VUE_APP_KEYCLOAK_CLIENT,
  },
  onReady: (keycloak: any) => {
    if (!keycloak.authenticated) {
      keycloak.login()
    } else {
      Vue.prototype.$localStore.commit('setExpiredSession', false)
      const _paq: any[] = (window as any)._paq
      if (_paq) {
        const jwt = Vue.prototype.$keycloak.tokenParsed
        _paq.push(['setUserId', jwt.preferred_username])
        _paq.push(['setCustomVariable', '1', 'segment', jwt.segment || ''])
      }
      tokenInterceptor()
      responseInterceptor()
      const tslintCantBeDisabledSorryForThis = new Vue({
        vuetify,
        el: '#app',
        router,
        template: '<App/>',
        render: (h) => h(App),
      })
    }
  },
  onAuthRefreshError: (keycloak: any) => {
    Vue.prototype.$localStore.commit('setExpiredSession', true)
  },
})


Vue.mixin({
  methods: {
    trackMatomoEvent(category, action, name, value) {
      if (Vue.prototype.$matomo) {
        Vue.prototype.$matomo.trackEvent(category, action, name, value)
      }
    },
    gitbookPath(section: string): string {
      if (globals.gitbook) {
        return globals.gitbook[section]
      }
      return ''
    }
  },
  computed: {
    jwt() {
      const jwt = Vue.prototype.$keycloak.tokenParsed
      return jwt
    },
    roles() {
      return (Vue.prototype.$keycloak.tokenParsed.resource_access.signauxfaibles || {}).roles || []
    }
  },
})
