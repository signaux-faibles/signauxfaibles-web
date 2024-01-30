<template>
  <div style="font-size: 17px">
    <div v-if="permScore">
      <span v-if="typeExplication === 'crash'">Cet établissement est fermé ou est en situation de défaillance</span>
      <span v-else-if="typeExplication === 'ras'">Cet établissement n’a pas été identifié par l’algorithme comme étant à risque de défaillance à 18 mois.</span>
      <span v-else-if="typeExplication === 'horsperimetre'">Cet établissement ne faisait pas partie du périmètre de Signaux Faibles au moment de la production de cette liste de détection.</span>
      <span v-else>
        Cette entreprise est portée à votre attention car elle présente des signes d'alerte {{ this.alert === "Alerte seuil F2" ? ' modérés' : ' importants' }} détaillés ci-dessous.<br/>
        <p/>
        <span>
          <Gitbook :target="gitbookPath('DETECTION')"/>
        </span>
        <EtablissementScoreExplainWaterfall :liste="lastBatch" :score="dernierScore.score"
                                            :microExpl="dernierScore.microExpl" :macroExpl="dernierScore.macroExpl"/>
      </span>
    </div>
    <div v-else>
      <div v-if="roles.includes('score')">Veuillez suivre cet établissement pour consulter ses données de détection.
      </div>
      <div v-else>Vous n’êtes pas autorisé(e) à consulter les données de détection.</div>
    </div>

  </div>
</template>

<script>
import ExplainStructurel from '@/components/etablissement/score/explainStructurel.vue'
import Gitbook from '@/components/Gitbook.vue'
import EtablissementScoreExplainWaterfall from "@/components/etablissement/score/explainWaterfall.vue";

export default {
  data() {
    return {
      variablesMacro: ['activite_partielle', 'dette_urssaf', 'retards_paiement', 'sante_financiere'],
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
