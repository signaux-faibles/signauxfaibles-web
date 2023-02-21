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
        <th>Couverture des intérêts</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.couvertureDesInterets.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <th>Capacité d'autofinancement sur CA</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.cafSurCA.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <th>Capacité de remboursement</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.capaciteRemboursement.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <th>Marge EBE</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.margeEBE.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <th>Résultat courant avant impôts sur CA</th>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.resultatCourantAvantImpotsSurCA.toLocaleString() }} %
        </td>
      </tr>
    </table>
    <DataSource :siren="siren"/>
  </div>
</template>

<script>
import DataSource from "@/components/Finoscope/DataSource.vue";

export default {
  name: 'CompteDeResultatTable',
  components: {DataSource},
  props: ['ratios', 'siren'],
  computed: {
    localRatios() {
      return this.ratios.slice().reverse()
    }
  }
}
</script>