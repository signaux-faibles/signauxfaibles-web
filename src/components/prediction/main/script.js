import Spinner from '@/components/Spinner.vue'
import PredictionWidget from '@/components/prediction/predictionWidget.vue'
import Help from '@/components/Help.vue'
import axios from 'axios'
import libellesProcols from '@/assets/libelles_procols.json'
import {useDrawersStore} from "@/stores/drawers";
import Gitbook from "@/components/Gitbook.vue";

export default {
  // TODO: right drawer in component
  setup() {
    const drawers = useDrawersStore()
    return {drawers}
  },
  data() {
    return {
      effectifClass: [10, 20, 50, 100],
      secteursCovid: ['s1', 's1bis', 's2'],
      init: true,
      filter: '',
      prediction: [],
      predictionAlerts: 0,
      predictionWarnings: 0,
      nafDialog: false,
      nextNaf: [],
      timer: null,
      page: 0,
      listHeight: 0,
      complete: false,
      errorOccured: false,
      followStateChanged: false,
      snackbar: true,
      procolItems: Object.values(libellesProcols),
      procolParams: Object.keys(libellesProcols),
      source: axios.CancelToken.source(),
    }
  },
  mounted() {
    this.getPrediction()
  },
  methods: {
    showModelHelp() {
      this.$refs.modelHelp.clickButton()
    },
    onHideEtablissement() {
      if (this.followStateChanged) {
        this.getPrediction()
      }
    },
    applyNaf() {
      this.currentNaf = this.nextNaf
      this.getPrediction()
    },
    copyNaf() {
      this.nextNaf = this.currentNaf.map((n) => n)
    },
    toggleNaf(value) {
      if (this.nextNaf.includes(value)) {
        this.nextNaf = this.nextNaf.filter((n) => (n !== value))
      } else {
        this.nextNaf.push(value)
      }
    },
    selectAllNaf() {
      if (!this.allNextNaf) {
        this.nextNaf = this.naf1.map((n) => n.value)
      } else {
        this.nextNaf = []
      }
    },
    format(v) {
      let data = '"'
      data += this.currentBatchKey + '";"'
      data += v.siren + '";"' + v.siret + '";"'
      data += v.departement + '";"'
      data += v.raison_sociale.replace('"', '\"') + '";"'
      data += v.dernier_effectif + '";"'
      data += v.code_activite + '";"'
      data += v.libelle_activite + '";"'
      data += v.alert + '"'
      return data
    },
    download() {
      this.trackMatomoEvent('listes', 'extraire', this.eventName)
      this.$axios(
        {
          url: `/scores/xls/${this.currentBatchKey}`,
          method: 'post',
          responseType: 'arraybuffer',
          data: this.params,
        },
      ).then((r) => {
        const url = window.URL.createObjectURL(new Blob([r.data]))
        const element = document.createElement('a')
        element.setAttribute('href', url)
        element.setAttribute('download', 'extract.xlsx')
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      })
    },
    getPrediction() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.prediction = []
        this.page = 0
        this.complete = false
        this.trackMatomoEvent('listes', 'charger_liste', this.eventName)
        this.cancel()
        this.getPredictionPage()
      }, 500)
    },
    getPredictionPage() {
      if (this.currentBatchKey) {
        this.loading = true
        this.errorOccured = false
        this.$axios.post(`/scores/liste/${this.currentBatchKey}`,
          this.params, {cancelToken: this.source.token}).then((response) => {
          if (response.status === 200) {
            this.prediction = this.prediction.concat(response.data.scores)
            this.predictionWarnings = response.data.nbF2
            this.predictionAlerts = response.data.nbF1
            const p = response.data.page ? response.data.page : 0
            const pageMax = response.data.pageMax ? response.data.pageMax : 0
            if (p === pageMax) {
              this.complete = true
            }
          } else if (response.status === 204) {
            this.complete = true
          } else {
            this.errorOccured = true
          }
          this.loading = false
        }).catch((error) => {
          if (!axios.isCancel(error)) {
            this.errorOccured = true
            this.loading = false
          }
        }).finally(() => {
          this.init = false
          this.followStateChanged = false
        })
        this.page += 1
      }
    },
    filterPrediction(propertyName) {
      const allowedProperties = [
        'excludeSecteursCovid',
        'creationDateThreshold',
        'firstAlert',
        'hasntDelai',
        'ignorezone',
        'inclureEtablissementsFermes',
        'exclureSuivi'
      ];

      if (allowedProperties.includes(propertyName)) {
        this[propertyName] = !this[propertyName];
        this.getPrediction();
      } else {
        console.error('Attempt to toggle an unauthorized property:', propertyName);
      }
    },
    cancel() {
      this.source.cancel()
      this.source = axios.CancelToken.source()
    },
  },
  watch: {
    scrollTop() {
      this.listHeight = this.$el.getBoundingClientRect().bottom
    },
    predictionIsEnough() {
      if (!this.predictionIsEnough) {
        this.trackMatomoEvent('listes', 'voir_page_suivante', this.currentBatchKey, this.page)
        this.getPredictionPage()
      }
    },
    prediction() {
      this.listHeight = this.$el.getBoundingClientRect().bottom
    },
  },
  computed: {
    activeFilters() {
      const filters = [];
      if (this.excludeSecteursCovid) {
        filters.push("Hors secteurs Covid-19");
      }
      if (this.creationDateThreshold) {
        filters.push("Sans entreprises récentes");
      }
      if (this.firstAlert) {
        filters.push("Premières alertes uniquement");
      }
      if (this.hasntDelai) {
        filters.push("Sans délais de paiement URSSAF");
      }
      if (this.ignorezone) {
        filters.push("Implantations dans ma zone");
      }
      if (this.inclureEtablissementsFermes) {
        filters.push("Etablissements fermés");
      }
      if (this.caMin) {
        filters.push(`CA min: ${this.caMin}k€`);
      }
      if (this.minEffectif) {
        filters.push(`Effectif min: ${this.minEffectif}`);
      }
      if (this.zone.length > 0) {
        filters.push(`Zones géographiques: ${this.zone.join(', ')}`);
      }
      if (this.allNaf) {
        filters.push("Secteurs d'activité: Tous");
      } else if (this.currentNaf.length > 0) {
        const nafDescriptions = this.currentNafLibelle.map(libelle => libelle || 'Unknown');
        filters.push(`Secteurs d'activité: ${nafDescriptions.join(', ')}`);
      }
      if (this.procol.length > 0) {
        filters.push(`Statut procédures: ${this.procol.join(', ')}`);
      }
      return filters;
    },
    predictionIsEnough() {
      return this.complete || this.loading || this.height * 2 < this.listHeight || this.errorOccured
    },
    params() {
      const params = {}
      if (!this.currentNaf.includes('NON')) {
        params.activite = this.currentNaf
      }
      if (this.excludeSecteursCovid) {
        params.excludeSecteursCovid = this.secteursCovid
      }
      if (this.zone.length > 0) {
        params.zone = this.zone
      }
      if (this.caMin) {
        params.caMin = parseInt(this.caMin, 10)
      }
      params.effectifMinEntreprise = parseInt(this.minEffectif, 10)

      if (this.creationDateThreshold) {
        const date = new Date()
        date.setFullYear(date.getFullYear() - 2)
        params.creationDateThreshold = date.toISOString().split('T')[0]
      }
      if (this.firstAlert) {
        params.firstAlert = true
      }
      if (this.ignorezone) {
        params.ignorezone = this.ignorezone
      }
      params.procol = []
      this.procolItems.forEach((p, i) => {
        if (this.procol.includes(p)) {
          params.procol.push(this.procolParams[i])
        }
      })
      if (this.hasntDelai) {
        params.hasntDelai = this.hasntDelai
      }
      if (this.exclureSuivi) {
        params.exclureSuivi = this.exclureSuivi
      }
      if (!this.inclureEtablissementsFermes) {
        params.etatAdministratif = 'A'
      }
      if (this.filter || '' !== '') {
        params.filter = this.filter
      }
      params.page = this.page
      return params
    },
    excludeSecteursCovid: {
      get() {
        return this.$localStore.state.excludeSecteursCovid
      },
      set(value) {
        this.$localStore.commit('setexcludeSecteursCovid', value)
      },
    },
    inclureEtablissementsFermes: {
      get() {
        return this.$localStore.state.inclureEtablissementsFermes
      },
      set(value) {
        this.$localStore.commit('setinclureEtablissementsFermes', value)
      },
    },
    exclureSuivi: {
      get() {
        return this.$localStore.state.exclureSuivi
      },
      set(value) {
        this.$localStore.commit('setexclureSuivi', value)
      },
    },
    ignorezone: {
      get() {
        return this.$localStore.state.ignorezone
      },
      set(value) {
        this.$localStore.commit('setignorezone', value)
      },
    },
    hasntDelai: {
      get() {
        return this.$localStore.state.hasntDelai
      },
      set(value) {
        this.$localStore.commit('setHasntDelai', value)
      },
    },
    creationDateThreshold: {
      get() {
        return this.$localStore.state.creationDateThreshold
      },
      set(value) {
        this.$localStore.commit('setcreationDateThreshold', value)
      },
    },
    firstAlert: {
      get() {
        return this.$localStore.state.firstAlert
      },
      set(value) {
        this.$localStore.commit('setfirstAlert', value)
      },
    },
    procol: {
      get() {
        return this.$localStore.state.procol
      },
      set(value) {
        this.$localStore.commit('setprocol', value)
      },
    },
    currentNaf: {
      get() {
        const naf = this.$localStore.state.currentNaf
        if (typeof(naf) == "string") {
          return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']
        }
        if (naf.length == 0) {
          return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']
        } else {
          return naf
        }

        return naf
      },
      set(value) {
        this.$localStore.commit('setcurrentNaf', value)
      },
    },
    currentNafLibelle() {
      return this.currentNaf.map((n) => {
        return (this.$store.state.naf || {})[n]
      })
    },
    zone: {
      get() {
        return this.$localStore.state.zone
      },
      set(value) {
        this.$localStore.commit('setzone', value)
      },
    },
    caMin: {
      get() {
        return this.$localStore.state.caMin
      },
      set(value) {
        this.$localStore.commit('setcaMin', value)
      },
    },
    minEffectif: {
      get() {
        return this.$localStore.state.minEffectif
      },
      set(value) {
        this.$localStore.commit('setminEffectif', value)
      },
    },
    loading: {
      get() {
        return this.$store.state.loading
      },
      set(value) {
        this.$store.commit('setLoading', value)
      },
    },
    naf1() {
      // TODO: clean naf structure
      const naf1 = Object.entries(this.$store.state.naf).map(([code,libelle]) => {
        return {
          text: code + '\u00a0-\u00a0' + libelle,
          value: code,
        }
      })
      return naf1
    },
    allNaf() {
      return this.currentNaf.length === this.naf1.length
    },
    allNextNaf() {
      return this.nextNaf.length === this.naf1.length
    },
    someNextNaf() {
      return this.nextNaf.length > 0 && !this.allNextNaf
    },
    batches() {
      const batches = this.$store.getters.batches
      return batches

    },
    scrollTop() {
      return this.$store.state.scrollTop
    },
    height: {
      get() {
        return this.$store.state.height
      },
      set(height) {
        this.$store.dispatch('setHeight', height)
      },
    },
    currentBatchKey: {
      get() {
        return this.$store.state.currentBatchKey
      },
      set(value) {
        this.$store.dispatch('setCurrentBatchKey', value)
      },
    },
    subzones() {
      let all = [
        {
          text: 'Toute zone',
          value: [],
        },
      ]
      const region = Object.keys(this.$store.state.region).map((r) => {
        return {
          text: r,
          value: this.$store.state.region[r],
        }
      }).sort((r1, r2) => r1.text > r2.text)
      all = all.concat(region)
      const departement = Object.keys(this.$store.state.departements).map((d) => {
        return {
          text: d + ' ' + this.$store.state.departements[d],
          value: [d],
        }
      }).sort((d1, d2) => {
        return d1.value[0].replace('2A', '200').replace('2B', '201') >
        d2.value[0].replace('2A', '200').replace('2B', '201') ? 1 : -1
      })
      all = all.concat(departement)
      return all
    },
    currentBatch() {
      return (this.batches.filter((b) => b.value === this.currentBatchKey)[0] || {text: 'chargement'}).text
    },
    currentBatchDescription() {
      const batches = this.$store.state.batches
      return (batches.filter((b) => b.id === this.currentBatchKey)[0]).description
    },
    eventName() {
      let eventName = this.currentBatchKey
      if (this.filter || '' !== '') {
        eventName = eventName.concat(',' + this.filter)
      }
      return eventName
    },
  },
  components: {Gitbook, PredictionWidget, Spinner, Help},
  name: 'Prediction',
}