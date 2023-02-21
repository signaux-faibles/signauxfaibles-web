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
        <td>BFR exploitation sur CA</td>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.gestion.poidsBFRExploitationSurCAJours.toLocaleString() }} j.
        </td>
      </tr>
      <tr>
        <td>Rotation des stocks</td>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.gestion.rotationDesStocks.toLocaleString() }} j.
        </td>
      </tr>
      <tr>
        <td>Crédit Clients</td>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.gestion.creditClients.toLocaleString() }} j.
        </td>
      </tr>
      <tr>
        <td>Crédits Fournisseurs</td>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.gestion.creditFournisseurs.toLocaleString() }} j.
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'GestionTable',
  props: ['ratios'],
  computed: {
    localRatios() {
      return this.ratios.slice().reverse()
    }
  }
}
</script>