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
    <v-navigation-drawer :class="(rightDrawer?'elevation-6':'') + 'rightDrawer'" v-model="rightDrawer" right app>
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
      <v-radio-group
      style="padding: 0 15px"
      v-model="connu"
      >
        <v-radio label="Non suivies" :value="false"></v-radio>
        <v-radio label="Suivies" :value="true"></v-radio>
        <v-radio label="Toutes" :value="null"></v-radio>
      </v-radio-group>
      <p style="height: 1px; border: 1px solid #eee"/>
      <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;" >
        <v-checkbox
          label="Activité partielle"
          v-model="activitePartielle">
        </v-checkbox>
      </div>
      <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;" >
        <v-checkbox
          label="Sans dette Urssaf"
          v-model="interetUrssaf">
        </v-checkbox>
      </div>
      <!-- <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;">
        
      </div> -->
    </v-navigation-drawer>
  </div>

  <PredictionWidget v-for="p in predictionCrop" :key="p.key.siret" :batch="currentBatchKey" :prediction="p"/> 

</div>
</template>

<script>
import PredictionWidget from '@/components/PredictionWidget'
export default {
  data() {
    return {
      effectifClass: [10, 20, 50, 100],
      prediction: [],
      predictionLength: 100,
      currentNaf: 'C',
      minEffectif: 20,
      connu: false,
      horsCCSF: true,
      horsProcol: true,
      loading: false,
      activitePartielle: false,
      interetUrssaf: false,
      zone: ['21', '25', '39', '58', '70', '71', '89', '90'],
      subzones: [
        {
          text: 'Région entière',
          value: ['21', '25', '39', '58', '70', '71', '89', '90'],
        },
        {
          text: 'Bourgogne',
          value: ['21', '58', '71', '89'],
        },
        {
          text: 'Franche Comté',
          value: ['25', '39', '70', '90'],
        },
        {
          text: 'Côte d\'or',
          value: ['21'],
        },
        {
          text: 'Doubs',
          value: ['25'],
        },
        {
          text: 'Jura',
          value: ['39'],
        },
        {
          text: 'Nièvre',
          value: ['58'],
        },
        {
          text: 'Haute-Saône',
          value: ['70'],
        },
        {
          text: 'Saône-et-Loire',
          value: ['71'],
        },
        {
          text: 'Yonne',
          value: ['89'],
        },
        {
          text: 'Territoire de Belfort',
          value: ['90'],
        },
      ],
    }
  },
  mounted() {
    this.$store.dispatch('updateReference')
    this.getPrediction()
  },
  methods: {
    getPrediction() {
      if (this.$store.state.currentBatchKey !== '') {
        const params = {
          key: {
            type: 'detection',
            batch: this.$store.state.currentBatchKey,
          },
        }
        this.loading = true
        const self = this
        this.$axios.post('/data/get/public', params).then((response) => {
          self.prediction = response.data.sort((p1, p2) => p1.value.prob < p2.value.prob)
          self.loading = false
        }).catch((error) => {
          self.prediction = []
        }).finally(() => {
          self.loading = false
        })
      } else {
        window.setTimeout(getPrediction, 100)
      }
    },
  },
  computed: {
    predictionCrop() {
      if (this.naf) {
        return this.prediction.filter((p) => {
          return this.currentNaf === this.naf.n5to1[p.value.activite] &&
          (this.connu === p.value.connu || this.connu === null)
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
  components: { PredictionWidget },
  name: 'Browse',
}
</script>

<style scoped>

.rotate {
    -webkit-animation:spin 4s linear infinite;
    -moz-animation:spin 4s linear infinite;
    animation:spin 4s linear infinite;
}
@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
</style>
