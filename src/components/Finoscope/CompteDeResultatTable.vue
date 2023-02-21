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
        <td>Couverture des intérêts</td>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.couvertureDesInterets.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <td>Capacité d'autofinancement sur CA</td>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.cafSurCA.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <td>Capacité de remboursement</td>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.capaciteRemboursement.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <td>Marge EBE</td>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.margeEBE.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <td>Résultat courant avant impôts sur CA</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.resultatCourantAvantImpotsSurCA.toLocaleString() }} %
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CompteDeResultatTable',
  props: ['ratios'],
  computed: {
    localRatios() {
      return this.ratios.slice().reverse()
    }
  }
}
</script>