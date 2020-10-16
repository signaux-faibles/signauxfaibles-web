import Vue from 'vue'
import Vuex, { ActionContext } from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

const refreshRate = 60000

Vue.use(Vuex)

const axiosClient = axios.create(
  {
    headers: {
      'Content-Type': 'application/json',
    },
    baseURL: process.env.VUE_APP_DATAPI_BASE_URL,
  },
)

const localStore = new Vuex.Store({
  plugins: [createPersistedState({ storage: window.localStorage })],
  state: {
    siegeUniquement: false,
    exclureSuivi: false,
    ignorezone: false,
    rj: false,
    lj: false,
    continuation: true,
    sauvegarde: true,
    plan_sauvegarde: true,
    in_bonis: true,
    currentNaf: 'C',
    zone: [],
    minEffectif: 20,
    newsRead: new Date('1970-01-01'),
    securityConsent: new Date('1970-01-01'),
  },
  mutations: {
    setsiegeUniquement(state, val: boolean) { state.siegeUniquement = val },
    setexclureSuivi(state, val: boolean) { state.exclureSuivi = val },
    setignorezone(state, val: boolean) { state.ignorezone = val },
    setrj(state, val: boolean) { state.rj = val },
    setlj(state, val: boolean) { state.lj = val },
    setcontinuation(state, val: boolean) { state.continuation = val },
    setsauvegarde(state, val: boolean) { state.sauvegarde = val },
    setplan_sauvegarde(state, val: boolean) { state.plan_sauvegarde = val },
    setin_bonis(state, val: boolean) { state.in_bonis = val },
    setcurrentNaf(state, val: string) { state.currentNaf = val },
    setzone(state, val) { state.zone = val },
    setminEffectif(state, val) { state.minEffectif = val },
    setNewsRead(state, val) { state.newsRead = val },
    setSecurityConsent(state, value) { state.securityConsent = value },
  },
})

const sessionStore = new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state: {
    currentBatchKey: null as unknown as string,
    leftDrawer: true,
    rightDrawer: true,
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
      state.batches = reference.listes.sort((b1: any, b2: any) => b1.id > b2.id ? -1 : 1)
      state.currentBatchKey = state.currentBatchKey || (state.batches[0] || { id: '' }).id
      state.naf = reference.naf
      state.region = reference.regions
      state.departements = reference.departements
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
    batches(state) {
      return state.batches.map((b) => {
        return {
          value: b.id,
          text: b.id,
        }
      })
    },
  },
  actions: {
    setCurrentBatchKey(context, batchKey) {
      context.commit('setCurrentBatchKey', batchKey)
    },
    setHeight(context, height) {
      context.commit('setHeight', height)
    },
    setScrollTop(context, scrollTop) {
      context.commit('setScrollTop', scrollTop)
    },
    updateReference(context) {
      const getListes = axiosClient.get('/listes')
      const getNaf = axiosClient.get('/reference/naf')
      const getRegions = axiosClient.get('/reference/regions')
      const getDepartements = axiosClient.get('/reference/departements')
      axios.all([getListes, getNaf, getRegions, getDepartements]).then(axios.spread((...responses) => {
        const reference = {
          listes: responses[0].data,
          naf: responses[1].data,
          regions: responses[2].data,
          departements: responses[3].data,
        }
        context.commit('updateReference', reference)
      }))
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
