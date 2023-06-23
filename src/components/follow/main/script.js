import PredictionWidget from '@/components/PredictionWidget.vue'
import Toolbar from '@/components/Toolbar.vue'
import Help from '@/components/Help.vue'
import Gitbook from "@/components/Gitbook.vue";
import labelColors from '@/assets/labels.json'
import FilterTableaux from '@/components/follow/filters/contexte.vue'
import FilterDepartement from '@/components/follow/filters/departement.vue'
import {useFollowStore} from "@/stores/followFilters";

export default {
  name: 'Follow',
  components: {PredictionWidget, Toolbar, Help, Gitbook, FilterTableaux, FilterDepartement},
  setup() {
    const follow = useFollowStore()
    return {follow}
  },
  data() {
    return {
      init: true,
      loading: false,
      followPayload: {},
      snackbar: true,
      exportXSLXLoading: false,
      exportDOCXLoading: false,
      menuSince: false,
      alertExport: false,
      since: null,
      zoneFollow: [],
      raisonSociale: null,
    }
  },
  mounted() {
    this.$bus.$on('follow-update', this.getFollowedEtablissements)
    this.getFollowedEtablissements()
  },
  watch: {
    since() {
      this.debounce(this.getFollowedEtablissements, 500)
    }
  },
  methods: {
    resetLabels(event) {
      this.labels = []
      this.getFollowedEtablissements()
      event.stopPropagation()
    },
    showFollowHelp() {
      this.$refs.followHelp.clickButton()
    },
    debounce(fn, timeout) {
      clearTimeout(this._timerID)
      this._timerID = setTimeout(fn, timeout)
    },
    clearAndGetFollowedEtablissements() {
      this.labels = []
      this.zone = ['*']
      this.lists = ['*']
      this.raisonSociale = null
      this.getFollowedEtablissements()
    },
    getFollowedEtablissements() {
      this.loading = true
      if (this._abortController) {
        this._abortController.abort()
        this._abortController = null
      }

      this._abortController = new AbortController();
      this.$axios.post(
        '/kanban/follow',
        this.params,
        {
          signal: this._abortController.signal
        }
      ).then((response) => {
        if (response.status === 200) {
          this.followPayload = response.data
        } else {
          this.followPayload = {}
        }
      }).finally(() => {
        this.init = false
        this.loading = false
        this.followStateChanged = false
      })
    },
    openLeftDrawer() {
      this.trackMatomoEvent('general', 'ouvrir_menu')
      this.leftDrawer = !this.leftDrawer
    },
    openRightDrawer() {
      this.rightDrawer = true
    },
    closeRightDrawer() {
      this.rightDrawer = false
    },
    download(response, defaultFilename) {
      const blob = new Blob([response.data])
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      const filename = response.headers['content-disposition'] ? response.headers['content-disposition'].split('filename=')[1] : defaultFilename
      if (filename) {
        link.setAttribute('download', filename)
      }
      link.click()
      link.remove()
    },
    exportXSLX() {
      this.trackMatomoEvent('suivi', 'extraire', 'xlsx')
      this.exportXSLXLoading = true
      this.alertExport = false
      this.$axios.post('/export/xlsx/follow', this.params, {
        responseType: 'blob',
        timeout: 120000
      }).then((response) => {
        this.download(response, 'export-suivi.xlsx')
        this.exportXSLXLoading = false
      }).catch((_) => {
        this.exportXSLXLoading = false
        this.alertExport = true
      })
    },
    exportDOCX() {
      this.trackMatomoEvent('suivi', 'extraire', 'docx')
      this.exportDOCXLoading = true
      this.alertExport = false
      this.$axios.post('/export/docx/follow', this.params, {
        responseType: 'blob',
        timeout: 120000
      }).then((response) => {
        this.download(response, 'export-suivi.zip')
        this.exportDOCXLoading = false
      }).catch((_) => {
        this.exportDOCXLoading = false
        this.alertExport = true
      })
    },
    sortSelect(i1, i2) {
      return (i1.text < i2.text) ? -1 : 1
    }
  },
  computed: {
    etablissements() {
      return this.followPayload.summaries || []
    },
    uniqEtablissements() {
      // TODO: déplacer cette logique dans le backend
      const map = this.etablissements.reduce((m, e) => {
        m[e.siret] = e
        return m
      }, {})
      return Object.values(map)
    },
    params() {
      const params = {}
      params.type = this.type
      if (!this.lists.includes('*')) {
        params.lists = this.lists
      }
      params.boardIDs = this.follow.contextIDs

      params.zone = this.follow.departements


      if (this.labels.length > 0) {
        params.labelMode = this.labelMode
        params.labels = this.labels
      }
      if (this.since) {
        params.since = new Date(this.since)
      }
      if (this.raisonSociale) {
        params.raisonSociale = this.raisonSociale
      }
      return params
    },
    leftDrawer: {
      get() {
        return this.$store.state.leftDrawer
      },
      set(val) {
        this.$store.dispatch('setLeftDrawer', val)
      },
    },
    rightDrawer: {
      get() {
        return this.$store.state.followRightDrawer && this.wekanUser
      },
      set(val) {
        this.$store.dispatch('setFollowRightDrawer', val)
      },
    },
    wekan_url() {
      return process.env.VUE_APP_WEKAN_URL
    },
    type: {
      get() {
        return this.$localStore.state.typeFollow
      },
      set(value) {
        this.$localStore.commit('setTypeFollow', value)
      },
    },
    boards: {
      get() {
        const boardsFollow = this.$localStore.state.boardsFollow
        return (boardsFollow.includes('*')) ? ['*'] : boardsFollow
      },
      set(value) {
        this.$localStore.commit('setBoardsFollow', (value.includes('*')) ? ['*'] : value)
      },
    },
    lists: {
      get() {
        const listsFollow = this.$localStore.state.listsFollow
        return (listsFollow.includes('*')) ? ['*'] : listsFollow
      },
      set(value) {
        this.$localStore.commit(
          'setListsFollow',
          (value.includes('*')) ? ['*'] : value
        )
      },
    },
    zone: {
      get() {
        const zoneFollow = this.$localStore.state.zoneFollow
        return (zoneFollow.includes('*')) ? ['*'] : zoneFollow
      },
      set(value) {
        this.$localStore.commit(
          'setZoneFollow',
          (value.includes('*')) ? ['*'] : value
        )
      },
    },
    labels: {
      get() {
        return this.$localStore.state.labelsFollow || []
      },
      set(value) {
        this.$localStore.commit('setLabelsFollow', value)
      },
    },
    labelMode: {
      get() {
        return this.$localStore.state.labelModeFollow
      },
      set(value) {
        this.$localStore.commit('setLabelModeFollow', value)
      },
    },

    departements() {
      return this.$store.state.departements
    },
    wekanUser() {
      return this.roles.includes('wekan')
    },
    labelItems() {
      const boards = Object
        .entries(this.$store.state.kanbanConfig.boards || {})
        .filter(([boardID, _]) => (this.boards.includes(boardID) || this.boards.includes('*')))
      const labels = boards.reduce((m, [_, board]) => {
        Object.entries(board.labels).forEach(([_, label]) => {
          if (label.name !== '') {
            m[label.name] = labelColors[label.color]
          }
        })
        return m
      }, {})
      return Object.entries(labels).map(([name, color]) => {
        return {
          text: name,
          background: color.background,
          front: color.front,
          value: name,
        }
      }).sort((label1, label2) => {
        return (label1.background + label1.name < label2.background + label2.name) ? -1 : 1
      })
    },
    listsItems() {
      const boards = Object
        .entries(this.$store.state.kanbanConfig.boards || {})
        .filter(([boardID, _]) => (this.boards.includes(boardID) || this.boards.includes('*')))
      const dupItems = boards
        .flatMap(([_, board]) => {
          return Object.values(board.lists)
            .sort((list1, list2) => {
              return (list1.sort < list2.sort) ? -1 : 1
            })
            .map((list) => {
              return list.title
            })
        })
      const items = dupItems
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((item) => {
          return {
            text: item,
            disabled: (this.lists.includes('*')),
          }
        })
      const all = [
        {
          text: 'Tous les statuts',
          value: '*',
        },
      ]
      return all.concat(items)
    },
  },
  filters: {
    pluralizeEtablissement(count) {
      if (count === 1) {
        return '1 établissement'
      } else {
        return count + ' établissements'
      }
    },
  },
}