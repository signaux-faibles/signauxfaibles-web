<template>
  <div id="#detection" ref="detection">
    <v-toolbar
      height="35px"
      class="toolbar elevation-12"
      color="#ffffff"
      extension-height="48px"
      app
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
        <Help ref="modelHelp" titre="Modèle de détection" :dark="true" :big="true">
          <template>
            <div>
              <p>
                Le modèle de détection a évolué ! Vous apprendrez ici l’essentiel sur ce nouveau modèle.
              </p>
              <p>
                <b>Quel est le périmètre de détection ?</b><br>
                Provisoirement, le nouveau modèle ne tourne que sur les entreprises industrielles de plus de 20 et moins de 400 salariés, et dont on a accès aux informations bilancielles en 2018 ou 2019. Ce périmètre restreint a pour but de tester la pertinence du modèle avant de travailler à son extension à d’autres secteurs.
              </p>
              <p>
                <b>Comment fonctionne le nouveau modèle ?</b><br>
                Le nouveau modèle est un modèle à variables latentes, c’est-à-dire qui évalue séparément différents aspects de l’entreprise et agrège ces scores intermédiaires pour former un score final. Ensuite, selon le score final, deux niveaux d’alertes sont définis.<br>
                Les variables latentes utilisées dans ce modèle sont les suivantes : endettement de l’entreprise, endettement court terme de l’entreprise, rentabilité, type d’entreprise (taille, région, âge, secteur), santé du secteur d’activité (avec prise en compte de la crise COVID), dettes sur les cotisations sociales (idem).
                </p>
              <p>
                <b>Pourquoi une entreprise particulière a-t-elle été détectée ?</b><br>
                Contrairement au modèle précédent, la détection ne peut pas être interprétée comme une forte probabilité de défaillance à 18 mois, car du fait de la crise, le comportement de défaillances des entreprises est pour l’instant une inconnue. Les entreprises ont donc simplement été classées du profil « le plus à risque » au « moins à risque ».<br>
                L’avantage du modèle à variables latentes est qu’il fournit en même temps que la prédiction des éléments explicatifs (les variables latentes). Ces éléments ne sont malheureusement pas encore disponibles pour l’utilisateur mais ont vocation à être partagés dans une mise-à-jour prochaine, patience !
              </p>
              <p>
                <b>Puis-je faire confiance au modèle ?</b><br>
                Il s’agit des premiers résultats de ce nouveau modèle, qui sont distribués à titre expérimental. De ce fait, la fiabilité des résultats, malgré nos vérifications statistiques, doit encore être confirmée sur le terrain. Il est donc important d’effectuer une analyse experte des données de l’entreprise pour confirmer la détection du modèle.<br>
                Pour la même raison, les détections sont susceptibles de varier d’une liste à la suivante, et la stabilité dans le temps des détections n’est donc pas assurée.
              </p>
              <p>
                Vous voyez une anomalie ? Vous avez d’autres questions ? Contactez-nous par email :
                <a class="d-block mt-2 text-xs-center" href="mailto:contact@signaux-faibles.beta.gouv.fr?subject=Questions sur le modèle de détection" target="_blank"><code>contact@signaux-faibles.beta.gouv.fr</code></a>
              </p>
            </div>
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
    </v-toolbar>
    <div style="width:100%">
      <div
        id="nodata"
        v-if="!loading && prediction.length == 0 && init==false"
      >Les paramètres de filtrage ne font ressortir aucune des entreprises pour lesquelles vous êtes habilité(e).</div>
      <v-navigation-drawer
        :class="(rightDrawer?'elevation-6':'') + ' rightDrawer'"
        transition="no-transition"
        v-model="rightDrawer"
        right
        app
      >
        <v-toolbar flat class="transparent" height="40">
          <v-icon :class="loading?'rotate':''" @click="closeRightDrawer()">mdi-target</v-icon>
        </v-toolbar>
        <div class="mt-2" style="width: 100%; padding: 0 15px;">
          <v-select
            :items="batches"
            :disabled="loading"
            v-model="currentBatchKey"
            @change="getPrediction"
            label="Liste de détection"
          ></v-select>
        </div>
        <p style="height: 1px; border: 1px solid #eee" />
        <div style="vertical-align: middle; padding: 0 15px;">
          <v-icon style="margin-right: 10px;">fa-industry</v-icon>
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
                :disabled="loading"
                v-on="on"
                @click="copyNaf()"
                outline
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
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon
                        style="cursor: pointer"
                        @click="selectAllNaf()"
                      >{{ allNextNaf ? 'mdi-close-box' : someNextNaf ? 'mdi-minus-box' : 'mdi-checkbox-blank-outline' }}</v-icon>
                    </v-list-tile-action>{{ !allNextNaf ? 'Tout sélectionner' : 'Tout désélectionner' }}
                    <v-list-tile-content></v-list-tile-content>
                  </v-list-tile>
                  <v-divider />
                  <v-list-tile v-for="n in naf1" :key="n.value">
                    <v-list-tile-action @click="toggleNaf(n.value)">
                      <v-icon style="cursor: pointer;">
                        {{ nextNaf.includes(n.value) ?
                        'mdi-checkbox-marked' :
                        'mdi-checkbox-blank-outline'
                        }}
                      </v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>{{ n.text }}</v-list-tile-content>
                  </v-list-tile>
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
        <p style="height: 1px; border: 1px solid #eee" />
        <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;">
          <v-icon style="margin-right: 10px;">fa-map</v-icon>
          <v-select
            :items="subzones"
            :disabled="loading"
            v-model="zone"
            label="Zone Géographique"
            @change="getPrediction()"
          ></v-select>
        </div>
        <v-checkbox :disabled="loading" v-model="ignorezone" class="mx-2 mt-1" label="Inclure tous les établissements des entreprises de ma zone" @change="getPrediction()"></v-checkbox>
        <p style="height: 1px; border: 1px solid #eee" />
        <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;">
          <v-icon style="margin-right: 10px;">fa-users</v-icon>
          <v-combobox
            v-model="minEffectif"
            :disabled="loading"
            :items="effectifClass"
            label="Effectif minimum"
            @change="getPrediction()"
          ></v-combobox>
        </div>
        <p style="height: 1px; border: 1px solid #eee"/>
        <div
          style="display: flex; flex-direction: column; vertical-align: middle; padding: 0 15px;"
        >
          <span
            style="font-size: 15px;"
            @change="getPrediction()"
          >Visibilité selon statut des procédures</span>
          <v-switch
            :disabled="loading"
            v-model="in_bonis"
            class="mx-2 thin"
            @change="getPrediction()"
          >
            <span slot="label" style="font-size: 14px">In bonis</span>
          </v-switch>
          <v-switch
            :disabled="loading"
            v-model="continuation"
            class="mx-2 thin"
            @change="getPrediction()"
          >
            <span slot="label" style="font-size: 14px">In bonis (plan de continuation)</span>
          </v-switch>
          <v-switch
            :disabled="loading"
            v-model="sauvegarde"
            class="mx-2 thin"
            @change="getPrediction()"
          >
            <span slot="label" style="font-size: 14px">Sauvegarde</span>
          </v-switch>
          <v-switch
            :disabled="loading"
            v-model="plan_sauvegarde"
            class="mx-2 thin"
            @change="getPrediction()"
          >
            <span slot="label" style="font-size: 14px">Plan de sauvegarde</span>
          </v-switch>
          <v-switch :disabled="loading" v-model="rj" class="mx-2 thin" @change="getPrediction()">
            <span slot="label" style="font-size: 14px">Redressement judiciaire</span>
          </v-switch>
          <v-switch :disabled="loading" v-model="lj" class="mx-2 thin" @change="getPrediction()">
            <span slot="label" style="font-size: 14px">Liquidation judiciaire</span>
          </v-switch>
        </div>
        <p style="height: 1px; border: 1px solid #eee; margin-top: 20px" />
        <span class="ml-3" style="color: rgba(0,0,0,0.54); font-size: 13px;">Siège des entreprises</span>
        <v-checkbox :disabled="loading" v-model="siegeUniquement" class="mx-2 mt-1" label="N'afficher que les sièges des entreprises" @change="getPrediction()"></v-checkbox>
        <p style="height: 1px; border: 1px solid #eee;" />
        <span class="ml-3" style="color: rgba(0,0,0,0.54); font-size: 13px;">Suivi d'établissements</span>
        <v-checkbox :disabled="loading" v-model="exclureSuivi" class="mx-2 mt-1" label="Exclure mes établissements suivis" @change="getPrediction()"></v-checkbox>
        <p style="height: 1px; border: 1px solid #eee" />
      </v-navigation-drawer>
    </div>
    <v-card
      style="height: 80px; text-align: center; vertical-align: top; background-color: #FFF0; position:"
      class="elevation-0 ma-2 pointer"
    >
      <v-container style="position: relative; top: -10px">
        <v-layout row>
          <v-flex xs12 md6>
            <v-text-field v-model="filter" @input="getPrediction" solo label="Filtre rapide par raison sociale ou SIRET" />
          </v-flex>
          <v-flex xs12 md6 style="line-height: 53px;">
            <v-icon color="red">fa-exclamation-triangle</v-icon>
            <span style="font-size: 25px">{{ predictionAlerts }}</span>
            <span style="width: 100px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <v-icon color="amber">fa-exclamation-triangle</v-icon>
            <span style="font-size: 25px;">{{ predictionWarnings }}</span>
            <v-btn outline color="indigo darken-5" @click="download" class="ml-4 mb-3">
              <v-icon small class="mr-2">fa-file-download</v-icon>
              Exporter
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <PredictionWidget v-for="p in prediction" :key="p.siret" :prediction="p" @hide-etablissement="onHideEtablissement" @follow-etablissement="followStateChanged = true" @unfollow-etablissement="followStateChanged = true"/>
    <Spinner v-if="loading" />
    <v-snackbar v-model="snackbar" :bottom="true" :timeout="0">
      Le modèle de détection a évolué !
      <v-btn color="primary" flat @click="showModelHelp()">En savoir plus</v-btn>
      <v-btn icon @click="snackbar = false"><v-icon>clear</v-icon></v-btn> 
    </v-snackbar>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'
import PredictionWidget from '@/components/PredictionWidget'
import Help from '@/components/Help'

export default {
  // TODO: right drawer in component
  data() {
    return {
      effectifClass: [10, 20, 50, 100],
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
      if (this.exclureSuivi && this.followStateChanged) {
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
        this.getPredictionPage()
      }, 500)
    },
    getPredictionPage() {
        if (!this.loading && this.currentBatchKey) {
          this.loading = true
          this.errorOccured = false
          this.$axios.post(`/scores/liste/${this.currentBatchKey}`, this.params).then((response) => {
            if (response.status === 200) {
              this.prediction = this.prediction.concat(response.data.scores)
              this.predictionWarnings = response.data.nbF2
              this.predictionAlerts = response.data.nbF1
            } else if (response.status === 204) {
              this.complete = true
            } else {
              this.errorOccured = true
            }
          }).catch((error) => {
            this.errorOccured = true
          }).finally(() => {
            this.init = false
            this.loading = false
            this.page += 1
            this.followStateChanged = false
          })
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
      if (this.zone.length > 0) {
        params.zone = this.zone
      }
      params.effectifMin = parseInt(this.minEffectif, 10)
      if (this.ignorezone) {
        params.ignorezone = this.ignorezone
      }
      params.procol = []
      if (this.rj) {
        params.procol = params.procol.concat(['redressement', 'plan_redressement'])
      }
      if (this.lj) {
        params.procol = params.procol.concat(['liquidation'])
      }
      if (this.sauvegarde) {
        params.procol = params.procol.concat(['sauvegarde'])
      }
      if (this.plan_sauvegarde) {
        params.procol = params.procol.concat(['plan_sauvegarde'])
      }
      if (this.continuation) {
        params.procol = params.procol.concat(['continuation'])
      }
      if (this.in_bonis) {
        params.procol = params.procol.concat(['in_bonis'])
      }
      if (this.exclureSuivi) {
        params.exclureSuivi = this.exclureSuivi
      }
      if (this.siegeUniquement) {
        params.siegeUniquement = this.siegeUniquement
      }
      if (this.filter || '' !== '') {
        params.filter = this.filter
      }
      params.page = this.page
      return params
    },
    siegeUniquement: {
      get() { return this.$localStore.state.siegeUniquement },
      set(value) { this.$localStore.commit('setsiegeUniquement', value) },
    },
    exclureSuivi: {
      get() { return this.$localStore.state.exclureSuivi },
      set(value) { this.$localStore.commit('setexclureSuivi', value) },
    },
    ignorezone: {
      get() { return this.$localStore.state.ignorezone },
      set(value) { this.$localStore.commit('setignorezone', value) },
    },
    rj: {
      get() { return this.$localStore.state.rj },
      set(value) { this.$localStore.commit('setrj', value) },
    },
    lj: {
      get() { return this.$localStore.state.lj },
      set(value) { this.$localStore.commit('setlj', value) },
    },
    continuation: {
      get() { return this.$localStore.state.continuation },
      set(value) { this.$localStore.commit('setcontinuation', value) },
    },
    sauvegarde: {
      get() { return this.$localStore.state.sauvegarde },
      set(value) { this.$localStore.commit('setsauvegarde', value) },
    },
    plan_sauvegarde: {
      get() { return this.$localStore.state.plan_sauvegarde },
      set(value) { this.$localStore.commit('setplan_sauvegarde', value) },
    },
    in_bonis: {
      get() { return this.$localStore.state.in_bonis },
      set(value) { this.$localStore.commit('setin_bonis', value) },
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
</style>
