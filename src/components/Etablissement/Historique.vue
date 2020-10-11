<template>
  <span>
    <h2>
      Historique des alertes
      <Help titre="Historique des alertes">
        <template>
          L'historique des alertes synthétise toutes les listes de détection sur lesquelles l'établissement apparaît.
          <br />Cette visualisation est dépendante de vos habilitations, par conséquent, les signalements émanant d'une zone géographique en dehors de vos attributions n'apparaîtront pas.
        </template>
      </Help>
    </h2>
    <div v-for="h in historique" :key="h.idListe">
      <ScoreWidget style="position: relative; bottom: 4px" size="25px" :prediction="h" />
      {{ h.idListe }}
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
}
</script>
