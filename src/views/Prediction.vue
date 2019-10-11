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
    <div id="nodata" v-if="!loading && prediction.length == 0 && init==false">
      <!-- <img v-if="!loading && prediction.length == 0 && init==false" src="@/assets/nodata.png"><br> -->
      Les paramètres de filtrage ne font ressortir aucune des entreprises pour lesquelles vous êtes habilité.
    </div>
    <v-navigation-drawer :class="(rightDrawer?'elevation-6':'') + ' rightDrawer'" transition="no-transition" v-model="rightDrawer" right app>
      <v-toolbar flat class="transparent" height="40">
        <v-icon :class="loading?'rotate':''" @click="rightDrawer=!rightDrawer">mdi-target</v-icon>
      </v-toolbar>
      <div style="width: 100%; padding: 0 15px;">
          <v-select
            :items="batches"
            :disabled="loading"
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
          :disabled="loading"
          v-model="currentNaf"
          label="Secteur d'activité"
          @change="getPrediction()"
        ></v-select>
      </div>
      <p style="height: 1px; border: 1px solid #eee"/>
      <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;" >
        <v-icon style="margin-right: 10px;">fa-map</v-icon>
        <v-select
          :items="subzones"
          :disabled="loading"
          v-model="zone"
          label="Zone Géographique"
          @change="getPrediction()"
        ></v-select>
      </div>
      <p style="height: 1px; border: 1px solid #eee"/>
      <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;" >
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

      <div style="display: flex; flex-direction: column; vertical-align: middle; padding: 0 15px;" >
        <span style="font-size: 15px;" @change="getPrediction()">Établissements visibles</span>
        <v-switch v-model="crp" class="mx-2 thin" label="Suivi CVAP/Codefi/CRP" @change="getPrediction()"></v-switch>
        <v-switch v-model="procol" class="mx-2 thin" label="RJ/LJ" @change="getPrediction()"></v-switch>
        <v-switch v-model="plan_continuation" class="mx-2 thin" label="Plan de continuation" @change="getPrediction()"></v-switch>
        <v-switch v-model="sauvegarde" class="mx-2 thin" label="Sauvegarde" @change="getPrediction()"></v-switch>
        <v-switch v-model="plan_sauvegarde" class="mx-2 thin" label="Plan de sauvegarde" @change="getPrediction()"></v-switch>
        <v-switch v-model="in_bonis" class="mx-2 thin" label="In bonis" @change="getPrediction()"></v-switch>
      </div>

      <p style="height: 1px; border: 1px solid #eee"/>
    </v-navigation-drawer>
  </div>
  <v-card
    style="height: 50px; text-align: center; background-color: #FFF0; padding: 7px;"
    class="elevation-0 ma-2 pointer"
  >
    <v-icon color="red">fa-exclamation-triangle</v-icon> 
    <span style="font-size: 25px">{{ predictionAlerts }}</span>
    <span style="width: 100px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <v-icon color="amber">fa-question</v-icon> 
    <span style="font-size: 25px;">{{ predictionWarnings }}</span>
  </v-card>
  <PredictionWidget v-for="p in prediction" :key="p.key.siret" :prediction="p"/> 

</div>
</template>

<script>
import Spinner from '@/components/Spinner'
import PredictionWidget from '@/components/PredictionWidget'
export default {
  data() {
    return {
      effectifClass: [10, 20, 50, 100],
      predictionLength: 20,
      connu: false,
      horsCCSF: true,
      horsProcol: true,
      activitePartielle: false,
      interetUrssaf: false,
      init: true,
    }
  },
  mounted() {
    this.getPrediction()
  },
  methods: {
    getPrediction() {
      if (!this.loading) {
        this.prediction = []
        if (this.$store.state.currentBatchKey != null) {
          const params = {
            key: {
              type: 'detection',
              batch: this.$store.state.currentBatchKey,
            },
            limit: this.predictionLength,
            filter: [{
              field: 'effectif',
              operator: '>=',
              value: parseInt(this.minEffectif, 10),
            }],
            sort: [{
              field: 'score',
              order: -1,
            }],
          }
          if (this.currentNaf !== 'NON') {
            params.filter = params.filter.concat([{
              field: 'naf1',
              operator: '=',
              value: this.currentNaf,
            }])
          }
          if (this.zone.length > 0) {
            params.filter = params.filter.concat([{
              field: 'zone',
              operator: 'in',
              value: this.zone,
            }])
          }
          if (!this.crp) {
            params.filter = params.filter.concat([{
              field: 'crp',
              operator: '=',
              value: false,
            }])
          }
          if (!this.procol) {
            params.filter = params.filter.concat([{
              field: 'procol',
              operator: 'not in',
              value: ['redressement', 'plan_redressement', 'liquidation'],
            }])
          }

          if (!this.sauvegarde) {
            params.filter = params.filter.concat([{
              field: 'procol',
              operator: 'not in',
              value: ['sauvegarde'],
            }])
          }

          if (!this.plan_sauvegarde) {
            params.filter = params.filter.concat([{
              field: 'procol',
              operator: 'not in',
              value: ['plan_sauvegarde'],
            }])
          }

          if (!this.continuation) {
            params.filter = params.filter.concat([{
              field: 'procol',
              operator: 'not in',
              value: ['continuation'],
            }])
          }

          if (!this.in_bonis) {
            params.filter = params.filter.concat([{
              field: 'procol',
              operator: 'not in',
              value: ['in_bonis'],
            }])
          }

          this.loading = true
          const self = this
          this.$axios.post('/data/cache/public', params).then((response) => {
            self.prediction = response.data.sort((p1, p2) => (p1.value.score < p2.value.score) ? 1 : -1)
            self.loading = false
          }).catch((error) => {
            self.prediction = []
          }).finally(() => {
            self.init = false
            self.loading = false
          })
        } else {
          window.setTimeout(this.getPrediction, 100)
        }
      }
    },
  },
  computed: {
    crp: {
      get() {return this.$localStore.state.crp},
      set(value) {this.$localStore.commit('setcrp', value)},
    },
    procol: {
      get() {return this.$localStore.state.procol},
      set(value) {this.$localStore.commit('setprocol', value)},
    },
    plan_continuation: {
      get() {return this.$localStore.state.plan_continuation},
      set(value) {this.$localStore.commit('setplan_continuation', value)},
    },
    sauvegarde: {
      get() {return this.$localStore.state.sauvegarde},
      set(value) {this.$localStore.commit('setsauvegarde', value)},
    },
    plan_sauvegarde: {
      get() {return this.$localStore.state.plan_sauvegarde},
      set(value) {this.$localStore.commit('setplan_sauvegarde', value)},
    },
    in_bonis: {
      get() {return this.$localStore.state.in_bonis},
      set(value) {this.$localStore.commit('setin_bonis', value)},
    },
    currentNaf: {
      get() {return this.$localStore.state.currentNaf},
      set(value) {this.$localStore.commit('setcurrentNaf', value)},
    },
    zone: {
      get() {return this.$localStore.state.zone},
      set(value) {this.$localStore.commit('setzone', value)},
    },
    minEffectif: {
      get() {return this.$localStore.state.minEffectif},
      set(value) {this.$localStore.commit('setminEffectif', value)},
    },
    prediction: {
      get() {return this.$store.state.prediction},
      set(value) {this.$store.commit('setPrediction', value)},
    },
    loading: {
      get() {return this.$store.state.loading},
      set(value) {this.$store.commit('setLoading', value)},
    },
    predictionAlerts() {
      return this.prediction.filter((p) => (p.value.alert === 'Alerte seuil F1')).length
    },
    predictionWarnings() {
      return this.prediction.filter((p) => (p.value.alert === 'Alerte seuil F2')).length
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
      return [{text: 'Tout secteur confondu', value: 'NON'}]
        .concat(Object.keys((this.naf || {n1: {}}).n1).map((n) => {
        return {
            text: this.naf.n1[n].substring(0, 60),
            value: n,
        }
      }))
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
      const region = this.$store.state.region
        .filter((r) => r.key.batch === this.currentBatchKey)
        .map((r) => {
          return {
            text: r.key.region,
            value: r.value.departements,
          }
      }).sort((r1, r2) => r1.text > r2.text)

      all = all.concat(region)
      if (this.$store.state.departements.length > 0) {
        const departement = Object.keys(this.$store.state.departements[0].value).map((d) => {
          return {
            text: d + ' ' + this.$store.state.departements[0].value[d],
            value: [d],
          }
        }).sort((a, b) => a.value[0] > b.value[0])
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
  width: 80%;
  max-width: 100%;
  height: 400px;
  margin: 200px 10%;
  position: absolute;
  vertical-align: middle;
  text-align: center;
  font-size: 40px;
}
.thin {
  height: 25px;
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
