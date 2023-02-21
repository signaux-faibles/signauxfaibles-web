<template>
  <div>
    <apexchart width="100%" heigth="100%" :options="options" :series="series"></apexchart>
  </div>
</template>

<script>
import fr from 'apexcharts/dist/locales/fr.json'

export default {
  name: 'BilanGraph',
  props: ['ratios', 'chartOptions'],
  data() {
    return {
      localOptions: {
        labels: [
          'Taux d\'endettement',
          ['Ratio de', 'liquidité'],
          ['Ratio de','vétusté'],
          ['Autonomie','financière'],
          ['BFR exploit.','sur CA']
        ],
        tooltip: {
          y: {
            formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
              return value.toLocaleString() + ' %'
            }
          }
        }
      }
    }
  },
  created() {
    Apex.chart = {
      locales: [fr],
      defaultLocale: 'fr',
    }
  },
  methods: {
    exercices(length) {
      const currentYear = (new Date()).getFullYear()
      return Array(length).fill().map((_, index) => currentYear - index - 1)
    }
  },
  computed: {
    options() {
      return Object.assign(this.localOptions, this.chartOptions)
    },
    series() {
      if (this.ratios == null) {return []}
      return this.ratios
          .slice(0,2)
          .reverse()
          .map((exercice) => {
        return {
          name: exercice.exercice,
          data: [
            exercice.bilan.tauxDEndettement,
            exercice.bilan.ratioDeLiquidite,
            exercice.bilan.ratioDeVetuste,
            exercice.bilan.autonomieFinanciere,
            exercice.bilan.poidsBFRExploitationSurCA,
          ]
        }
      })
    },
  }
}

</script>