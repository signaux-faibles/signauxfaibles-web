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
          {{ printNumber(exercice.compteDeResultat.couvertureDesInterets, ' %') }}
        </td>
      </tr>
      <tr>
        <th>Capacité d'autofinancement / CA</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(exercice.compteDeResultat.cafSurCA, ' %') }}
        </td>
      </tr>
      <tr>
        <th>Capacité de remboursement</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(exercice.compteDeResultat.capaciteRemboursement, '') }}
        </td>
      </tr>
      <tr>
        <th>Marge d'excédent brut d'exploitation </th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(exercice.compteDeResultat.margeEBE, ' %') }}
        </td>
      </tr>
      <tr>
        <th>
          Résultat courant avant impôts / CA</th>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(exercice.compteDeResultat.resultatCourantAvantImpotsSurCA, ' %') }}
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
  },
  methods: {
    printNumber(value, suffix) {
      if (value) {
        return value.toLocaleString() + suffix
      } else {
        return 'n/c'
      }
    }
  }
}
</script>

<style scoped>
table {
  width: 100%;
  margin: 5px;
  border-collapse: collapse;
}
tr td {
  text-align: right;
  font-family: Abel;
  font-size: 16px;
  padding: 5px;
}
tr th {
  padding: 4px;
  text-align: left;
}
tr:not(:first-child), td {
}
tr th:first-child {
  max-width: 200px;
}
table tr:not(:last-child) td, table tr:not(:last-child) th {
  border-bottom: 1px solid rgba(0,0,0,0.20);
}
table tr:nth-child(odd){
  background-color: rgba(0,0,0,0.03);
}
table tr:first-child td, table tr:first-child th {
  border-bottom: 2px solid rgba(0,0,0,0.20);
  background-color: rgba(0,0,0,0.08);
  text-align: center;
}
</style>