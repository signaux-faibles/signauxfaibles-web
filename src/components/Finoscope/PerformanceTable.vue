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
        <th>Chiffre d'Affaire</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.performance.chiffreDAffaires.toLocaleString() }} €
        </td>
      </tr>
      <tr>
        <th>Marge brute</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.performance.margeBrute.toLocaleString() }} €
        </td>
      </tr>
      <tr>
        <th>EBITDA</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.performance.ebitda.toLocaleString() }} €
        </td>
      </tr>
      <tr>
        <th>Résultat d'exploitation</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.performance.ebit.toLocaleString() }} €
        </td>
      </tr>
      <tr>
        <th>Résultat net</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.performance.resultatNet.toLocaleString() }} €
        </td>
      </tr>
    </table>
    <DataSource :siren="siren"/>
  </div>
</template>

<script>
import DataSource from "@/components/Finoscope/DataSource.vue";

export default {
  name: 'PerfomanceTable',
  props: ['ratios', 'siren'],
  components: {DataSource},
  computed: {
    localRatios() {
      return this.ratios.slice().reverse()
    }
  }
}
</script>