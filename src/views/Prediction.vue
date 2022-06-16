<template>
  <div id="#detection" ref="detection">
    <v-app-bar app
      height="35px"
      class="toolbar elevation-12"
      color="#ffffff"
      extension-height="48px"
    >
      <v-icon
        @click="openLeftDrawer()"
        class="fa-rotate-180"
        v-if="!leftDrawer"
        color="#ffffff"
        key="toolbar"
      >mdi-backburger</v-icon>

      <div
        style="width: 100%; text-align: center;"
        class="toolbar_titre"
      >
        Détection - {{ currentBatch }}
        <Help v-if="currentBatchDescription" ref="modelHelp" titre="Modèle de détection" :dark="true" :big="true">
          <template>
            <div v-html="currentBatchDescription"></div>
          </template>
        </Help>
      </div>
      <v-spacer></v-spacer>
      <v-icon
        :class="loading?'rotate':''"
        color="#ffffff"
        v-if="!rightDrawer"
        @click="openRightDrawer()"
      >mdi-target</v-icon>
    </v-app-bar>
    <div class="mt-6">
      <div
        id="nodata"
        v-if="complete && prediction.length == 0"
      >Les paramètres de filtrage ne font ressortir aucune des entreprises pour lesquelles vous êtes habilité(e).</div>
      <v-navigation-drawer
        :class="(rightDrawer?'elevation-6':'') + ' rightDrawer'"
        transition="no-transition"
        width="330"
        v-model="rightDrawer"
        right
        app
      >
        <v-toolbar flat class="transparent" height="40">
          <v-icon :class="loading?'rotate':''" @click="closeRightDrawer()">mdi-target</v-icon>
        </v-toolbar>
        <div class="mt-2" style="padding: 0 15px;">
          <v-select
            :items="batches"
            v-model="currentBatchKey"
            @change="getPrediction"
            label="Liste de détection"
          ></v-select>
        </div>
        <v-divider class="mb-3" />
        <div style="vertical-align: middle; padding: 0 15px;">
          <v-icon style="width: 30px; margin-right: 10px;">fa-industry</v-icon>
          <span style="color: rgba(0,0,0,0.54); font-size: 13px;">Secteur d'activité</span>
          <p />
          <span
            style="color: #f00; font-weight: 600;"
            v-if="currentNaf.length == 0"
          >Aucun secteur sélectionné</span>
          <ul style="font-size: 11px" v-if="!allNaf">
            <li v-for="l in currentNafLibelle.slice(0,4)" :key="l">{{ l }}</li>
          </ul>
          <span
            style="margin-left: 15px; font-size: 11px; color: #444"
            v-if="currentNaf.length > 4 && !allNaf"
          >+ {{ currentNaf.length - 4 }} autre{{ (currentNaf.length > 5)?'s':'' }}</span>
          <span
            style="margin-left: 15px; font-size: 11px; color: #444"
            v-if="allNaf"
          >Tout secteur confondu</span>
          <v-dialog v-model="nafDialog" persistent scrollable width="700">
            <template v-slot:activator="{ on }">
              <v-btn
                light
                color="rgba(0,0,0,0.74)"
                v-on="on"
                @click="copyNaf()"
                outlined
                class="mt-3 mx-3"
              >
                <v-icon>mdi-filter</v-icon>selection des secteurs
              </v-btn>
            </template>
            <v-card>
              <v-toolbar dark dense color="indigo">
                <v-toolbar-title>Sélectionner les secteurs d'activité</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon
                        style="cursor: pointer"
                        @click="selectAllNaf()"
                      >{{ allNextNaf ? 'mdi-close-box' : 'mdi-plus-box' }}</v-icon>
                    </v-list-item-action>{{ !allNextNaf ? 'Tout sélectionner' : 'Tout désélectionner' }}
                    <v-list-item-content></v-list-item-content>
                  </v-list-item>
                  <v-divider />
                  <v-list-item v-for="n in naf1" :key="n.value">
                    <v-list-item-action @click="toggleNaf(n.value)">
                      <v-icon style="cursor: pointer;">
                        {{ nextNaf.includes(n.value) ?
                        'mdi-checkbox-marked' :
                        'mdi-checkbox-blank-outline'
                        }}
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>{{ n.text }}</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions style>
                <v-spacer />
                <v-btn light color="error" @click="nafDialog=false">annuler</v-btn>
                <v-btn light color="success" @click="applyNaf(); nafDialog=false">appliquer</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <v-list three-line>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="excludeSecteursCovid" @change="getPrediction()"></v-checkbox>
            </v-list-item-action>
            <v-list-item-content @click="toggleExcludeSecteursCovid()">
              <v-list-item-title>Hors secteurs COVID-19</v-list-item-title>
              <v-list-item-subtitle>Exclure les entreprises appartenants aux secteurs dits COVID-19 </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider class="mb-3" />
        <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;">
          <v-icon style="width: 30px; margin-right: 10px;">fa-map</v-icon>
          <v-select
            :items="subzones"
            v-model="zone"
            label="Zone Géographique"
            @change="getPrediction()"
          ></v-select>
        </div>
        <v-divider class="mb-3" />
        <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;">
          <v-icon style="width: 30px; margin-right: 10px;">fa-coins</v-icon>
          <v-text-field
            v-model="caMin"
            label="Chiffre d'affaires min"
            suffix="k€"
            @change="getPrediction()"
          ></v-text-field>
        </div>
        <v-divider class="mb-3" />
        <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;">
          <v-icon style="width: 30px; margin-right: 10px;">fa-users</v-icon>
          <v-combobox
            v-model="minEffectif"
            :items="effectifClass"
            label="Effectif min de l'entreprise"
            @change="getPrediction()"
          ></v-combobox>
        </div>
        <v-divider class="mb-3" />
        <div
          style="display: flex; flex-direction: column; vertical-align: middle; padding: 0 15px;"
        >
          <span
            style="font-size: 15px;"
            @change="getPrediction()"
          >Visibilité selon statut des procédures</span>
          <v-select
            ref="procol" 
            v-model="procol"
            :items="procolItems"
            :menu-props="{ maxHeight: 400 }"
            multiple
            chips
            @blur="getPrediction()"
          >
            <template v-slot:append-item>
              <div class="text-center my-2">
                <v-btn @click="$refs.procol.isMenuActive = false" color="primary">OK</v-btn>
              </div>
            </template>
          </v-select>
        </div>
        <v-list three-line>
          <v-list-group value="true">
            <v-subheader slot="activator">Filtres avancés</v-subheader>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox v-model="firstAlert" @change="getPrediction()"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content @click="toggleFirstAlert()">
                <v-list-item-title>Premières alertes</v-list-item-title>
                <v-list-item-subtitle>Affiche uniquement les premières alertes</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox v-model="ignorezone" @change="getPrediction()"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content @click="toggleIgnoreZone()">
                <v-list-item-title>Implantations dans ma zone</v-list-item-title>
                <v-list-item-subtitle>Inclure les sièges dont certains établissements sont dans ma zone</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox v-model="inclureEtablissementsFermes" @change="getPrediction()"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content @click="toggleInclureEtablissementsFermes()">
                <v-list-item-title>Établissements fermés</v-list-item-title>
                <v-list-item-subtitle>Inclure les établissements fermés</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox v-model="exclureSuivi" @change="getPrediction()"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content @click="toggleExclureSuivi()">
                <v-list-item-title>Établissements non suivis</v-list-item-title>
                <v-list-item-subtitle>Exclure mes établissements suivis</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>
    </div>
    <v-card
      style="height: 80px; text-align: center; vertical-align: top; background-color: #FFF0; position:"
      class="elevation-0 ma-2 pointer"
    >
      <v-container style="position: relative">
        <v-layout row>
          <v-flex xs12 md6>
            <v-text-field v-model="filter" @input="getPrediction" solo label="Filtre rapide par raison sociale ou SIREN" clearable />
          </v-flex>
          <v-flex xs12 md6 style="line-height: 53px">
            <v-icon style="top: -4px" color="red">fa-exclamation-triangle</v-icon>
            <span style=" font-size: 25px">{{ predictionAlerts }}</span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <v-icon style="top: -4px" color="amber">fa-exclamation-triangle</v-icon>
            <span style="font-size: 25px;">{{ predictionWarnings }}</span>
            <v-btn outlined color="indigo" @click="download" class="ml-4 mb-3">
              <v-icon small class="mr-2">fa-file-download</v-icon>
              Exporter
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <PredictionWidget v-for="p in prediction" :key="p.siret" :prediction="p" @hide-etablissement="onHideEtablissement" @follow-etablissement="followStateChanged = true" @unfollow-etablissement="followStateChanged = true"/>
    <Spinner v-if="loading" />
    <v-snackbar v-if="currentBatchDescription" v-model="snackbar" :bottom="true">
      Le modèle de détection a évolué !
      <v-btn color="primary" text @click="showModelHelp()">En savoir plus</v-btn>
      <v-btn icon @click="snackbar = false"><v-icon>clear</v-icon></v-btn> 
    </v-snackbar>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'
import PredictionWidget from '@/components/PredictionWidget'
import Help from '@/components/Help'
import axios from 'axios'
import libellesProcols from '@/assets/libelles_procols.json'

export default {
  // TODO: right drawer in component
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
        element.setAttribute('href',  url)
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
    openLeftDrawer() {
      this.trackMatomoEvent('general', 'ouvrir_menu')
      this.leftDrawer = !this.leftDrawer
    },
    openRightDrawer() {
      this.trackMatomoEvent('general', 'ouvrir_volet_filtrage')
      this.rightDrawer = !this.rightDrawer
    },
    closeRightDrawer() {
      this.trackMatomoEvent('general', 'fermer_volet_filtrage')
      this.rightDrawer = !this.rightDrawer
    },
    toggleExcludeSecteursCovid() {
      this.excludeSecteursCovid = !this.excludeSecteursCovid
      this.getPrediction()
    },
    toggleFirstAlert() {
      this.firstAlert = !this.firstAlert
      this.getPrediction()
    },
    toggleIgnoreZone() {
      this.ignorezone = !this.ignorezone
      this.getPrediction()
    },
    toggleInclureEtablissementsFermes() {
      this.inclureEtablissementsFermes = !this.inclureEtablissementsFermes
      this.getPrediction()
    },
    toggleExclureSuivi() {
      this.exclureSuivi = !this.exclureSuivi
      this.getPrediction()
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
      get() { return this.$localStore.state.excludeSecteursCovid },
      set(value) { this.$localStore.commit('setexcludeSecteursCovid', value) },
    },
    inclureEtablissementsFermes: {
      get() { return this.$localStore.state.inclureEtablissementsFermes },
      set(value) { this.$localStore.commit('setinclureEtablissementsFermes', value) },
    },
    exclureSuivi: {
      get() { return this.$localStore.state.exclureSuivi },
      set(value) { this.$localStore.commit('setexclureSuivi', value) },
    },
    ignorezone: {
      get() { return this.$localStore.state.ignorezone },
      set(value) { this.$localStore.commit('setignorezone', value) },
    },
    firstAlert: {
      get() { return this.$localStore.state.firstAlert },
      set(value) { this.$localStore.commit('setfirstAlert', value) },
    },
    procol: {
      get() { return this.$localStore.state.procol },
      set(value) { this.$localStore.commit('setprocol', value) },
    },
    currentNaf: {
      get() {
        // TODO: NON, unselect does not work
        const naf = this.$localStore.state.currentNaf
        if ((typeof naf) === 'string') {
          if (naf === 'NON') {
            return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
              'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']
          } else {
            return [naf]
          }
        }
        return naf
      },
      set(value) { this.$localStore.commit('setcurrentNaf', value) },
    },
    currentNafLibelle() {
      return this.currentNaf.map((n) => {
        return this.naf1.filter((n1) => (n1.value === n))[0].text
      })
    },
    zone: {
      get() { return this.$localStore.state.zone },
      set(value) { this.$localStore.commit('setzone', value) },
    },
    caMin: {
      get() { return this.$localStore.state.caMin },
      set(value) { this.$localStore.commit('setcaMin', value) },
    },
    minEffectif: {
      get() { return this.$localStore.state.minEffectif },
      set(value) { this.$localStore.commit('setminEffectif', value) },
    },
    loading: {
      get() { return this.$store.state.loading },
      set(value) { this.$store.commit('setLoading', value) },
    },
    leftDrawer: {
      get() {
        return this.$store.state.leftDrawer
      },
      set(drawer) {
        this.$store.dispatch('setLeftDrawer', drawer)
      },
    },
    naf1() {
      // TODO: clean naf structure
      return Object.keys(this.$store.state.naf).map((n) => {
        return {
          text: n + '\u00a0-\u00a0' + this.$store.state.naf[n],
          value: n,
        }
      })
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
        return this.$store.state.rightDrawer
      },
      set(val) {
        this.$store.dispatch('setRightDrawer', val)
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
      }).sort((d1, d2) => d1.value[0] > d2.value[0])
      all = all.concat(departement)
      return all
    },
    currentBatch() {
      return (this.batches.filter((b) => b.value === this.currentBatchKey)[0] || { text: 'chargement' }).text
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
  components: { PredictionWidget, Spinner, Help },
  name: 'Prediction',
}
</script>

<style scoped>
#nodata {
  width: 80%;
  max-width: 100%;
  height: 400px;
  margin: 200px 10%;
  position: absolute;
  vertical-align: middle;
  text-align: center;
  font-size: 24px;
}
.thin {
  height: 25px;
}
.rotate {
  -webkit-animation: spin 4s linear infinite;
  -moz-animation: spin 4s linear infinite;
  animation: spin 4s linear infinite;
}
@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
::v-deep .v-list__tile__action {
  min-width: 46px;
}
::v-deep .v-list__tile {
  padding-right: 8px;
}
</style>
