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
    timeout: 30000,
  },
)

const localStore = new Vuex.Store({
  plugins: [createPersistedState({ storage: window.localStorage })],
  state: {
    excludeSecteursCovid: false,
    inclureEtablissementsFermes: false,
    exclureSuivi: false,
    ignorezone: false,
    currentNaf: 'C',
    zone: [],
    caMin: null,
    minEffectif: 20,
    newsRead: new Date('1970-01-01'),
    securityConsent: new Date('1970-01-01'),
    procol: ['In bonis', 'Sauvegarde', 'Plan de sauvegarde'],
    expiredSession: false,
    typeSuivi: 'my-cards',
    statutSuivi: ['Suivi en cours'],
    zoneSuivi: [],
    labelsSuivi: [],
  },
  mutations: {
    setexcludeSecteursCovid(state, val: boolean) { state.excludeSecteursCovid = val },
    setinclureEtablissementsFermes(state, val: boolean) { state.inclureEtablissementsFermes = val },
    setexclureSuivi(state, val: boolean) { state.exclureSuivi = val },
    setignorezone(state, val: boolean) { state.ignorezone = val },
    setprocol(state, val) { state.procol = val },
    setcurrentNaf(state, val: string) { state.currentNaf = val },
    setzone(state, val) { state.zone = val },
    setcaMin(state, val) { state.caMin = val },
    setminEffectif(state, val) { state.minEffectif = val },
    setNewsRead(state, val) { state.newsRead = val },
    setSecurityConsent(state, value) { state.securityConsent = value },
    setExpiredSession(state, value) { state.expiredSession = value },
    setTypeSuivi(state, value) { state.typeSuivi = value },
    setStatutSuivi(state, value) { state.statutSuivi = value },
    setZoneSuivi(state, value) { state.zoneSuivi = value },
    setLabelsSuivi(state, value) { state.labelsSuivi = value },
  },
})

const sessionStore = new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state: {
    currentBatchKey: null as unknown as string,
    leftDrawer: true,
    rightDrawer: true,
    followRightDrawer: true,
    naf: [] as any[],
    batches: [] as any[],
    departements: [] as any[],
    region: [] as any[],
    wekanConfig: {} as any,
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
    followRightDrawer(state, val) {
      state.followRightDrawer = val
    },
    updateReference(state, reference) {
      state.batches = reference.listes
      state.currentBatchKey = state.currentBatchKey || (state.batches[0] || { id: '' }).id
      state.naf = reference.naf
      state.region = reference.regions
      state.departements = reference.departements
    },
    updateWekanConfig(state, wekanConfig) {
      state.wekanConfig = wekanConfig
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
    updateWekanConfig(context) {
      axiosClient.get('/wekan/config').then(response => {
        context.commit('updateWekanConfig', response.data)
      });
    },
    setLeftDrawer(context, val) {
      context.commit('leftDrawer', val)
    },
    setRightDrawer(context, val) {
      context.commit('rightDrawer', val)
    },
    setFollowRightDrawer(context, val) {
      context.commit('followRightDrawer', val)
    },
  },
})

const store = {
  sessionStore,
  localStore,
  axiosClient,
}

export default store
