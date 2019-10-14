// @ts-ignore
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import VueApexCharts from 'vue-apexcharts'

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

const prod = 'https://signaux-faibles.beta.gouv.fr/auth/'
const local = 'http://localhost/auth/'

Vue.component('apexchart', VueApexCharts)

Vue.use(VueKeyCloak, {
  init: {
    onLoad: 'login-required',
    checkLoginIframe: false,
  },
  config: {
    realm: 'master',
    url: prod,
    clientId: 'signauxfaibles',
  },
  onReady: (keycloak: any) => {
    tokenInterceptor()
    const tslintCantBeDisabledSorryForThis = new Vue({
      el: '#app',
      router,
      template: '<App/>',
      render: (h) => h(App),
    })
  },
})

