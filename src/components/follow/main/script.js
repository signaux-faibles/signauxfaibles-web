import PredictionWidget from '@/components/PredictionWidget.vue'
import Toolbar from '@/components/Toolbar.vue'
import Help from '@/components/Help.vue'
import Gitbook from "@/components/Gitbook.vue";
import FilterTableaux from '@/components/follow/filters/boards.vue'
import FilterDepartement from '@/components/follow/filters/departement.vue'
import FilterStatut from '@/components/follow/filters/statut.vue'
import FilterSince from '@/components/follow/filters/since.vue'
import FilterRaisonSociale from "@/components/follow/filters/raisonsociale.vue";
import FilterLabels from "@/components/follow/filters/labels.vue";
import {useFollowStore} from "@/stores/followFilters";
import Spinner from "@/components/Spinner.vue";
import {useDrawersStore} from "@/stores/drawers";
import FollowRightDrawer from "@/components/follow/rightdrawer/main.vue";
import FollowWidget from "@/components/follow/widget/main.vue";

export default {
  name: 'FollowMain',
  components: {
    FollowWidget,
    FollowRightDrawer,
    Spinner,
    FilterLabels,
    FilterRaisonSociale,
    PredictionWidget, Toolbar, Help, Gitbook, FilterTableaux, FilterDepartement, FilterStatut, FilterSince
  },
  setup() {
    const follow = useFollowStore()
    const drawers = useDrawersStore()
    return {follow, drawers}
  },
  data() {
    return {
      init: true,
      loading: true,
      followPayload: {summaries: []},
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
    this.loading = true
    this.$bus.$on('follow-update', this.getFollowedEtablissements)
    this.getFollowedEtablissements()
  },
  beforeDestroy() {
    this.$bus.$off()
  },
  watch: {},
  methods: {
    loadingClass() {
      if (this.loading) {
        return "loading"
      }
    },
    showFollowHelp() {
      this.$refs.followHelp.clickButton()
    },
    getFollowedEtablissements() {
      this.loading = true
      if (this._timerID) {
        clearTimeout(this._timerID)
      }
      const fn = () => {
        if (this._abortController) {
          this._abortController.abort()
          this._abortController = null
        }

        this._abortController = new AbortController();
        this.$axios.post(
          '/kanban/follow',
          this.follow.params,
          {
            signal: this._abortController.signal
          }
        )
          .catch((error) => {
            this.followPayload = {}
          })
          .then((response) => {
            if (response) {
              if (response.status === 200) {
                this.followPayload = response.data
              } else if (response.status === 204) {
                this.followPayload = {}
              }
            } else {
              this.followPayload = {}
            }
          })
          .finally(() => {
            this.init = false
            this.loading = false
            this.followStateChanged = false
          })
      }

      this._timerID = setTimeout(fn, 500)
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
      this.$axios.post('/export/xlsx/follow', this.follow.params, {
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
      this.$axios.post('/export/docx/follow', this.follow.params, {
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
    wekan_url() {
      return process.env.VUE_APP_WEKAN_URL
    },
    wekanUser() {
      return this.roles.includes('wekan')
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