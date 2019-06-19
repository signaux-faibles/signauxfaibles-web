<template>
<div id='#detection'>
  <v-toolbar
    height="35px"
    class="toolbar elevation-12"
    color="#ffffff"
    extension-height="48px"
    app
  >
    <v-icon
      @click="leftDrawer=!leftDrawer"
      class="fa-rotate-180"
      v-if="!leftDrawer"
      color="#ffffff"
      key="toolbar"
    >
      mdi-backburger
    </v-icon>

    <div style="width: 100%; text-align: center;" class="toolbar_titre">
      Détection - {{ currentBatch }}
    </div>
    <v-spacer></v-spacer>
    <v-icon
    :class="loading?'rotate':''"
    color="#ffffff" v-if="!rightDrawer" @click="rightDrawer=!rightDrawer">mdi-target</v-icon>
  </v-toolbar>
  <span style="visibility: hidden; position:absolute;">{{ detectionLength }} {{ predictionLength }} {{ prediction.length }}</span>
  <div style="width:100%">
    <Spinner v-if="loading"/>
    <div id="nodata">
      <img v-if="!loading && prediction.length == 0" src="@/assets/nodata.png">
    </div>
    <v-navigation-drawer :class="(rightDrawer?'elevation-6':'') + ' rightDrawer'" transition="no-transition" v-model="rightDrawer" right app>
      <v-toolbar flat class="transparent" height="40">
        <v-icon :class="loading?'rotate':''" @click="rightDrawer=!rightDrawer">mdi-target</v-icon>
      </v-toolbar>
      <div style="width: 100%; padding: 0 15px;">
          <v-select
            :items="batches"
            v-model="currentBatchKey"
            @change="getPrediction"
            label="Liste de détection"
          ></v-select>
      </div>
      <p style="height: 1px; border: 1px solid #eee"/>
      <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;" >
        <v-icon style="margin-right: 10px;">fa-industry</v-icon>
        <v-select
          :items="naf1"
          v-model="currentNaf"
          label="Secteur d'activité"
        ></v-select>
      </div>
      <p style="height: 1px; border: 1px solid #eee"/>
      <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;" >
        <v-icon style="margin-right: 10px;">fa-map</v-icon>
        <v-select
          :items="subzones"
          v-model="zone"
          label="Zone Géographique"
          @change="updatePrediction()"
        ></v-select>
      </div>
      <p style="height: 1px; border: 1px solid #eee"/>
      <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;" >
        <v-icon style="margin-right: 10px;">fa-users</v-icon>
        <v-select
          :items="effectifClass"
          v-model="minEffectif"
          label="Effectif minimum"
        ></v-select>
      </div>
      <p style="height: 1px; border: 1px solid #eee"/>
      <!-- <v-radio-group
      multiple
      style="padding: 0 15px"
      v-model="connu"
      >
        <v-radio label="Non suivies" :value="false"></v-radio>
        <v-radio label="Suivies" :value="true"></v-radio>
        <v-radio label="Toutes" :value="null"></v-radio>
      </v-radio-group> -->

      <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;" >
        <v-select
          v-model="filters"
          :items="filtersItems"
          item-text="text"
          item-value="value"
          label="Visibilité"
          multiple
          chips
          deletable-chips
        >
          <!-- <template v-slot:selection="{ item, index }">
            <v-chip close>
              <span>{{ item.value }}</span>
            </v-chip>
          </template> -->
        </v-select>
      </div>

      <p style="height: 1px; border: 1px solid #eee"/>
      <!-- <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;" >
        <v-checkbox
          disabled
          label="Activité partielle"
          v-model="activitePartielle">
        </v-checkbox>
      </div>
      <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;" >
        <v-checkbox
          disabled
          label="Sans dette Urssaf"
          v-model="interetUrssaf">
        </v-checkbox>
      </div> -->
      <!-- <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;">
        
      </div> -->
    </v-navigation-drawer>
  </div>
  <PredictionWidget v-for="p in predictionCrop" :key="p.key.siret" :prediction="p"/> 


  <div style="width: 100%; text-align: center" v-if="predictionCrop.length > 0">
    
      <v-btn @click="predictionLength += 100">suite</v-btn>
    
  </div>

</div>
</template>

<script>
import Spinner from '@/components/Spinner'
import PredictionWidget from '@/components/PredictionWidget'
export default {
  data() {
    return {
      effectifClass: [10, 20, 50, 100],
      prediction: [],
      predictionLength: 30,
      currentNaf: 'C',
      minEffectif: 20,
      connu: false,
      horsCCSF: true,
      horsProcol: true,
      loading: false,
      activitePartielle: false,
      interetUrssaf: false,
      zone: [],
      filters: [],
      filtersItems: [
        {text: 'CVAP/Codefi/CRP', value: 'crp'},
        // {text: 'Suivi Signaux Faibles', value: 'sf'},
        {text: 'RJ/LJ', value: 'procol'},
        {text: 'Plan de Continuation', value: 'continuation'},
      ],
    }
  },
  mounted() {
    this.$store.dispatch('refreshSession')
    this.$store.dispatch('updateReference')
    this.getPrediction()
  },
  methods: {
    getPrediction() {
      if (this.$store.state.currentBatchKey != null) {
        const params = {
          key: {
            type: 'detection',
            batch: this.$store.state.currentBatchKey,
          },
        }
        this.loading = true
        const self = this
        this.$axios.post('/data/get/public', params).then((response) => {
          self.prediction = response.data.sort((p1, p2) => {return (p1.value.score < p2.value.score)?1:-1})
          self.loading = false
        }).catch((error) => {
          self.prediction = []
        }).finally(() => {
          self.loading = false
        })
      } else {
        window.setTimeout(this.getPrediction, 100)
      }
    },
  },
  computed: {
    predictionCrop() {
      if (this.naf) {
        return this.prediction.filter((p) => {
          return this.currentNaf === this.naf.n5to1[p.value.activite]
          && (this.zone.includes(p.value.departement) || this.zone.length === 0)
          && (p.value.connu === false || this.filters.includes('crp'))
          && (['in_bonis', 'sauvegarde', 'plan_sauvegarde']
            .includes(p.value.etat_procol) || this.filters.includes('procol'))
          && (!['continuation'].includes(p.value.etat_procol) || this.filters.includes('continuation'))
          && (p.value.dernier_effectif > this.minEffectif)
        }).slice(0, this.predictionLength)
      } else {
        return []
      }
    },
    leftDrawer: {
      get() {
        return this.$store.state.leftDrawer
      },
      set(drawer) {
        this.$store.dispatch('setLeftDrawer', drawer)
      },
    },
    suiviQuery() {
      if (this.suivi === 'false') {
        return false
      } else if (this.suivi === 'true') {
        return true
      } else {
        return undefined
      }
    },
    naf() {
      return (this.$store.getters.naf(this.$store.state.currentBatchKey) || { value: [] }).value
    },
    naf1() {
      return Object.keys((this.naf || {n1: {}}).n1).map((n) => {
        return {
            text: this.naf.n1[n].substring(0, 60),
            value: n,
        }
      })
    },
    batches() {
      return this.$store.getters.batches
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
        this.$store.commit('setCurrentBatchKey', value)
      },
    },
    subzones() {
      let all = [
        {
          text: 'Toute zone',
          value: [],
        },
      ]
      const region = this.$store.state.region
        .filter((r) => r.key.batch === this.currentBatchKey)
        .map((r) => {
          return {
            text: r.key.region,
            value: r.value.departements,
          }
      })

      all = all.concat(region)
      if (this.$store.state.departements.length > 0) {
        const departement = Object.keys(this.$store.state.departements[0].value).map((d) => {
          return {
            text: this.$store.state.departements[0].value[d],
            value: [d],
          }
        })
        all = all.concat(departement)
      }

      return all
    },
    currentBatch() {
      return (this.batches.filter((b) => b.value === this.currentBatchKey)[0] || {text: 'chargement'}).text
    },
    detectionLength() {
      const length = Math.round((this.height + this.scrollTop) / 860 + 5) * 10
      if (length > this.predictionLength) {
        // const complement = length - this.predictionLength
        // this.getPrediction(complement, this.predictionLength)
      }
      return length
    },
  },
  components: { PredictionWidget, Spinner },
  name: 'Prediction',
}
</script>

<style scoped>
#nodata {
  width: 100%;
  position: absolute;
  vertical-align: middle;
  text-align: center;
}
.rotate {
    -webkit-animation:spin 4s linear infinite;
    -moz-animation:spin 4s linear infinite;
    animation:spin 4s linear infinite;
}
@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
</style>
