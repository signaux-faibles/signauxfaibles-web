import Vue from 'vue'
import Vuex, { ActionContext } from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
// import VueNativeSock from 'vue-native-websocket'

Vue.use(Vuex)

const baseURL = 'http://localhost:3001/'

const axiosClient = axios.create(
  {
    headers: {
      'Content-Type': 'application/json',
    },
    baseURL,
  },
)

axiosClient.interceptors.request.use(
  (config) => {
    if (sessionStore.state.token != null) { config.headers.Authorization = 'Bearer ' + sessionStore.state.token }
    return config
  },
)

const localStore = new Vuex.Store({
  plugins: [createPersistedState({ storage: window.localStorage })],
  state: {
    browserToken: null,
  },
  mutations: {
    setBrowserToken(state, browserToken) {
      state.browserToken = browserToken
    },
  },
  getters: {
    browserToken(state) { return state.browserToken },
  },
})


const sessionStore = new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state: {
    leftDrawer: true,
    rightDrawer: false,
    token: null,
    references: {
      types: null,
      features: null,
      batches: [],
      naf: null,
    },
    height: 0,
    scrollTop: 0,
  },
  mutations: {
    leftDrawer(state, val) {
      state.leftDrawer = val
    },
    rightDrawer(state, val) {
      state.rightDrawer = val
    },
    refreshToken(state) {
      axiosClient.get('/api/refreshToken').then((response) => {
        state.token = response.data.token
      })
    },
    logout(state) {
      state.token = null
      state.references.types = null
      state.references.features = null
      state.references.batches = []
    },
    setToken(state, token) {
      state.token = token
    },
    updateFeatures(state, features) {
      state.references.features = features
    },
    updateNAF(state, naf) {
      state.references.naf = naf
    },
    setHeight(state, height) {
      state.height = height
    },
    setScrollTop(state, scrollTop) {
      state.scrollTop = scrollTop
    },
  },
  actions: {
    setToken(context, token) {
      context.commit('setToken', token)
    },
    setHeight(context, height) {
      context.commit('setHeight', height)
    },
    setScrollTop(context, scrollTop) {
      context.commit('setScrollTop', scrollTop)
    },
    updateBatches(context) {
      // axiosClient.get('/api/admin/batch').then(response => {
      //   context.commit('updateBatches', response.data)
      // })
    },
    updateTypes(context) {
      // axiosClient.get('/api/admin/types').then(response => {
      //   context.commit('updateTypes', response.data)
      // })
    },
    updateFeatures(context) {
      // axiosClient.get('/api/admin/features').then(response => {
      //   context.commit('updateFeatures', response.data)
      // })
    },
    updateNAF(context) {
      // axiosClient.get('/api/admin/features').then(response => {
      //   context.commit('updateFeatures', response.data)
      // })
    },
    login(context, credentials) {
      const formData = {
        browserToken: localStore.state.browserToken,
        email: credentials.email,
        password: credentials.password,
      }

      axiosClient.post('/login', formData).then((response) => {
        context.commit('setToken', response.data.token)
      }).catch((_) => {
        context.commit('setLoginError', true)
        setTimeout(() => { context.commit('setLoginError', false) }, 5000)
      })
    },
    setLeftDrawer(context, val) {
      context.commit('leftDrawer', val)
    },
    setRightDrawer(context, val) {
      context.commit('rightDrawer', val)
    },
  },
  getters: {
    batchesObject(state) {
      return (state.references.batches || []).reduce((accu: any, batch: any) => {
        accu[batch.id.key] = batch
        return accu
      }, {})
    },
    batchesArray(state) {
      return (state.references.batches || [])
    },
    batchesKeys(state) {
      return (state.references.batches || []).map((batch: any) => batch.id.key)
    },
    axiosConfig(state) {
      return { headers: { Authorization: 'Bearer ' + state.token } }
    },
  },
})

const store = {
  sessionStore,
  localStore,
  axiosClient,
}

export default store
