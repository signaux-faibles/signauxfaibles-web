<template>
  <div style="font-size: 17px">
    <div v-if="permScore">
      <span v-if="typeExplication === 'crash'">Cet établissement est fermé ou est en situation de défaillance</span>
      <span v-else-if="typeExplication === 'ras'">Cet établissement n'a pas été identifié par l'algorithme comme étant à risque de défaillance à 18 mois.</span>
      <span v-else-if="typeExplication === 'horsperimetre'">Cet établissement ne faisait pas partie du périmètre de Signaux Faibles au moment de la production de cette liste de détection.</span>
      <span v-else>
        - Sur la base des données en notre possession, il apparaît que l'entreprise présente des caractéristiques similaires à des sociétés ayant fait défaut dans les 18 mois suivants.<br />
        - Le risque de défaillance de l'entreprise sous 18 mois apparaît comme {{ this.alert === "Alerte seuil F2" ? ' modéré' : ' élevé' }}.<br/>
        - Les données actualisées jusqu'au 1er juin 2025 sont mobilisées pour cette prédiction.
        <p/>
        <span>
          <Gitbook :target="gitbookPath('DETECTION')"/>
        </span>
        <EtablissementScoreExplainWaterfall :liste="lastBatch" :score="dernierScore.score"
                                            :microExpl="dernierScore.microExpl" :macroExpl="dernierScore.macroExpl"
                                            :summary="summary"/>
      </span>
    </div>
    <div v-else>
      <div v-if="roles.includes('score')">Veuillez suivre cet établissement pour consulter ses données de détection.
      </div>
      <div v-else>Vous n'êtes pas autorisé(e) à consulter les données de détection.</div>
    </div>

  </div>
</template>

<script>
import Gitbook from '@/components/Gitbook.vue'
import EtablissementScoreExplainWaterfall from "@/components/etablissement/score/explainWaterfall.vue";

export default {
  data() {
    return {
      variablesMacro: ['activité_partielle', 'dette_urssaf', 'retards_paiement', 'santé_financière'],
    }
  },
  props: ['historique', 'summary'],
  components: {EtablissementScoreExplainWaterfall, Gitbook},
  methods: {},
  computed: {
    crash() {
      return this.summary.etatAdministratif === 'F'
          || this.summary.etat_procol === 'redressement' || this.summary.etat_procol === 'liquidation'
    },
    lastBatch() {
      return this.$store.getters.batches[0]
    },
    dernierScore() {
      if ((this.historique[0] || {})['idListe'] == this.lastBatch.value) {
        return this.historique[0] || {}
      } else {
        return {}
      }
    },
    alert() {
      return this.dernierScore.alert
    },
    permScore() {
      return this.summary.hasOwnProperty('permScore') ? this.summary.permScore : true
    },
    hasAlert() {
      return (this.alert === "Alerte seuil F1" || this.alert === "Alerte seuil F2")
    },
    typeExplication() {
      if (this.crash) {
        return "crash"
      } else if (this.alert == null) {
        return "horsperimetre"
      } else if (this.hasAlert) {
        return "alert"
      } else {
        return "ras"
      }
    },
  }
}

</script>
