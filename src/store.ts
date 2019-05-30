import Vue from 'vue'
import Vuex, { ActionContext } from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
import jwt from 'jwt-decode'
// import VueNativeSock from 'vue-native-websocket'

const refreshRate = 60000

Vue.use(Vuex)

const baseURL = 'https://signaux-faibles.beta.gouv.fr/'
// const baseURL = 'http://localhost:3000/'

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
    token: null as unknown as string,
    refreshToken: null as unknown as string,
    naf: [] as any[],
    batches: [] as any[],
    departements: [] as any[],
    region: [] as any[],
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
      state.token = null as unknown as string
      state.naf = []
      state.zone = {}
    },
    setTokens(state, tokens) {
      state.token = tokens.token
      state.refreshToken = tokens.refreshToken
    },
    updateReference(state, reference) {
      state.naf = reference.filter((r: any) => r.key.key === 'naf')
      state.batches = reference.filter((r: any) => r.key.key === 'batch')
      state.region = reference.filter((r: any) => r.key.type === 'region')
      state.departements = reference.filter((r: any) => r.key.type === 'departements')
      state.currentBatchKey = state.currentBatchKey ? state.currentBatchKey : state.batches.reduce((m, b) => {
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
    jwt(state)  {
      return jwt(state.token)
    },
  },
  actions: {
    refreshSession() {
      setTimeout(refreshFunction, refreshRate)
    },
    setTokens(context, tokens) {
      context.commit('setTokens', tokens)
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
    setLeftDrawer(context, val) {
      context.commit('leftDrawer', val)
    },
    setRightDrawer(context, val) {
      context.commit('rightDrawer', val)
    },
  },
})

function refreshFunction() {
  if (sessionStore.state.token != null) {
    const params = {
      refresh_token: sessionStore.state.refreshToken,
    }
    axiosClient.post('refreshToken', params).then((response) => {
      const tokens = {
        token: response.data.access_token,
        refreshToken: response.data.refresh_token,
      }
      sessionStore.commit('setTokens', tokens)
    })
    setTimeout(refreshFunction, refreshRate)
  }
}

const store = {
  sessionStore,
  localStore,
  axiosClient,
}

export default store
