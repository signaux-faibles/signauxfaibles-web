import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
import {KanbanConfig} from '@/lib/kanban'

Vue.use(Vuex)

const axiosClient = axios.create(
  {
    headers: {
      'Content-Type': 'application/json',
    },
    baseURL: process.env.VUE_APP_DATAPI_BASE_URL,
    timeout: 120000,
  },
)

const localStore = new Vuex.Store({
  plugins: [createPersistedState({storage: window.localStorage})],
  state: {
    excludeSecteursCovid: false,
    inclureEtablissementsFermes: false,
    exclureSuivi: false,
    firstAlert: false,
    ignorezone: false,
    currentNaf: [],
    zone: [],
    caMin: null,
    minEffectif: null,
    newsRead: new Date('1970-01-01'),
    securityConsent: new Date('1970-01-01'),
    procol: ['In bonis', 'Sauvegarde', 'Plan de sauvegarde'],
    expiredSession: false,
    typeFollow: 'my-cards',
    boardsFollow: ['*'],
    listsFollow: ['*'],
    zoneFollow: ['*'],
    labelsFollow: [],
    labelModeFollow: "and",
    currentBoard: '',
  },
  mutations: {
    setexcludeSecteursCovid(state, val: boolean) {
      state.excludeSecteursCovid = val
    },
    setinclureEtablissementsFermes(state, val: boolean) {
      state.inclureEtablissementsFermes = val
    },
    setexclureSuivi(state, val: boolean) {
      state.exclureSuivi = val
    },
    setfirstAlert(state, val: boolean) {
      state.firstAlert = val
    },
    setignorezone(state, val: boolean) {
      state.ignorezone = val
    },
    setprocol(state, val) {
      state.procol = val
    },
    setcurrentNaf(state, val: string) {
      state.currentNaf = val
    },
    setzone(state, val) {
      state.zone = val
    },
    setcaMin(state, val) {
      state.caMin = val
    },
    setminEffectif(state, val) {
      state.minEffectif = val
    },
    setNewsRead(state, val) {
      state.newsRead = val
    },
    setSecurityConsent(state, value) {
      state.securityConsent = value
    },
    setExpiredSession(state, value) {
      state.expiredSession = value
    },
    setTypeFollow(state, value) {
      state.typeFollow = value
    },
    setBoardsFollow(state, value) {
      state.boardsFollow = value
    },
    setListsFollow(state, value) {
      state.listsFollow = value
    },
    setZoneFollow(state, value) {
      state.zoneFollow = value
    },
    setLabelsFollow(state, value) {
      state.labelsFollow = value
    },
    setLabelModeFollow(state, value) {
      state.labelModeFollow = value
    },
    setCurrentBoard(state, value) {
      state.currentBoard = value
    },
  },
})

const sessionStore = new Vuex.Store({
  plugins: [createPersistedState({storage: window.sessionStorage})],
  state: {
    currentBatchKey: null as unknown as string,
    naf: [] as any[],
    batches: [] as any[],
    departements: [] as any[],
    region: [] as any[],
    kanbanConfig: {} as KanbanConfig,
    zone: {},
    height: 0,
    scrollTop: 0,
    prediction: [],
    loading: false,
    newsDialog: null,
    createCardSequence: 1,
    createCardSwimlaneID: null,
    createCardDialog: false,
    createCardProblems: [],
    createCardActions: [],
    createCardLabels: [],
    followCardsDialog: false,
  },
  mutations: {
    setNewsDialog(state, value) {
      state.newsDialog = value
    },
    setLoading(state, value) {
      state.loading = value
    },
    updateReference(state, reference) {
      state.batches = reference.listes
      state.currentBatchKey = state.currentBatchKey || (state.batches[0] || {id: ''}).id
      state.naf = reference.naf
      state.region = reference.regions
      state.departements = reference.departements
    },
    updateKanbanConfig(state, kanbanConfig: KanbanConfig) {
      state.kanbanConfig = kanbanConfig
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
    setCreateCardSequence(state, value) {
      state.createCardSequence = value
    },
    setCreateCardSwimlaneID(state, value) {
      state.createCardSwimlaneID = value
    },
    setCreateCardDialog(state, value) {
      state.createCardDialog = value
    },
    setCreateCardProblems(state, value) {
      state.createCardProblems = value
    },
    setCreateCardActions(state, value) {
      state.createCardActions = value
    },
    setCreateCardLabels(state, value) {
      state.createCardLabels = value
    },
    setFollowCardsDialog(state, value) {
      state.followCardsDialog = value
    }
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
    setCreateCardSwimlaneID(context, value) {
      context.commit('setCreateCardSwimlaneID', value)
    },
    setCreateCardDialog(context, value) {
      context.commit('setCreateCardDialog', value)
    },
    setCreateCardSequence(context, value) {
      context.commit('setCreateCardSequence', value)
    },
    setCreateCardProblems(context, value) {
      context.commit('setCreateCardProblems', value)
    },
    setCreateCardActions(context, value) {
      context.commit('setCreateCardActions', value)
    },
    setCreateCardLabels(context, value) {
      context.commit('setCreateCardLabels', value)
    },
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
    updateKanbanConfig(context, config) {
      context.commit('updateKanbanConfig', config)
    },
    setFollowCardsDialog(context, val) {
      context.commit('setFollowCardsDialog', val)
    }
  },
})

const store = {
  sessionStore,
  localStore,
  axiosClient,
}

export default store
