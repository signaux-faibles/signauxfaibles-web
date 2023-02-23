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
        <th>Chiffre d'Affaire</th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.performance.chiffreDAffaires < 0)?'negative':''"
        >
          {{ exercice.performance.chiffreDAffaires.toLocaleString() }}&nbsp;€
        </td>
      </tr>
      <tr>
        <th>Marge commerciale</th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.performance.margeCommerciale < 0)?'negative':''"
        >
          {{ exercice.performance.margeCommerciale.toLocaleString() }}&nbsp;€
        </td>
      </tr>
      <tr>
        <th>Excédent brut d'exploitation</th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.performance.ebe < 0)?'negative':''"
        >
          {{ exercice.performance.ebe.toLocaleString() }}&nbsp;€
        </td>
      </tr>
      <tr>
        <th>Résultat d'exploitation</th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.performance.ebit < 0)?'negative':''"
        >
          {{ exercice.performance.ebit.toLocaleString() }}&nbsp;€
        </td>
      </tr>
      <tr>
        <th>Résultat net</th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.performance.resultatNet < 0)?'negative':''"
        >
          {{ exercice.performance.resultatNet.toLocaleString() }}&nbsp;€
        </td>
      </tr>
    </table>
    <DataSource :siren="siren"/>
  </div>
</template>

<script>
import DataSource from "@/components/Finoscope/DataSource.vue";

export default {
  name: 'PerfomanceTable',
  props: ['ratios', 'siren'],
  components: {DataSource},
  computed: {
    localRatios() {
      return this.ratios.slice().reverse()
    },
  }
}
</script>