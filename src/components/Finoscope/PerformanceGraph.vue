<template>
  <div>
    <apexchart width="100%" heigth="100%" type="bar" :options="options" :series="series"></apexchart>
  </div>
</template>

<script>
import fr from 'apexcharts/dist/locales/fr.json'

export default {
  name: 'PerformanceGraph',
  props: ['ratios'],
  data() {
    return {
      options: {
        legend: {
          show: true,
          position: 'right',
        },
        theme: {
          palette: 'palette5',
        },
        chart: {
          toolbar: {
            show: false,
          },
          type: 'bar',
          width: '50%',
        },
        yaxis: {
          tickAmount: 3,
        },

        labels: [
          ['Chiffre d\'Affaire'],
          ['Marge brute'],
          ['EBITDA'],
          ['Résultat d\'exploitation'],
          ['Résultat net']
        ],
        tooltip: {
          y: {
            formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
              return value.toLocaleString() + ' jours'
            }
          }
        }
      },
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
    series() {
      if (this.ratios == null) {return []}
      return this.ratios
          .slice(0,2)
          .reverse()
          .map((exercice) => {
            return {
              name: exercice.exercice,
              data: [
                exercice.performance.chiffreDAffaires,
                exercice.performance.margeBrute,
                exercice.performance.ebitda,
                exercice.performance.ebit,
                exercice.performance.resultatNet,
              ]
            }
          })
    },
  }
}

</script>