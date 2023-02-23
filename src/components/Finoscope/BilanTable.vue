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
        <th>Taux d'endettement</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.bilan.tauxDEndettement.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <th>Ratio de liquidité</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.bilan.ratioDeLiquidite.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <th>Ratio de vétusté</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.bilan.ratioDeVetuste.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <th>Autonomie financière</th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.bilan.autonomieFinanciere.toLocaleString() }} %
        </td>
      </tr>
      <tr>
        <th>
          <div class="numerateur">Besoin fond de roulement exploitation</div>
          <div class="denominateur">Chiffre d'affaires</div></th>
        <td v-for="exercice in localRatios" :key="exercice.dateClotureExercice.getTime()">
          {{ exercice.bilan.poidsBFRExploitationSurCA.toLocaleString() }} %
        </td>
      </tr>
    </table>
    <DataSource :siren="siren"/>
  </div>
</template>

<script>
import DataSource from "@/components/Finoscope/DataSource.vue";

export default {
  name: 'BilanTable',
  components: {DataSource},
  props: ['ratios', 'siren'],
  methods: {
    exercices(length) {
      const currentYear = (new Date()).getFullYear()
      return Array(length).fill().map((_, index) => currentYear - index - 1)
    },
  },
  computed: {
    localRatios() {
      return this.ratios.slice().reverse()
    }
  }
}
</script>

