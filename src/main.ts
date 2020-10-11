// @ts-ignore
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueApexCharts from 'vue-apexcharts'
// @ts-ignore
import VueMatomo from 'vue-matomo'

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

Vue.component('apexchart', VueApexCharts)

const redirectURI = window.location.pathname

const bdf = (redirectURI.slice(-3) === 'bdf')

if (process.env.VUE_APP_MATOMO_ENABLED && !!JSON.parse(process.env.VUE_APP_MATOMO_ENABLED)) {
  Vue.use(VueMatomo, {
    host: process.env.VUE_APP_MATOMO_URL,
    siteId: process.env.VUE_APP_MATOMO_SITE_ID,
    router,
    trackInitialView: false,
  })
}

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
      keycloak.login({
        idpHint: (bdf) ? 'bdfidp' : undefined,
      })
    } else {
      if ((window as any)._paq) {
        (window as any)._paq.push(['setUserId', Vue.prototype.$keycloak.tokenParsed.preferred_username])
      }
      tokenInterceptor()
      const tslintCantBeDisabledSorryForThis = new Vue({
        el: '#app',
        router,
        template: '<App/>',
        render: (h) => h(App),
      })
    }
  },
})

Vue.mixin({
  methods: {
    trackMatomoEvent(category, action, name, value) {
      if (Vue.prototype.$matomo) {
        Vue.prototype.$matomo.trackEvent(category, action, name, value)
      }
    },
  },
  computed: {
    jwt() {
      const jwt = Vue.prototype.$keycloak.tokenParsed
      return jwt
    },
    roles() {
      const roles = (Vue.prototype.$keycloak.tokenParsed.resource_access.signauxfaibles || {}).roles || []
      return roles
    },
  },
})
