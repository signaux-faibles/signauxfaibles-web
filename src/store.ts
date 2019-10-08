import Vue from 'vue'
import Vuex, { ActionContext } from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
import jwt from 'jwt-decode'
// import VueNativeSock from 'vue-native-websocket'

const refreshRate = 60000

Vue.use(Vuex)

const baseURL = '/'
// const baseURL = 'http://localhost:3000/'

const axiosClient = axios.create(
  {
    headers: {
      'Content-Type': 'application/json',
    },
    baseURL,
  },
)

// axiosClient.interceptors.request.use(
//   (config: any) => {
//     if (sessionStore.state.token != null) { config.headers.Authorization = 'Bearer ' + sessionStore.state.token }
//     return config
//   },
// )

const localStore = new Vuex.Store({
  plugins: [createPersistedState({ storage: window.localStorage })],
  state: {
    crp: false,
    procol: false,
    plan_continuation: true,
    sauvegarde: true,
    plan_sauvegarde: true,
    in_bonis: true,
    currentNaf: 'C',
    zone: [],
    minEffectif: 20,
    newsRead: new Date('1970-01-01'),
  },
  mutations: {
    setcrp(state, val: boolean) { state.crp = val },
    setprocol(state, val: boolean) { state.procol = val },
    setplan_continuation(state, val: boolean) { state.plan_continuation = val },
    setsauvegarde(state, val: boolean) { state.sauvegarde = val },
    setplan_sauvegarde(state, val: boolean) { state.plan_sauvegarde = val },
    setin_bonis(state, val: boolean) { state.in_bonis = val },
    setcurrentNaf(state, val: string) { state.currentNaf = val },
    setzone(state, val) { state.zone = val },
    setminEffectif(state, val) { state.minEffectif = val },
    setNewsRead(state, val) { state.newsRead = val },
  },
})

const sessionStore = new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state: {
    currentBatchKey: null as unknown as string,
    leftDrawer: true,
    rightDrawer: true,
    refreshToken: null as unknown as string,
    naf: [] as any[],
    batches: [] as any[],
    departements: [] as any[],
    region: [] as any[],
    procol: [] as any[],
    zone: {},
    height: 0,
    scrollTop: 0,
    prediction: [],
    loading: false,
  },
  mutations: {
    setPrediction(state, value) {
      state.prediction = value
    },
    setLoading(state, value) {
      state.loading = value
    },
    leftDrawer(state, val) {
      state.leftDrawer = val
    },
    rightDrawer(state, val) {
      state.rightDrawer = val
    },
    updateReference(state, reference) {
      state.naf = reference.filter((r: any) => r.key.key === 'naf')
      state.batches = reference.filter((r: any) => r.key.key === 'batch')
      state.region = reference.filter((r: any) => r.key.type === 'region')
      state.departements = reference.filter((r: any) => r.key.type === 'departements')
      state.procol = reference.filter((r: any) => r.key.type === 'procol')
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
  },
  actions: {
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

const store = {
  sessionStore,
  localStore,
  axiosClient,
}

export default store
