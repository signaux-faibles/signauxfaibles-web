import Vue from 'vue'
import Vuex, { ActionContext } from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
// import VueNativeSock from 'vue-native-websocket'

Vue.use(Vuex)

const baseURL = 'http://localhost:3000/'

const axiosClient = axios.create(
  {
    headers: {
      'Content-Type': 'application/json',
    },
    baseURL,
  },
)

axiosClient.interceptors.request.use(
  (config: any) => {
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
    currentBatchKey: null as unknown as string,
    leftDrawer: false,
    rightDrawer: true,
    token: null,
    naf: [] as any[],
    batches: [] as any[],
    zone: {},
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
      state.naf = []
      state.zone = {}
    },
    setToken(state, token) {
      state.token = token
    },
    updateReference(state, reference) {
      state.naf = reference.filter((r: any) => r.key.key === 'naf')
      state.batches = reference.filter((r: any) => r.key.key === 'batch')
      state.currentBatchKey = state.batches.reduce((m, b) => {
        return b.key.batch > m ? b.key.batch : m
      }, '')
    },
    setHeight(state, height) {
      state.height = height
    },
    setScrollTop(state, scrollTop) {
      state.scrollTop = scrollTop
    },
    setCurrentBatchKey(state, value) {
      state.currentBatchKey = value
    },
  },
  getters: {
    naf: (state) => (batch: any) => {
      return state.naf.filter((n: any) => n.key.batch === batch)[0] || {}
    },
    batches(state) {
      return state.batches.map((b) => {
        return {
          value: b.key.batch,
          text: b.value.name,
        }
      })
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
    setCurrentBatchKey(context, value) {
      context.commit('setCurrentBatchKey', value)
    },
    updateReference(context) {
      const params = {}
      axiosClient.post('/data/get/reference', params).then((response) => {
        context.commit('updateReference', response.data)
      })
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
})



const store = {
  sessionStore,
  localStore,
  axiosClient,
}

export default store
