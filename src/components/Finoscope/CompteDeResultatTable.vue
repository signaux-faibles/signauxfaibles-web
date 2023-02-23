<template>
  <div>
    <table>
      <tr>
        <th>Exercice (Date de clôture)</th>
        <th v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.exercice }} ({{ exercice.dateClotureExercice.toLocaleDateString() }})
        </th>
      </tr>
      <tr>
        <th>Couverture des intérêts</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.couvertureDesInterets.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <th>
          <div class="numerateur">Capacité d'autofinancement</div>
          <div class="denominateur">Chiffre d'affaires</div></th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.cafSurCA.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <th>Capacité de remboursement</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          × {{ exercice.compteDeResultat.capaciteRemboursement.toLocaleString() }}
        </td>
      </tr>
      <tr>
        <th>Marge d'excédent brut d'exploitation </th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.compteDeResultat.margeEBE.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <th>
          <div class="numerateur">Résultat courant avant impôts</div>
          <div class="denominateur">CA</div></th>
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
