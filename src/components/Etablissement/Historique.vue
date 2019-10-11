<template>
  <span>
    <h3>niveau d'alerte <ScoreWidget style="position: relative; bottom: 4px" size="25px" :prediction="alert"/>
    précédemment <ScoreWidget style="position: relative; bottom: 3px" size="25px" :prediction="lastEvent"/> 
    </h3>
  </span>
</template>

<script>
import ScoreWidget from '@/components/ScoreWidget.vue'

export default {
  name: 'Historique',
  props: ['historique'],
  components: { ScoreWidget },
  computed: {
    alert() {
      return this.historique[0] || {value: {score: 0, diff: 0, alert: 'Pas d\'alerte'}}
    },
    batchKeys () {
      return this.$store.state.batches.map((b) => b.key.batch)
    },
    lastEvent () {
      return this.historiqueObject[(this.batchKeys[1] || '')]
    },
    historiqueObject () {
      return this.historique.reduce((m, h) => {
        m[h.key.batch] = h
        return m
      }, {})
    },
  },
}
</script>
