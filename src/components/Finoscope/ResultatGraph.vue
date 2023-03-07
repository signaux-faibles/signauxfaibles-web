<template>
  <div>
    <apexchart width="100%" heigth="100%" type="bar" :options="options" :series="series"></apexchart>
  </div>
</template>

<script>
import fr from 'apexcharts/dist/locales/fr.json'

export default {
  name: 'ResultatGraph',
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
          fontFamily: 'Oswald',
          toolbar: {
            show: false,
          },
          type: 'bar',
          width: '50%',
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '13px',
            }
          }
        },
        yaxis: {
          tickAmount: 7,
          labels: {
            style: {
              fontSize: '13px',
            },
            formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
              if (Math.abs(value) > 1000 && Math.abs(value) < 1000000) {
                const val = Math.round(value/100)/10
                return val.toLocaleString() + ' k€'
              } else if (Math.abs(value) >= 1000000) {
                const val = Math.round(value/100000)/10
                return val.toLocaleString() + ' M€'
              } else {
                return value.toLocaleString() + ' €'
              }
            }
          }
        },
        labels: [
          ['Marge commerciale'],
          ['EBE'],
          ['Résultat d\'exploitation'],
          ['Résultat net']
        ],
        tooltip: {
          y: {
            formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
              return value.toLocaleString() + '€'
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
    },
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
                exercice.resultat.margeCommerciale,
                exercice.resultat.ebe,
                exercice.resultat.ebit,
                exercice.resultat.resultatNet,
              ]
            }
          })
    },
  }
}

</script>