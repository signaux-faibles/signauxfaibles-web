<template>
  <div>
    <table>
      <tr>
        <td>Exercice<br/>Date de clôture</td>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.exercice }}<br/>
          {{ exercice.dateClotureExercice.toLocaleDateString() }}
        </td>
      </tr>
      <tr>
        <td>Chiffre d'Affaire</td>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.performance.chiffreDAffaires.toLocaleString() }} €
        </td>
      </tr>
      <tr>
        <td>Marge brute</td>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.performance.margeBrute.toLocaleString() }} €
        </td>
      </tr>
      <tr>
        <td>EBITDA</td>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.performance.ebitda.toLocaleString() }} €
        </td>
      </tr>
      <tr>
        <td>Résultat d'exploitation</td>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.performance.ebit.toLocaleString() }} €
        </td>
      </tr>
      <tr>
        <td>Résultat net</td>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.performance.resultatNet.toLocaleString() }} €
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'PerfomanceTable',
  props: ['ratios'],
  computed: {
    localRatios() {
      return this.ratios.slice().reverse()
    }
  }
}
</script>