<template>
  <div>
    <h2>
      Détection Signaux Faibles
    </h2>
    <v-layout wrap>
      <v-flex xl12 md-6 mb-2> 
        <div class="mb-3">
          <span class="mr-2"><ScoreWidget size="25px" :prediction="summary" class="mr-1" /> {{ dernierBatch.text }}</span>
          <v-tooltip bottom v-if="summary.firstAlert === true">
            <template v-slot:activator="{ on, attrs }">
              <v-chip v-bind="attrs" v-on="on" class="ma-0 mr-1 chip" small color="primary" text-color="white">1re alerte</v-chip>
            </template>
            <span>Cet établissement est pour la première fois en alerte sur une liste de détection</span>
          </v-tooltip>
          <v-tooltip bottom v-if="summary.etatAdministratif == 'F'">
            <template v-slot:activator="{ on, attrs }">
              <v-chip v-bind="attrs" v-on="on" class="ma-0 mr-1 chip" small color="grey darken-4" text-color="white">Fermé</v-chip>
            </template>
            <span>Cet établissement est fermé ou l’activité de l’entreprise a cessé</span>
          </v-tooltip>
        </div>
        <Explain :summary="summary" :historique="historique"/>
        <v-btn class="mt-3"
               style="text-transform: none;"
               v-if="permScore && !this.crash && historique.length > 1"
               outlined
               dark
               color="indigo"
               @click="historiqueDialog = true"
        >
          Voir l'historique des alertes
        </v-btn>
      </v-flex>
      <v-dialog v-model="historiqueDialog" @input="historiqueDialog = false" max-width="500px">
        <div>
          <v-card>
            <v-card-title class="headline">
              Historique des alertes
            </v-card-title>
            <v-card-text style="font-size: 17px; font-weight: 800; font-family: 'Oswald', sans;">
              <div v-for="h in historique"
                    :key="h.idListe" 
                    size="25px"
                    class="pa-4">
                <ScoreWidget :prediction="h"/> 
                {{ h.idListe }}
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import ScoreWidget from '@/components/ScoreWidget.vue'
import Explain from '@/components/etablissement/score/explain.vue'
import Help from '@/components/Help.vue'

export default {
  name: 'Historique',
  props: ['historique', 'summary'],
  components: { ScoreWidget, Help, Explain },
  data() {
    return {
      historiqueDialog: false,
    }
  },
  computed: {
    currentBatchKey() {
      return this.$store.state.currentBatchKey
    },
    currentBatchDescription() {
      const batches = this.$store.state.batches
      return (batches.filter((b) => b.id === this.currentBatchKey)[0]).description
    },
    permScore() {
      return this.summary.hasOwnProperty('permScore') ? this.summary.permScore : true
    },
    batches() {
      const batches = this.$store.getters.batches
      return batches
    },
    dernierBatch() {
      return this.batches[0]
    },
    crash() {
      return this.summary.etatAdministratif === 'F'
        || this.summary.etat_procol === 'redressement' || this.summary.etat_procol === 'liquidation'
    },
  },
}
</script>
<style scoped>
.chip {
  font-family: "Roboto";
  font-size: 13px;
  font-weight: 400;
  vertical-align: text-bottom;
}
</style>