<template>
  <div>
    <table>
      <tr>
        <th>
          Exercice (Date de clôture)
        </th>
        <th v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.exercice }} ({{ exercice.dateClotureExercice.toLocaleDateString() }})
        </th>
      </tr>
      <tr>
        <th>
          Taux d'endettement
          <Info id="tauxDEndettement"/>
        </th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(exercice.solvabiliteEtTresorerie.tauxDEndettement, ' %') }}
        </td>
      </tr>
      <tr>
        <th>
          Autonomie financière
          <Info id="autonomieFinanciere"/>
        </th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(exercice.solvabiliteEtTresorerie.autonomieFinanciere, ' %') }}
        </td>
      </tr>
      <tr>
        <th>
          Ratio de vétusté
          <Info id="ratioDeVetuste"/>
        </th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(exercice.solvabiliteEtTresorerie.ratioDeVetuste, ' %') }}
        </td>
      </tr>
      <tr>
        <th>
          Capacité d'autofinancement / CA
          <Info id="cafSurCA"/>
        </th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(exercice.solvabiliteEtTresorerie.cafSurCA, ' %') }}
        </td>
      </tr>
      <tr>
      <tr>
        <th>
          Capacité de remboursement
          <Info id="capaciteDeRemboursement"/>
        </th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(exercice.solvabiliteEtTresorerie.capaciteDeRemboursement, '') }}
        </td>
      </tr>
      <tr>
        <th>
          Ratio de liquidité
          <Info id="ratioDeLiquidite"/>
        </th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(exercice.solvabiliteEtTresorerie.ratioDeLiquidite, ' %') }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Info from "@/components/Finoscope/Info.vue"

export default {
  name: 'SolvabiliteEtTresorerieTable',
  components: {Info},
  props: ['ratios', 'siren'],
  computed: {
    localRatios() {
      return this.ratios.slice(0,5).reverse()
    }
  },
  methods: {
    printNumber(value, suffix) {
      if (!isNaN(value)) {
        return value.toLocaleString() + suffix
      } else {
        return 'n/c'
      }
    }
  },
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
.negative {
  color: rgba(210,0,0,1);
}
</style>
