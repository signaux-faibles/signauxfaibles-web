<template>
  <div style="font-size: 17px">
    <div v-if="permScore">
      <EtablissementScoreExplainWaterfall :liste="lastBatch" :score="dernierScore.score"
                                            :microExpl="dernierScore.microExpl" :macroExpl="dernierScore.macroExpl"
                                            :summary="summary" :historique="historique" :typeExplication="typeExplication"/>
    </div>
    <div v-else>
      <div v-if="roles.includes('score')">Veuillez suivre cet établissement pour consulter ses données de détection.
      </div>
      <div v-else>Vous n'êtes pas autorisé(e) à consulter les données de détection.</div>
    </div>

  </div>
</template>

<script>
import EtablissementScoreExplainWaterfall from "@/components/etablissement/score/explainWaterfall.vue";

export default {
  props: ['historique', 'summary', 'typeExplication'],
  components: {EtablissementScoreExplainWaterfall},
  computed: {
    permScore() {
      return this.summary.hasOwnProperty('permScore') ? this.summary.permScore : true
    },
    roles() {
      return this.$store.getters.roles
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
  }
}

</script>
