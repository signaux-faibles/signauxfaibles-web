<template>
  <span>
    <h2>Historique des alertes
      <Help titre="Historique des alertes">
        <template>
          L'historique des alertes synthétise toutes les listes de détection sur lesquelles l'établissement apparaît.<br>
          Cette visualisation est dépendante de vos habilitations, par conséquent, les signalements émanant d'une zone géographique en dehors de vos attributions n'apparaîtront pas.
        </template>
      </Help>
    </h2>
    <div v-for="v in batchKeys" :key="v">
      <div v-if="historiqueObject[v]">
      <ScoreWidget 
        
        style="position: relative; bottom: 4px" 
        size="25px" 
      :prediction="historiqueObject[v]"/>
      {{ batches[v] }}
      </div>
    </div> 
    
  </span>
</template>

<script>
import ScoreWidget from '@/components/ScoreWidget.vue'
import Help from '@/components/Help.vue'

export default {
  name: 'Historique',
  props: ['historique'],
  components: { ScoreWidget, Help },
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
      return this.$store.state.batches.map((b) => b.key.batch).sort((b1, b2) => b1 < b2)
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
