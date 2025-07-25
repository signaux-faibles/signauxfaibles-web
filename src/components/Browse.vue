<template>
  <div>
    <Toolbar drawer title="Consultation"/>
    <div :class="((result.etablissement || []).length > 0 || searched) ? 'loaded' : 'empty'">
      <form v-on:submit.prevent="load">
        <div
          :class="((result.etablissement || []).length > 0 || searched) ? 'loaded_picto' : 'empty_picto'"
        >
          <img height="50" src="../assets/text_signaux_faibles.svg"/>
        </div>
        <v-text-field
          v-model="search"
          :disabled="loading"
          placeholder="Raison sociale ou SIREN"
          solo
        ></v-text-field>
        <v-layout style="margin-top: -16px" wrap>
          <v-flex>
            <v-checkbox v-model="siegeUniquement" :disabled="loading" class="mt-0">
              <template v-slot:label>
                <span style="font-size: 14px">N'afficher que les sièges des entreprises</span>
              </template>
            </v-checkbox>
          </v-flex>
          <v-flex shrink>
            <a @click="avance=!avance">Recherche {{ avance ? 'simple' : 'avancée' }}</a>
          </v-flex>
        </v-layout>
        <v-layout v-if="avance" wrap>
          <v-flex md4 pa-2 xs12>
            <v-subheader>Secteur d'activité</v-subheader>
            <div
              v-if="currentNaf.length == 0"
              style="color: #f00; font-weight: 600;"
            >Aucun secteur sélectionné
            </div>
            <ul v-if="!allNaf" style="font-size: 11px; text-align: left">
              <li v-for="l in currentNafLibelle.slice(0,4)" :key="l">{{ l }}</li>
            </ul>
            <div
              v-if="currentNaf.length > 4 && !allNaf"
              style="margin-left: 15px; font-size: 11px; color: #444; text-align: left"
            >+ {{ currentNaf.length - 4 }} autre{{ (currentNaf.length > 5) ? 's' : '' }}
            </div>
            <div
              v-if="allNaf"
              style="margin-left: 15px; font-size: 11px; color: #444"
            >Tout secteur confondu
            </div>
            <v-dialog v-model="nafDialog" persistent scrollable width="700">
              <template v-slot:activator="{ on }">
                <v-btn
                  :disabled="loading"
                  class="ma-3"
                  color="rgba(0,0,0,0.74)"
                  light
                  outlined
                  @click="copyNaf()"
                  v-on="on"
                >
                  <v-icon class="mr-2" small>fa-industry</v-icon>
                  selection des secteurs
                </v-btn>
              </template>
              <v-card>
                <v-toolbar color="indigo" dark dense>
                  <v-toolbar-title>Sélectionner les secteurs d'activité</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-list>
                    <v-list-item>
                      <v-list-item-action>
                        <v-icon
                          style="cursor: pointer"
                          @click="selectAllNaf()"
                        >{{ allNextNaf ? 'fa-square-xmark' : 'fa-square-plus' }}
                        </v-icon>
                      </v-list-item-action>
                      {{ !allNextNaf ? 'Tout sélectionner' : 'Vider la sélection' }}
                      <v-list-item-content></v-list-item-content>
                    </v-list-item>
                    <v-divider/>
                    <v-list-item v-for="n in naf1" :key="n.value">
                      <v-list-item-action @click="toggleNaf(n.value)">
                        <v-icon style="cursor: pointer;">
                          {{
                            nextNaf.includes(n.value) ?
                              'fa-square-check' :
                              'far fa-square'
                          }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>{{ n.text }}</v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
                <v-card-actions class="pa-2 elevation-6">
                  <v-spacer/>
                  <v-btn color="indigo" light outlined @click="nafDialog=false">annuler</v-btn>
                  <v-btn color="indigo" dark light @click="applyNaf(); nafDialog=false">appliquer</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-flex>
          <v-flex md4 pa-2 xs12>
            <v-subheader>Zone géographique</v-subheader>
            <v-select v-model="zone" :items="subzones" return-object></v-select>
          </v-flex>
          <v-flex md4 pa-2 xs12>
            <v-subheader>Effectif minimum</v-subheader>
            <v-combobox v-model="effectifMin" :items="effectifClass"></v-combobox>
          </v-flex>
        </v-layout>
        <v-btn :disabled="loading || search.trim().length < 3" style="width: 150px" type="submit">
          <v-icon>fa-magnifying-glass</v-icon>
        </v-btn>
        <v-alert
          v-if="search.length === 3 && !hasAdvancedFilters"
          dense
          type="warning"
          class="mt-2 mb-2"
        >
          Afin de réduire le délai de réponse de votre recherche, nous vous invitons à saisir plus de caractères ou à l'affiner à l'aide des filtres avancés
        </v-alert>
      </form>
    </div>
    <div v-if="searched && (!loading || page !=0)" class="numbers">
      <v-progress-circular
        v-if="loadingTotal"
        indeterminate
        size="20"
        width="2"
        color="indigo"
        class="mr-2"
      ></v-progress-circular>
      {{ total | pluralizeResultats }}
    </div>
    <Spinner v-if="loading && page === 0" style="min-height: 60vh"/>
    <PredictionWidget v-for="r in result" :key="r.siret" :prediction="r"/>
    <div v-if="loading && page > 0" class="text-center pa-4">
      <v-progress-circular
        indeterminate
        color="indigo"
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
import Toolbar from '@/components/Toolbar.vue'
import PredictionWidget from '@/components/prediction/predictionWidget.vue'
import Spinner from '@/components/Spinner.vue'

export default {
  name: 'Browse',
  components: {PredictionWidget, Toolbar, Spinner},
  data() {
    return {
      search: '',
      searched: false,
      result: [],
      total: 0,
      page: 0,
      ignorezone: true,
      ignoreroles: true,
      radios: 'geo',
      listHeight: 0,
      complete: false,
      loading: false,
      loadingTotal: false,
      errorOccured: false,
      siegeUniquement: false,
      nafDialog: false,
      nextNaf: [],
      effectifClass: [0, 10, 20, 50, 100],
      avance: false,
      currentNaf: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'],
      zone: {
        text: 'Toute zone',
        value: 'Toute zone',
      },
      effectifMin: 0,
    }
  },
  methods: {
    load() {
      this.page = 0
      this.complete = false
      this.searched = true
      this.result = []
      let eventName = this.search
      if (this.zone.text === 'Ma zone géographique') {
        eventName = eventName.concat(',etablissements_zone')
      } else if (this.zone.text === 'Toute zone') {
        eventName = eventName.concat(',france')
      } else {
        eventName = eventName.concat(',' + this.zone.text)
      }
      this.trackMatomoEvent('consultation', 'rechercher', eventName)
      this.fetchTotal()
      this.lookupPage()
    },
    fetchTotal() {
      this.loadingTotal = true
      this.$axios.post('/etablissement/search/total', this.params).then((response) => {
        if (response.status === 200) {
          this.total = response.data.total
          this.trackMatomoEvent('consultation', 'resultats_recherche', this.search, this.total)
        }
      }).catch(() => {
        this.total = 0
      }).finally(() => {
        this.loadingTotal = false
      })
    },
    lookupPage() {
      this.loading = true
      this.errorOccured = false
      this.$axios.post(this.searchURL, this.params).then((response) => {
        if (response.status === 200) {
          this.result = this.result.concat(response.data.results)
          if (response.data.results.length < 20) {
            this.complete = true
          }
          this.page += 1
        } else if (response.status === 204) {
          if (this.page === 0) {
            this.result = []
          }
          this.complete = true
        } else {
          this.errorOccured = true
        }
      }).catch((error) => {
        this.errorOccured = true
      }).finally(() => {
        this.loading = false
      })
    },
    applyNaf() {
      this.currentNaf = this.nextNaf
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
  },
  watch: {
    scrollTop() {
      this.listHeight = this.$el.getBoundingClientRect().bottom
    },
    result() {
      this.listHeight = this.$el.getBoundingClientRect().bottom
    },
    resultIsEnough() {
      if (!this.resultIsEnough) {
        this.trackMatomoEvent('consultation', 'voir_page_suivante', this.search, this.page)
        this.lookupPage()
      }
    },
  },
  computed: {
    hasAdvancedFilters() {
      return this.currentNaf.length < this.naf1.length || // Not all sectors selected
             this.zone.text !== 'Toute zone' || // Zone filter used
             this.effectifMin > 0 // Minimum workforce filter used
    },
    resultIsEnough() {
      return !this.searched || this.complete || this.loading || this.height * 2 < this.listHeight || this.errorOccured
    },
    searchURL() {
      return `/etablissement/search`
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
    params() {
      const p = {
        search: this.search,
        page: this.page,
      }
      p.activites = this.currentNaf
      if (this.zone.text === 'Ma zone géographique') {
        p.ignorezone = false
        p.ignoreroles = false
      } else if (this.zone.text === 'Toute zone') {
        p.ignorezone = true
        p.ignoreroles = true
      } else {
        p.ignorezone = true
        p.ignoreroles = true
        if (this.zone.value.length > 0) {
          p.departements = this.zone.value
        }
      }
      if (this.effectifMin > 0) {
        p.effectifMin = parseInt(this.effectifMin, 10)
      }
      if (this.siegeUniquement) {
        p.siegeUniquement = this.siegeUniquement
      }
      return p
    },
    subzones() {
      const divider = {
        divider: true,
      }
      let all = [
        {
          text: 'Toute zone',
          value: 'Toute zone',
        },
        divider,
        {
          text: 'Ma zone géographique',
          value: 'Ma zone géographique',
        },
        {...divider},
      ]
      const region = Object.keys(this.$store.state.region).map((r) => {
        return {
          text: r,
          value: this.$store.state.region[r],
        }
      }).sort((r1, r2) => r1.text > r2.text)
      all = all.concat(region)
      all.push({...divider})
      const departement = Object.keys(this.$store.state.departements).map((d) => {
        return {
          text: d + ' ' + this.$store.state.departements[d],
          value: [d],
        }
      }).sort((d1, d2) => d1.value[0] > d2.value[0])
      all = all.concat(departement)
      return all
    },
    currentNafLibelle() {
      return this.currentNaf.map((n) => {
        return this.naf1.filter((n1) => (n1.value === n))[0].text
      })
    },
    naf1() {
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
  },
  filters: {
    pluralizeResultats(count) {
      if (count === 0) {
        return 'Pas de résultat'
      } else if (count === 1) {
        return '1 résultat'
      } else if (count === 1000) {
        return 'Plus de 1000 résultats'
      } else {
        return count + ' résultats'
      }
    },
  },
}
</script>

<style scoped>
.empty {
  height: 150px;
  width: 100%;
  text-align: center;
  vertical-align: middle;
  padding: 10px 10%;
}

.empty_picto {
  margin-top: 20%;
  font-size: 40px;
  margin-bottom: 40px;
}

.loaded_picto {
  visibility: hidden;
}

.loaded {
  width: 100%;
  text-align: center;
  vertical-align: middle;
  padding: 10px 10%;
}

div.numbers {
  font-size: 25px;
  width: 100%;
  text-align: center;
}
</style>