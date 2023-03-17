<template>
  <div>
    <v-tabs v-model="graphTab">
      <v-tab>Soldes intermédiaires de gestion</v-tab>
      <v-tab>Chiffre d'affaires et EBE</v-tab>
      <v-tab>Comparaison sectorielle</v-tab>
    </v-tabs>
    <v-tabs-items v-model="graphTab">
      <v-tab-item>
          <apexchart width="100%" height="400px" type="bar" :options="optionsSig" :series="seriesSig"/>
      </v-tab-item>
      <v-tab-item>
        <apexchart width="100%" height="400px" type="line" :options="optionsCA" :series="seriesCA"/>
      </v-tab-item>
      <v-tab-item>
          <v-layout>
            <v-flex xs8>
              <apexchart width="100%" height="400px" type="boxPlot" :options="optionsSectors" :series="seriesSectors"/>
            </v-flex>
            <v-flex xs4>
              <v-switch
                  v-on:change="fakeResize"
                  v-model="withCA"
                  :label="'Comparer aux entreprises ayant un chiffre d\'affaires ' + libelleCA"
              ></v-switch>
              Cette comparaison se base sur les {{ sectors[perimeter].cohorte }} bilans déposés publiquement pour l'exercice {{ sectors[perimeter].exercice }}
              dans le secteur d'activité de niveau {{ sectors[perimeter].classeNAF.length }} {{ libelleActivite }}
              <div width="100%" style="padding-top: 50px; text-align: center;">
                légende<br/>
                <img src="@/assets/boxPlot.png"/>
              </div>
            </v-flex>
          </v-layout>
      </v-tab-item>
    </v-tabs-items>

  </div>
</template>

<script>
import fr from 'apexcharts/dist/locales/fr.json'

export default {
  name: 'PerformanceGraph',
  props: ['ratios', 'sectors', 'naf'],
  mounted() {
  },
  data() {
    return {
      withCA: true,
      graphTab: 0,
      graph: false,
      classeCA: null,
      classeNAF: null,
      exercice: null,
      optionsCA: {
        theme: {
          palette: 'palette3',
        },
        chart: {
          fontFamily: 'Oswald',
          toolbar: {
            show: false,
          },
          type: 'bar',
          width: '50%',
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '13px',
            }
          }
        },
        yaxis: [
          {
            title: {
              text: "Chiffre d'affaire"
            },
            labels: {
              formatter: this.euroAxisFormatter
            }
          },
          {
            opposite: true,
            title: {
              text: "Excédent Brut d'Exploitation"
            },
            labels: {
              formatter: this.euroAxisFormatter
            }
          }
        ]
      },
      optionsSectors: {
        chart: {
          fontFamily: 'Oswald',
          toolbar: {
            show: false,
          },
          type: 'bar',
          width: '50%',
        },
        tooltip: {
          custom: function({ seriesIndex, dataPointIndex, w }) {
            var values = [{
              val: w.globals.seriesCandleO[seriesIndex][dataPointIndex],
              libelle: '10° centile'
            },{
              val: w.globals.seriesCandleH[seriesIndex][dataPointIndex],
              libelle: '25°° centile'
            },{
              val: w.globals.seriesCandleM[seriesIndex][dataPointIndex],
              libelle: '50° centile'
            },{
              val: w.globals.seriesCandleL[seriesIndex][dataPointIndex],
              libelle: '75° centile'
            },{
              val: w.globals.seriesCandleC[seriesIndex][dataPointIndex],
              libelle: '90° centile'
            },{
              val: w.globals.series[1][dataPointIndex],
              libelle: 'entreprise'
            }].sort((v1, v2) => (v1.val > v2.val)?-1:1)

            return '<div class="apexcharts-tooltip-candlestick">' +
                '<table>' +
                values.map(v => {return '<tr><td>'+v.libelle+'</td><td style="text-align: right">'+v.val+' %</td></tr>'}).join('') +

                '</table>'
          }
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '13px',
            }
          }
        },
        legend: {
          show: false
        },
        plotOptions: {
          bar: {
            columnWidth: '40%',
          },
        },
        theme: {
          palette: 'palette5',
        },
        yaxis: {
          tickAmount: 7,
          labels: {
            style: {
              fontSize: '13px',
            },
            formatter: this.percentAxisFormatter
          }
        },
      },
      optionsSig: {
        legend: {
          show: true,
          position: 'right',
        },
        theme: {
          palette: 'palette3',
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
            formatter: this.euroAxisFormatter
          }
        },
        labels: [
          ['Marge Commerciale'],
          ['Excédent Brut d\'Exploitation'],
          ['Résultat d\'Exploitation'],
          ['Résultat Net']
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
    fakeResize() {
      window.dispatchEvent(new Event('resize'));
    },
    euroAxisFormatter(value) {
      if (Math.abs(value) > 1000 && Math.abs(value) < 1000000) {
        const val = Math.round(value/100)/10
        return val.toLocaleString() + ' k€'
      } else if (Math.abs(value) >= 1000000) {
        const val = Math.round(value/100000)/10
        return val.toLocaleString() + ' M€'
      } else {
        return value.toLocaleString() + ' €'
      }
    },
    percentAxisFormatter(value) {
      return (Math.round(value * 10)/10).toLocaleString() + ' %'
    },
    exercices(length) {
      const currentYear = (new Date()).getFullYear()
      return Array(length).fill().map((_, index) => currentYear - index - 1)
    },
  },
  computed: {
    libelleActivite() {
      const niveau = this.sectors[this.perimeter].classeNAF.length
      if (niveau == 1) {
        return "«" + this.naf.libelleSecteur + '» (NAF = ' + this.sectors[this.perimeter].classeNAF + ')'
      } else if (niveau == 2) {
        return "«" + this.naf.libelleN2 + '» (NAF = ' + this.sectors[this.perimeter].classeNAF + '***)'
      } else if (niveau == 3) {
        return "«" + this.naf.libelleN3 + '» (NAF = ' + this.sectors[this.perimeter].classeNAF + '**)'
      } else if (niveau == 4) {
        return "«" + this.naf.libelleN4 + '» (NAF = ' + this.sectors[this.perimeter].classeNAF + '*)'
      } else {
        return "«" + this.naf.libelleActivite + 'NAF = » (' + this.sectors[this.perimeter].classeNAF + ')'
      }
    },
    libelleCA() {
      const classeCA = this.sectors[0].classeCA
      if (classeCA == '<2M') {
        return "inférieur à 2M€"
      } else if (classeCA == '2M-10M') {
        return "compris entre 2M€ et 10M€"
      } else if (classeCA == '10M-50M') {
        return "compris entre 10M€ et 50M€"
      } else {
        return "supérieur à 50M€"
      }
    },
    // perimeters() {
    //   return this.sectors.map(s => {return "CA "+s.classeCA+", naf=" + s.classeNAF + ", " + s.cohorte + " entreprises"})
    // },
    perimeter() {
      return (this.withCA)?0:1
    },
    seriesSectors() {
      if (this.sectors == []) {return [{type: 'boxPlot', data: []}, {type:''}]}
      return [
        {
          type: 'boxPlot',
          data: [{
            x: "Marge Commerciale / CA",
            y: this.sectors[this.perimeter].performance.margeCommerciale,
          },{
            x: "EBE / CA",
            y: this.sectors[this.perimeter].performance.ebe,
          },{
            x: "Résultat d'exploitation / CA",
            y: this.sectors[this.perimeter].performance.ebit
          },{
            x: "Résultat net / CA",
            y: this.sectors[this.perimeter].performance.resultatNet
          }]
        }, {
          type: 'scatter',
          data: [
            {
              x: "Marge Commerciale / CA",
              y: this.ratios[0].performance.partCaMargeCommerciale,
            },{
              x: "EBE / CA",
              y: this.ratios[0].performance.partCaEBE,
            },{
              x: "Résultat d'exploitation / CA",
              y: this.ratios[0].performance.partCaEbit,
            },{
              x: "Résultat net / CA",
              y: this.ratios[0].performance.partCaResultatNet,
            },
          ]}
      ]
    },
    seriesCA() {
      if (this.ratios == null) {return []}
      return [
        {
          name: "Chiffre d'affaires",
          data: this.ratios.reverse().map((exercice) => {return {x: exercice.exercice, y: exercice.performance.chiffreDAffaires}})
        },
        {
          name: "EBE",
          data: this.ratios.reverse().map((exercice) => {return {x: exercice.exercice, y: exercice.performance.ebe}})
        }
      ]
    },
    seriesSig() {
      if (this.ratios == null) {return []}
      return this.ratios
        .slice(0,3)
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

<style scoped>
.value {
  background-color: #111;
  width: 100px;
}
</style>