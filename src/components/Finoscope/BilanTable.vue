<template>
  <div>
    <table>
      <tr>
        <td>Exercice<br/>Date de clôture</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.exercice }}<br/>
          {{ exercice.dateClotureExercice.toLocaleDateString() }}
        </td>
      </tr>
      <tr>
        <td>Taux d'endettement</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.bilan.tauxDEndettement }} %
        </td>
      </tr>
      <tr>
        <td>Ratio de liquidité</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.bilan.ratioDeLiquidite }} %
        </td>
      </tr>
      <tr>
        <td>Ratio de vétusté</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.bilan.ratioDeVetuste }} %
        </td>
      </tr>
      <tr>
        <td>Autonomie financière</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.bilan.autonomieFinanciere }} %
        </td>
      </tr>
      <tr>
        <td>BFR sur CA</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.bilan.poidsBFRExploitationSurCA }} %
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'BilanTable',
  props: ['ratios'],
  methods: {
    exercices(length) {
      const currentYear = (new Date()).getFullYear()
      return Array(length).fill().map((_, index) => currentYear - index - 1)
    },
  }
}
</script>

