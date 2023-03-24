<template>
  <div>
    <v-tabs v-model="graphTab">
      <v-tab @click="trackMatomoEvent('finoscope', 'performance_evolution_graph', siren)">Soldes intermédiaires de
        gestion
      </v-tab>
      <v-tab @click="trackMatomoEvent('finoscope', 'performance_ca_ebe_graph', siren)">CA et EBE/CA</v-tab>
      <v-tab @click="trackMatomoEvent('finoscope', 'performance_sectoriel_graph', siren)">Comparaison sectorielle
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="graphTab">
      <v-tab-item>
        <apexchart
            :options="optionsSig"
            :series="seriesSig"
            height="400px"
            type="bar"
            width="100%"
        />
      </v-tab-item>
      <v-tab-item>
        <apexchart
            :options="optionsCA"
            :series="seriesCA"
            height="400px"
            type="line"
            width="100%"
        />
      </v-tab-item>
      <v-tab-item>
        <v-layout>
          <v-flex xs8>
            <apexchart
                :options="optionsSectors"
                :series="seriesSectors"
                height="400px"
                type="boxPlot"
                width="100%"
            />
          </v-flex>
          <v-flex xs4>
            <v-switch
                v-model="withCA"
                :label="'Comparer aux entreprises ayant un chiffre d\'affaires ' + libelleCA"
                v-on:change="fakeResize"
            ></v-switch>
            Cette comparaison se base sur les {{ sectors[perimeter].cohorte }} bilans déposés publiquement pour
            l'exercice {{ sectors[perimeter].exercice }}
            dans le secteur d'activité de niveau {{ sectors[perimeter].classeNAF.length }} {{ libelleActivite }}
            <div style="padding-top: 5px; text-align: center;" width="100%">
              légende<br/>
              <img src="@/assets/boxPlot.png" width="90%"/>
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
  props: ['ratios', 'sectors', 'naf', 'siren'],
  mounted() {
    this.trackMatomoEvent('finoscope', 'performance_evolution_graph', this.siren)
  },
  data() {
    return {
      withCA: true,
      graphTab: 0,
      graph: false,
      classeCA: null,
      classeNAF: null,
      exercice: null,
      optionsSig: {
        states: {
          active: {
            filter: {
              type: 'none' /* none, lighten, darken */
            }
          }
        },
        selection: false,
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
            formatter: function (value, {series, seriesIndex, dataPointIndex, w}) {
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
        const val = Math.round(value / 100) / 10
        return val.toLocaleString() + ' k€'
      } else if (Math.abs(value) >= 1000000) {
        const val = Math.round(value / 100000) / 10
        return val.toLocaleString() + ' M€'
      } else {
        return value.toLocaleString() + ' €'
      }
    },
    percentAxisFormatter(value) {
      return (Math.round(value * 10) / 10).toLocaleString() + ' %'
    },
    exercices(length) {
      const currentYear = (new Date()).getFullYear()
      return Array(length).fill().map((_, index) => currentYear - index - 1)
    },
    sortCloture(e1, e2) {
      return (e1.dateClotureExercice < e2.dateClotureExercice) ? -1 : 1
    }
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
        return "«" + this.naf.libelleActivite + '» (NAF = ' + this.sectors[this.perimeter].classeNAF + ')'
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
    perimeter() {
      return (this.withCA) ? 0 : 1
    },
    seriesSectors() {
      if (this.sectors == []) {
        return [{type: 'boxPlot', data: []}, {type: ''}]
      }
      return [
        {
          type: 'boxPlot',
          data: [{
            x: ["Marge commerciale", "sur chiffre d'affaires"],
            y: this.sectors[this.perimeter].performance.partCaMargeCommerciale,
          }, {
            x: ["Excédent brut d'exploitation", "sur chiffre d'affaires"],
            y: this.sectors[this.perimeter].performance.partCaEbe,
          }, {
            x: ["Résultat d'exploitation", "sur chiffre d'affaires"],
            y: this.sectors[this.perimeter].performance.partCaEbit
          }, {
            x: ["Résultat net", "sur chiffre d'affaire"],
            y: this.sectors[this.perimeter].performance.partCaResultatNet
          }]
        }, {
          type: 'scatter',
          data: [
            {
              x: ["Marge commerciale", "sur chiffre d'affaires"],
              y: this.ratios[0].performance.partCaMargeCommerciale,
            }, {
              x: ["Excédent brut d'exploitation", "sur chiffre d'affaires"],
              y: this.ratios[0].performance.partCaEBE,
            }, {
              x: ["Résultat d'exploitation", "sur chiffre d'affaires"],
              y: this.ratios[0].performance.partCaEbit,
            }, {
              x: ["Résultat net", "sur chiffre d'affaire"],
              y: this.ratios[0].performance.partCaResultatNet,
            },
          ]
        }
      ]
    },
    seriesCA() {
      if (this.ratios == null) {
        return []
      }
      return [
        {
          name: "Chiffre d'affaires",
          data: [...this.ratios]
              .sort(this.sortCloture)
              .map((exercice) => {
                return {x: exercice.exercice, y: exercice.performance.chiffreDAffaires}
              })
        },
        {
          name: "Excédent brut d'exploitation sur chiffre d'affaire",
          data: [...this.ratios]
              .sort(this.sortCloture)
              .map((exercice) => {
                return {x: exercice.exercice, y: exercice.performance.partCaEBE}
              })
        }
      ]
    },
    seriesSig() {
      if (this.ratios == null) {
        return []
      }
      return [...this.ratios]
          .slice(0, 4)
          .sort(this.sortCloture)
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
    minSectors() {
      return Math.floor(
          Math.min(
              ...Object.values(this.sectors[0].performance).map(s => s[0]),
              ...Object.values(this.sectors[1].performance).map(s => s[0]),
              this.ratios[0].performance.partCaMargeCommerciale,
              this.ratios[0].performance.partCaEBE,
              this.ratios[0].performance.partCaResultatNet,
              this.ratios[0].performance.partCaEbit,
          )/5
      )*5 - 5
    },
    maxSectors() {
      return Math.ceil(
          Math.max(
              ...Object.values(this.sectors[0].performance).map(s => s[4]),
              ...Object.values(this.sectors[1].performance).map(s => s[4]),
              this.ratios[0].performance.partCaMargeCommerciale,
              this.ratios[0].performance.partCaEBE,
              this.ratios[0].performance.partCaResultatNet,
              this.ratios[0].performance.partCaEbit,
          )/5
      )*5
    },
    optionsSectors() {
      return {
        states: {
          active: {
            filter: {
              type: 'none' /* none, lighten, darken */
            }
          }
        },
        chart: {
          fontFamily: 'Oswald',
          toolbar: {
            show: false,
          },
          type: 'bar',
          width: '50%',
        },
        colors: ['#008FFB', '#FEB019'],
        tooltip: {
          custom: function ({seriesIndex, dataPointIndex, w}) {
            var values = [{
              val: w.globals.seriesCandleO[0][dataPointIndex],
              libelle: '10<sup>e</sup> centile'
            }, {
              val: w.globals.seriesCandleH[0][dataPointIndex],
              libelle: '25<sup>e</sup> centile'
            }, {
              val: w.globals.seriesCandleM[0][dataPointIndex],
              libelle: '50<sup>e</sup> centile'
            }, {
              val: w.globals.seriesCandleL[0][dataPointIndex],
              libelle: '75<sup>e</sup> centile'
            }, {
              val: w.globals.seriesCandleC[0][dataPointIndex],
              libelle: '90<sup>e</sup> centile'
            }, {
              val: w.globals.series[1][dataPointIndex],
              libelle: 'entreprise'
            }].filter(v => !isNaN(v.val)).sort((v1, v2) => (v1.val > v2.val) ? -1 : 1)
                .sort((v1, v2) => (v1.val > v2.val) ? -1 : 1)

            return '<div class="apexcharts-tooltip-candlestick">' +
                '<table>' +
                values.map(v => {
                  return '<tr><td>' + v.libelle + '</td><td style="text-align: right">' + (Math.round(v.val * 10) / 10).toLocaleString() + ' %</td></tr>'
                }).join('') +

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
          boxPlot: {
            colors: {
              upper: '#13d8aa',
              lower: '#33b2df'
            }
          },
          bar: {
            columnWidth: '40%',
          },
        },
        theme: {
          palette: 'palette5',
        },
        yaxis: {
          min: this.minSectors,
          max: this.maxSectors,
          tickAmount: 7,
          labels: {
            style: {
              fontSize: '13px',
            },
            formatter: this.percentAxisFormatter
          }
        },
      }
    },
    optionsCA() {
      return {
        states: {
          active: {
            filter: {
              type: 'none' /* none, lighten, darken */
            }
          }
        },
        theme: {
          palette: 'palette3',
        },
        chart: {
          fontFamily: 'Oswald',
          toolbar: {
            show: false,
          },
          type: 'line',
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
            max: Math.max(0, Math.round(Math.max(...(this.seriesCA[1].data.map(d => d.y))) * 2.5)),
            title: {
              text: "Excédent Brut d'Exploitation sur chiffre d'affaires"
            },
            labels: {
              formatter: this.percentAxisFormatter
            }
          }
        ]
      }
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