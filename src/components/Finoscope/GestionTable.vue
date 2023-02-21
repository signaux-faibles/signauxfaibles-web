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
        <td>Poids BFR exploitation sur CA</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.gestion.poidsBFRExploitationSurCAJours }} j
        </td>
      </tr>
      <tr>
        <td>Rotation des stocks</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.gestion.rotationDesStocks }} j
        </td>
      </tr>
      <tr>
        <td>Crédit Clients</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.gestion.creditClients }} j
        </td>
      </tr>
      <tr>
        <td>Crédits Fournisseurs</td>
        <td v-for="exercice in ratios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.gestion.creditFournisseurs }} j
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'GestionTable',
  props: ['ratios'],
}
</script>