<template>
  <div>
    <v-toolbar dense flat class="mytoolbar" light>
      <v-toolbar-title class="localtoolbar mytoolbar">Signaux récents</v-toolbar-title>
      <v-spacer />
      <Help titre="Signaux Récents">
        <template>
          Les données récentes permettent de faire ressortir les entreprises correspondants à ces critères
          <ul>
            <li>L'entreprise a demandé une grande quantité d'activité partielle sur les 12 derniers mois (plus de 10 mois), alors l'alerte sera renforcée.</li>
            <li>Une dette récente auprès de l'URSSAF (depuis septembre 2021) sera également facteur d'augmentation de l'alerte.</li>
            <li>Si l'entreprise voit par contre sa dette plus ancienne diminuer, et que la dette URSSAF est en tête des variables préoccupante de la détection structurelle, alors l'alerte sera diminuée</li>
          </ul>
        </template>
      </Help>
    </v-toolbar>
    <v-card outlined>
      <v-card-text>
        <span v-if="bilanRedressements === -1">Les données récentes comportent des signaux qui augmentent le niveau d'alerte.</span>
        <span v-else-if="bilanRedressements === 0">Les données récentes n'influencent pas le niveau d'alerte.</span>
        <span v-else-if="bilanRedressements === 1">Les données récentes comportent des tendances qui diminuent le niveau d'alerte.</span>
        <div v-if="signal1 !== 0">
          <div class="align-center d-flex justify-start mb-1">
            <div class="pa-2"><v-icon large color="red">mdi-arrow-top-right-bold-outline</v-icon></div>
            <div class="pa-2">Les dettes sociales contractées récemment augmentent le niveau d'alerte.</div>
          </div>
        </div>
        <div v-if="signal3 !== 0">
          <div class="align-center d-flex justify-start mb-1">
            <div class="pa-2"><v-icon large color="red">mdi-arrow-top-right-bold-outline</v-icon></div>
            <div class="pa-2">La quantité d'activité partielle demandée par l'entreprise tend à augmenter le niveau d’alerte.</div>
          </div>
        </div>
        <div v-if="signal2 !== 0">
          <div class="align-center d-flex justify-start mb-1">
            <div class="pa-2"><v-icon large color="green">mdi-arrow-bottom-right-bold-outline</v-icon></div>
            <div class="pa-2">Le suivi des échéanciers de recouvrement de l'entreprise diminue le niveau d'alerte fondé principalement sur la dette sociale.'.</div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
import Help from '@/components/Help.vue'

export default {
  props: ['historique', 'summary'],
  components: {Help},
  computed: {
    bilanRedressements() {
      return Math.min(Math.max(this.signal1 + this.signal2 + this.signal3,-1),1)
    },
    dernierScore() {
      return this.historique[0] || {}
    },
    redressements() {
      return this.dernierScore.redressements
    },
    hasSignal() {
      return (this.signal1 != 0 || this.signal2 != 0 || this.signal3 != 0)
    },
    signal1() {
      return (this.redressements.includes("augmentation_dette_sur_cotisation_urssaf_recente") && 
      !this.redressements.includes("dette_urssaf_macro_preponderante"))?-1:0
    },
    signal2() {
      return (this.redressements.includes("diminution_dette_urssaf_ancienne") && 
      !this.redressements.includes("augmentation_dette_sur_cotisation_urssaf_recente") && 
      this.redressements.includes("dette_urssaf_ancienne_significative"))?1:0
    },
    signal3() {
      return (this.redressements.includes("demande_activite_partielle_elevee"))?-1:0
    }
  }
}
</script>

<style scoped>
  .arrow {
    vertical-align: middle;
  }
  .mytoolbar {
    background-color: white;
    /* color: indigo; */
  }

</style>
 <!-- "diminution_dette_urssaf_ancienne", "demande_activite_partielle_elevee", "dette_urssaf_macro_preponderante", "augmentation_dette_urssaf_recente" -->