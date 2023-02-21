<template>
  <div>
    <table>
      <tr>
        <td></td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.exercice }}<br/>
          {{ exercice.dateClotureExercice.toLocaleDateString() }}
        </td>
      </tr>
      <tr>
        <td>Couverture des intérêts</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.couvertureDesInterets }} %
        </td>
      </tr>
      <tr>
        <td>Capacité d'autofinancement sur CA</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.cafSurCA }} %
        </td>
      </tr>
      <tr>
        <td>Capacité de remboursement</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.capaciteRemboursement }} %
        </td>
      </tr>
      <tr>
        <td>Marge EBE</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.margeEBE }} %
        </td>
      </tr>
      <tr>
        <td>Besoin en fond de roulement sur CA (%)</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.resultatCourantAvantImpotsSurCA }} %
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'CompteDeResultatTable',
  props: ['ratios'],
}
</script>