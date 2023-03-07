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
        <th>Chiffre d'Affaires</th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.resultat.chiffreDAffaires < 0)?'negative':''"
        >
          {{ printNumber(exercice.resultat.chiffreDAffaires, ' €') }}
        </td>
      </tr>
      <tr>
        <th>Marge commerciale<br/><span class="left-offset percentage">en % de CA</span></th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.resultat.margeCommerciale < 0)?'negative':''"
        >
          {{ printNumber(exercice.resultat.margeCommerciale, ' €') }}<br/>
          <span class="percentage">{{ printNumber(exercice.resultat.partCaMargeCommerciale, ' %') }}</span>
        </td>
      </tr>
      <tr>
        <th>Résultat d'exploitation<br/><span class="left-offset percentage">en % de CA</span></th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.resultat.ebit < 0)?'negative':''"
        >
          {{ printNumber(exercice.resultat.ebit, ' €') }}<br/>
          <span class="percentage">{{ printNumber(exercice.resultat.partCaEbit, ' %') }}</span>
        </td>
      </tr>
      <tr>
        <th>Résultat net<br/><span class="left-offset percentage">en % de CA</span></th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.resultat.resultatNet < 0)?'negative':''"
        >
          {{ printNumber(exercice.resultat.resultatNet, ' €') }}<br/>
          <span class="percentage">{{ printNumber(exercice.resultat.partCaResultatNet, ' %') }}</span>

        </td>
      </tr>
      <tr>
        <th>Excédent brut d'exploitation<br/><span class="left-offset percentage">en % de CA</span></th>
        <td
            v-for="exercice in localRatios"
            :key="exercice.dateClotureExercice.getTime()"
            :class="(exercice.resultat.ebe < 0)?'negative':''"
        >
          {{ printNumber(exercice.resultat.ebe, ' €') }}<br/>
          <span class="percentage">{{ printNumber(exercice.resultat.partCaEBE, ' %') }}</span>
        </td>
      </tr>
    </table>
    <DataSource :siren="siren"/>
  </div>
</template>

<script>
import DataSource from "@/components/Finoscope/DataSource.vue";

export default {
  name: 'ResultatTable',
  props: ['ratios', 'siren'],
  components: {DataSource},
  computed: {
    localRatios() {
      return this.ratios.slice().reverse()
    },
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