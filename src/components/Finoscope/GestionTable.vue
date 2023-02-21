<template>
  <div>
    <table>
      <tr>
        <th>Exercice (Date de clôture)</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.exercice }} ({{ exercice.dateClotureExercice.toLocaleDateString() }})
        </td>
      </tr>
      <tr>
        <th>BFR exploitation sur CA</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.gestion.poidsBFRExploitationSurCAJours.toLocaleString() }} j.
        </td>
      </tr>
      <tr>
        <th>Rotation des stocks</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.gestion.rotationDesStocks.toLocaleString() }} j.
        </td>
      </tr>
      <tr>
        <th>Crédit Clients</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.gestion.creditClients.toLocaleString() }} j.
        </td>
      </tr>
      <tr>
        <th>Crédits Fournisseurs</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.gestion.creditFournisseurs.toLocaleString() }} j.
        </td>
      </tr>
    </table>
    <DataSource :siren="siren"/>
  </div>
</template>

<script>
import DataSource from "@/components/Finoscope/DataSource.vue";

export default {
  name: 'GestionTable',
  components: {DataSource},
  props: ['ratios', 'siren'],
  computed: {
    localRatios() {
      return this.ratios.slice().reverse()
    }
  }
}
</script>