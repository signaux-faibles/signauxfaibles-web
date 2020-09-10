<template>
  <div>
    <v-card @click="showEtablissement()" class="etablissement-card elevation-2 ma-2 pointer">
      <div class="entete">
        <ScoreWidget :prediction="prediction" />
      </div>
      <div class="corps">
        <div class="mr-2 ml-2">
          <span class="raison-sociale">{{ prediction.raison_sociale }}</span>
          <img class="ml-2" v-if="prediction.connu === true" height="20" src="../assets/crp.png" />
          <div class="identite">
            {{ prediction.siret }} -
            <span
              :class="prediction.etat_procol == 'in_bonis'?'up':'down'"
            >{{ prediction.etat_procol }}</span>
            <br />
            Dép.: {{ prediction.departement }} - Act: {{ (prediction.libelle_activite || '').slice(0,65) }}
          </div>
        </div>
        <div class="mr-2 text-xs-right">
          <img
            class="d-block mt-2 mb-2"
            width="70"
            v-if="!prediction.urssaf && roles.includes('urssaf') && (prediction.alert)"
            src="../assets/gray_urssaf.svg"
          />
          <img
            class="d-block mt-2 mb-2"
            width="70"
            v-if="prediction.urssaf && roles.includes('urssaf') && (prediction.alert)"
            src="../assets/red_urssaf.svg"
          />
          <img
            class="activite-partielle mt-1 mr-1"
            height="24"
            v-if="prediction.activite_partielle && roles.includes('dgefp') && (prediction.alert) "
            src="../assets/red_apart.svg"
          />
          <img
            class="activite-partielle mt-1 mr-1"
            height="24"
            v-if="!prediction.activite_partielle && roles.includes('dgefp') && (prediction.alert)"
            src="../assets/gray_apart.svg"
          />
          <span class="effectif">{{ prediction.dernier_effectif || 'n/c' }}</span>
        </div>
        <div class="ca mr-2 text-xs-right">
          CA {{prediction.annee_ca}}
          <br />
          <span class="valeur" :class="diane.ca_color">{{ diane.ca || "n/c" }}</span>
          <v-icon small v-if="diane.ca_arrow">{{ diane.ca_arrow }}</v-icon>
        </div>
        <div class="rex mr-2 text-xs-right">
          REX
          <br />
          <span class="valeur" :class="diane.resultat_expl_color">{{ diane.resultat_expl }}</span>
        </div>
        <v-dialog lazy fullscreen v-model="dialog">
          <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
            <v-toolbar
              fixed
              class="toolbar"
              height="35px"
              style="color: #fff; font-size: 22px; z-index: 50;"
            >
              <v-spacer />FICHE ETABLISSEMENT
              <v-spacer />
              <v-icon @click="dialog=false;" style="color: #fff">mdi-close</v-icon>
            </v-toolbar>
            <Etablissement :siret="prediction.siret" :batch="currentBatchKey"></Etablissement>
          </div>
        </v-dialog>
      </div>
    </v-card>
  </div>
</template>

<script>
import Etablissement from '@/components/Etablissement'
import ScoreWidget from '@/components/ScoreWidget'
export default {
  props: ['prediction'],
  components: {
    ScoreWidget,
    Etablissement,
  },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    currentBatchKey() {
      return this.$store.state.currentBatchKey
    },
    diane() {
      return {
        ca: this.prediction.ca ? this.prediction.ca + ' k€' : 'n/c',
        ca_arrow: (this.prediction.variation_ca || 1) > 1.05 ? 'mdi-arrow-top-right' :
          (this.prediction.variation_ca || 1) < 0.95 ? 'mdi-arrow-bottom-right' : null,
        ca_color: this.prediction.ca ? '' : 'unknown',
        resultat_expl: this.prediction.resultat_expl ? this.prediction.resultat_expl + ' k€' : 'n/c',
        resultat_expl_color: this.prediction.resultat_expl ?
          (this.prediction.resultat_expl < 0 ? 'down' : null) : 'unknown',
      }
    },
  },
  methods: {
    showEtablissement() {
      this.dialog = true
    },
  },
}
</script>
<style scoped>
.etablissement-card {
  background: linear-gradient(#fff, #eee 45%, #ccc);
  display: flex;
  flex-direction: row;
  min-height: 80px;
}
.entete {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(
    270deg,
    rgba(119, 122, 170, 0.219),
    rgba(119, 122, 170, 0)
  );
  border-right: solid 1px #3334;
  text-align: center;
  width: 80px;
}
.corps {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: linear-gradient(45deg, rgba(50, 51, 121, 0.212), #0000);
}
.corps > div:first-child {
  flex: 1 1 auto;
  overflow: hidden;
}
.raison-sociale {
  font-family: "Oswald";
  font-size: 24px;
  color: #333;
}
.identite {
  font-family: "Abel";
  font-size: 14px;
  font-weight: 400;
}
.effectif {
  font-size: 25px;
}
.activite-partielle {
  float: left;
}
.ca,
.rex {
  font-family: "Abel";
  font-size: 16px;
}
.ca {
  min-width: 120px;
}
.rex {
  min-width: 100px;
}
.valeur {
  font-size: 25px;
}
.down {
  color: rgb(244, 67, 54);
}
.unknown {
  color: rgb(150, 150, 150);
}
</style>