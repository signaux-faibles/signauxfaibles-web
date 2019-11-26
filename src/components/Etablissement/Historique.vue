<template>
  <span>
    <h2>Historique des alertes</h2>
    <div v-for="(b, v) in historiqueObject" :key="v">
      <ScoreWidget 
        style="position: relative; bottom: 4px" 
        size="25px" 
      :prediction="b"/>
      {{ batches[v] }}
    </div> 
    
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
    batches() {
      return this.$store.state.batches.reduce((m, b) => {
        m[b.key.batch] = b.value.name
        return m
      }, {})
    },
    batchKeys() {
      return this.$store.state.batches.map((b) => b.key.batch)
    },
    lastEvent() {
      return this.historiqueObject[(this.batchKeys[1] || '')]
    },
    historiqueObject() {
      return this.historique.reduce((m, h) => {
        m[h.key.batch] = h
        return m
      }, {})
    },
  },
}
</script>
