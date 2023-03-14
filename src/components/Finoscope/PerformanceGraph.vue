<template>
  <div>
    <div>
      CA
      <v-switch
        v-model="graph"
        huge
      />
      SIG
    </div>
    <div v-if="graph">
      <apexchart width="100%" heigth="100%" type="bar" :options="optionsBar" :series="seriesBar"/>
    </div>
    <div v-if="!graph">
      <apexchart width="100%" heigth="100%" type="line" :options="optionsLine" :series="seriesLine"/>
    </div>
    {{ seriesLine }}
    {{ ratios[0].performance }}
  </div>
</template>

<script>
import fr from 'apexcharts/dist/locales/fr.json'

export default {
  name: 'PerformanceGraph',
  props: ['ratios'],
  data() {
    return {
      graph: false,
      optionsLine: {
        yaxis: [
          {
            title: {
              text: "Chiffre d'affaire"
            },
          },
          {
            opposite: true,
            title: {
              text: "Marge Excedent Bute d'Exploitation"
            }
          }
        ]
      },
      optionsBar: {
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
          ['Marge'],
          ['EBE'],
          ['Ré'],
          ['A']
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
    seriesLine() {
      if (this.ratios == null) {return []}
      return [
        {
          name: "Chiffre d'affaires",
          data: this.ratios.reverse().map((exercice) => exercice.performance.chiffreDAffaires)
        },
        {
          name: "EBE",
          data: this.ratios.reverse().map((exercice) => exercice.performance.ebe)
        }
      ]
    },
    seriesBar() {
      if (this.ratios == null) {return []}
      return this.ratios
        // .slice(0,3)
        .reverse()
        .map((exercice) => {
          return {
            name: exercice.exercice,
            data:
                [
                  exercice.performance.margeCommerciale,
                  exercice.performance.ebe,
                  exercice.performance.ebit,
                  exercice.performance.resultatNet,
                ]
              }
            }
          )
    },
  }
}

</script>