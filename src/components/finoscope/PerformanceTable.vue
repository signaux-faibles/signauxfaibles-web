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
        <th>
          Chiffre d'affaires
          <Info id="chiffreDAffaires"/>
        </th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.performance.chiffreDAffaires < 0)?'negative':''"
        >
          {{ printNumber(exercice.performance.chiffreDAffaires, ' €') }}
        </td>
      </tr>
      <tr>
        <th>
          Marge brute <Info id="margeBrute"/><br/>
          <span class="left-offset percentage">en % de CA</span></th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.performance.margeBrute < 0)?'negative':''"
        >
          {{ printNumber(exercice.performance.margeBrute, ' €') }}<br/>
          <span class="percentage">{{ printNumber(exercice.performance.partCaMargeBrute, ' %') }}</span>
        </td>
      </tr>
      <tr>
        <th>
          Excédent brut d'exploitation <Info id="ebe"/><br/>
          <span class="left-offset percentage">en % de CA</span>
        </th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.performance.ebe < 0)?'negative':''"
        >
          {{ printNumber(exercice.performance.ebe, ' €') }}<br/>
          <span class="percentage">{{ printNumber(exercice.performance.partCaEBE, ' %') }}</span>
        </td>
      </tr>
      <tr>
        <th>
          Résultat d'exploitation <Info id="ebit"/><br/>
          <span class="left-offset percentage">en % de CA</span>
        </th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.performance.ebit < 0)?'negative':''"
        >
          {{ printNumber(exercice.performance.ebit, ' €') }}<br/>
          <span class="percentage">{{ printNumber(exercice.performance.partCaEbit, ' %') }}</span>
        </td>
      </tr>
      <tr>
        <th>
          Résultat net <Info id="resultatNet"/><br/>
          <span class="left-offset percentage">en % de CA</span>
        </th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.performance.resultatNet < 0)?'negative':''"
        >
          {{ printNumber(exercice.performance.resultatNet, ' €') }}<br/>
          <span class="percentage">{{ printNumber(exercice.performance.partCaResultatNet, ' %') }}</span>

        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Info from "@/components/finoscope/Info.vue"

export default {
  name: 'PerformanceTable',
  props: ['ratios', 'siren'],
  components: {Info},
  computed: {
    localRatios() {
      return this.ratios.slice(0,5).reverse()
    },
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
span.percentage {
  font-weight: 100;
  font-size: 15px;
}
span.left-offset {
  margin-left: 30px;
}
.negative {
  color: rgba(210,0,0,1);
}
</style>