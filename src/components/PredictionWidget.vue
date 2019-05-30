<template>
  <div>
    <v-card
      @click="showEtablissement()"
      style="height: 80px; background: linear-gradient(#fff, #eee 45%, #ccc);"
      class="elevation-2 ma-2 pointer"
    >
      <div style="height: 100%; width: 100%; overflow: hidden;">
        <div class="entete pointer">
          <PredictionWidgetScore id="widget" :prob="prediction.value.prob" :diff="prediction.value.diff"/>
        </div>
        
        <div class="corps">
          <div style="left: 250px; position: absolute; overflow: hidden;" :id="'marge_' + prediction.key.siret"></div>
          <div style="white-space: nowrap; overflow: hidden; max-width: 400px; max-height:40px">
            <span style="font-size: 28px; color: #333; line-height: 40px; display: inline-block; font-family: 'Oswald'; max-width: '100px'">
              {{ prediction.value.raison_sociale }} 
            </span>
          </div>
          <span style="font-family: 'Abel'; font-size: 17px; overflow: hidden; font-weight: 400;">
            {{ prediction.value.departement }} - {{ (naf.n5 || {})[prediction.value.activite || ''] }}
          </span>
          <v-img
            style="position: absolute; left: 550px; top: 10px;"
            width="70"
            :src="'/static/' + (prediction.value.urssaf?'red':'gray') + '_urssaf.svg'"
          ></v-img>

          <v-img
            style="position: absolute; left: 550px; bottom: 10px;"
            width="18"
            height="24"
            :src="'/static/' + (prediction.value.apart?'red':'gray') + '_apart.svg'"
          ></v-img>

          <div style="position: absolute; overflow: hidden; left: 584px; bottom: 3px; color: #333">
            <span
              style="font-size: 24px"
            >{{ prediction.value.dernier_effectif || 'n/c' }}</span>
          </div>

          <div class="flex" style="position:absolute; overflow: hidden; left: 600px; top: 0px; bottom: 0px; right: 9px;">
            <div class='label'>
              Chiffre d'affaire<br/>
              <span style="font-size: 25px" :class="diane.ca_color">{{ diane.ca || "n/c" }}</span>
            </div>
          </div>
          <div style="position:absolute; overflow: hidden; left: 780px; top: 42px">
            <v-icon small v-if="diane.ca_arrow">{{ diane.ca_arrow }}</v-icon>
          </div>
          <div class="flex" style="position:absolute; overflow: hidden; left: 750px; top: 0px; bottom: 0px; right: 9px;">
            <div class='label'>
              Résultat d'exploitation<br/>
              <span style="font-size: 25px" :class="diane.resultat_expl_color">{{ diane.resultat_expl }}</span>
            </div>
          </div>
        </div> 
         <v-dialog  lazy fullscreen v-model="dialog">
          <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
            <v-toolbar fixed class="toolbar" height="35px" style="color: #fff; font-size: 22px;">
              <v-spacer/>
                ETABLISSEMENT
              <v-spacer/>
              <v-icon @click="dialog=false;" style="color: #fff">mdi-close</v-icon>
            </v-toolbar>
            <Etablissement :siret="prediction.key.siret" :batch="currentBatchKey"></Etablissement>
          </div>
        </v-dialog>
      </div>  
    </v-card>
  </div>
</template>

<script>
import Etablissement from '@/components/Etablissement'
import PredictionWidgetScore from '@/components/PredictionWidgetScore'

export default {
  props: ['prediction'],
  components: {
    PredictionWidgetScore,
    Etablissement,
  },
  data() {
    return {
      dialog: false,
      expand: false,
      rowsPerPageItems: [4, 8, 12],
      pagination: {
        rowsPerPage: 4,
      },
    }
  },
  computed: {
    naf() {
      return this.$store.state.naf[0] ? this.$store.state.naf[0].value : {}
    },
    currentBatchKey() {
      return this.$store.state.currentBatchKey
    },
    diane() {
      return {
        ca: this.prediction.value.ca ? this.prediction.value.ca + ' k€' : 'n/c',
        ca_arrow: (this.prediction.value.variation_ca || 1) > 1.05 ? 'mdi-arrow-top-right' :
          (this.prediction.value.variation_ca || 1) < 0.95 ? 'mdi-arrow-bottom-right' : null,
        ca_color: this.prediction.value.ca ? '' : 'unknown',
        resultat_expl: this.prediction.value.resultat_expl ? this.prediction.value.resultat_expl + ' k€' : 'n/c',
        resultat_expl_color: this.prediction.value.resultat_expl ?
          (this.prediction.value.resultat_expl < 0 ? 'down' : null) : 'unknown',
      }
    },
  },
  methods: {
    upOrDown(before, after, treshold) {
      if (before == null || after == null) {
        return 'mdi-help-circle'
      }
      if (after / before > 1 + treshold) {
        return 'mdi-arrow-up'
      }
      if (after / before < 1 - treshold) {
        return 'mdi-arrow-down'
      }
      return 'mdi-tilde'
    },
    upOrDownClass(before, after, treshold) {
      if (before == null || after == null) {
        return 'unknown'
      }
      if (after / before > 1 + treshold) {
        return 'high'
      }
      if (after / before < 1 - treshold) {
        return 'down'
      }
      return 'none'
    },
    showEtablissement() {
      this.dialog = true
    },
  },
}
</script>

<style scoped>
div.flex {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
  font-family: "Quicksand"
}
div.label {
  text-align: right;
  font-family: 'Abel';
  width: 180px;
}
div.entete {
  float: left;
  background: linear-gradient(
    270deg,
    rgba(119, 122, 170, 0.219),
    rgba(119, 122, 170, 0)
  );
  border-right: solid 1px #3334;
  width: 80px;
  height: 80px;
  text-align: center;
  padding: 20px;
}
div.corps {
  flex: 1;
  padding: 5px;
  margin-left: 80px;
  height: 80px;
  background: linear-gradient(45deg, rgba(50, 51, 121, 0.212), #0000);
}
.high {
  color: rgb(4, 153, 41);
}
.down {
  color: rgb(244, 67, 54);
}
.unknown {
  color: rgb(150, 150, 150);
}
td {
  width: 80px;
}
.pointer {
  cursor: pointer;
}
</style>
