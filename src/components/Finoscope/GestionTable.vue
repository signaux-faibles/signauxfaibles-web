<template>
  <div>
    <table>
      <tr>
        <th style="min-width: 240px">Exercice (Date de clôture)</th>
        <th v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.exercice }} ({{ exercice.dateClotureExercice.toLocaleDateString() }})
        </th>
      </tr>
      <tr>
        <th>
          Besoin fonds de roulement exploitation / CA (%)
          <Info id="poidsBfrExploitationSurCAPourcent"/>
        </th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(Math.round(exercice.gestion.poidsBfrExploitationSurCAJours/0.365)/10, ' %') }}
        </td>
      </tr>
      <tr>
        <th>
          Besoin fonds de roulement exploitation / CA (jours)
          <Info id="poidsBfrExploitationSurCAJours"/>
        </th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(exercice.gestion.poidsBfrExploitationSurCAJours, ' j.') }}
        </td>
      </tr>
      <tr>
        <th>
          Rotation des stocks
          <Info id="rotationDesStocks"/>
        </th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(exercice.gestion.rotationDesStocks, ' j.') }}
        </td>
      </tr>
      <tr>
        <th>
          Crédit Clients
          <Info id="creditClients"/>
        </th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(exercice.gestion.creditClients, ' j.') }}
        </td>
      </tr>
      <tr>
        <th>
          Crédit Fournisseurs
          <Info id="creditFournisseurs"/>
        </th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ printNumber(exercice.gestion.creditFournisseurs, ' j.') }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Info from '@/components/Finoscope/Info.vue'
export default {
  name: 'GestionTable',
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
