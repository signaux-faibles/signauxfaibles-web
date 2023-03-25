<template>
  <div>
    <v-tabs v-model="graphTab">
      <v-tab @click="trackMatomoEvent('finoscope', 'gestion_evolution_graph', siren)">Évolution</v-tab>
      <v-tab @click="trackMatomoEvent('finoscope', 'gestion_sectoriel_graph', siren)">Comparaison sectorielle</v-tab>
    </v-tabs>
    <v-tabs-items v-model="graphTab">
      <v-tab-item>
        <apexchart :options="options" :series="series" height="400px" type="bar" width="100%"></apexchart>
      </v-tab-item>
      <v-tab-item>
        <v-layout>
          <v-flex style="text-align: center" xs8>
            <div style="position: relative; top: 30px">
              Exercice {{ sectors[perimeter].exercice }}
            </div>
            <br/>
            <apexchart :options="optionsSectors" :series="seriesSectors" height="400px" type="boxPlot"
                       width="100%"></apexchart>
            <br/>
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
  name: 'BilanGraph',
  props: ['ratios', 'sectors', 'naf', 'siren'],
  data() {
    return {
      graphTab: 0,
      withCA: true,

      options: {
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
          labels: {
            formatter: this.joursAxisFormatter
          },
        },
        theme: {
          palette: 'palette3',
        },
        labels: [
          ['BFR exploitation sur CA'],
          ['Rotation des', 'stocks'],
          ['Crédit fournisseurs'],
          ['Crédit clients'],
        ],
        tooltip: {
          y: {
            formatter: this.joursAxisFormatter
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
  mounted() {
    this.trackMatomoEvent('finoscope', 'gestion_evolution_graph', this.siren)
  },
  methods: {
    fakeResize() {
      window.dispatchEvent(new Event('resize'));
    },
    exercices(length) {
      const currentYear = (new Date()).getFullYear()
      return Array(length).fill().map((_, index) => currentYear - index - 1)
    },
    joursAxisFormatter(value) {
      return value.toLocaleString() + ' jours'
    },
  },
  computed: {
    minSectors() {
      return Math.floor(
          Math.min(
              this.sectors[0].gestion.poidsBfrExploitationSurCAJours[0],
              this.sectors[0].gestion.rotationDesStocks[0],
              this.sectors[0].gestion.creditClients[0],
              this.sectors[0].gestion.creditFournisseurs[0],
              this.sectors[1].gestion.poidsBfrExploitationSurCAJours[0],
              this.sectors[1].gestion.rotationDesStocks[0],
              this.sectors[1].gestion.creditClients[0],
              this.sectors[1].gestion.creditFournisseurs[0],
              this.ratios[0].gestion.poidsBfrExploitationSurCAJours,
              this.ratios[0].gestion.rotationDesStocks,
              this.ratios[0].gestion.creditClients,
              this.ratios[0].gestion.creditFournisseurs,
          ) / 5
      ) * 5 - 5
    },
    maxSectors() {
      return Math.ceil(
          Math.max(
              this.sectors[0].gestion.poidsBfrExploitationSurCAJours[4],
              this.sectors[0].gestion.rotationDesStocks[4],
              this.sectors[0].gestion.creditClients[4],
              this.sectors[0].gestion.creditFournisseurs[4],
              this.sectors[1].gestion.poidsBfrExploitationSurCAJours[4],
              this.sectors[1].gestion.rotationDesStocks[4],
              this.sectors[1].gestion.creditClients[4],
              this.sectors[1].gestion.creditFournisseurs[4],
              this.ratios[0].gestion.poidsBfrExploitationSurCAJours,
              this.ratios[0].gestion.rotationDesStocks,
              this.ratios[0].gestion.creditClients,
              this.ratios[0].gestion.creditFournisseurs,
          ) / 5
      ) * 5 + 5
    },
    perimeter() {
      return (this.withCA) ? 0 : 1
    },
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
    seriesSectors() {
      if (this.sectors == []) {
        return [{type: 'boxPlot', data: []}, {type: ''}]
      }
      return [
        {
          type: 'boxPlot',
          data: [{
            x: "BFR Exploitation",
            y: this.sectors[this.perimeter].gestion.poidsBfrExploitationSurCAJours,
          }, {
            x: "Rotation des stocks",
            y: this.sectors[this.perimeter].gestion.rotationDesStocks,
          }, {
            x: "Crédit Clients",
            y: this.sectors[this.perimeter].gestion.creditClients,
          }, {
            x: "Crédit Fournisseur",
            y: this.sectors[this.perimeter].gestion.creditFournisseurs,
          }]
        }, {
          type: 'scatter',
          data: [
            {
              x: "BFR Exploitation",
              y: this.ratios[0].gestion.poidsBfrExploitationSurCAJours,
            }, {
              x: "Rotation des stocks",
              y: this.ratios[0].gestion.rotationDesStocks
            }, {
              x: "Crédit Clients",
              y: this.ratios[0].gestion.creditClients,
            }, {
              x: "Crédit Fournisseur",
              y: this.ratios[0].gestion.creditFournisseurs,
            },
          ]
        }
      ]
    },
    series() {
      if (this.ratios == null) {
        return []
      }
      return this.ratios
          .slice(0, 4)
          .sort((e1, e2) => (e1.dateClotureExercice.getTime() > e2.dateClotureExercice.getTime()) ? 1 : -1)
          .map((exercice) => {
            return {
              name: exercice.exercice,
              data: [
                exercice.gestion.poidsBfrExploitationSurCAJours,
                exercice.gestion.rotationDesStocks,
                exercice.gestion.creditFournisseurs,
                exercice.gestion.creditClients,
              ]
            }
          })
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
        },
        colors: ['#008FFB', '#FEB019'],
        tooltip: {
          custom({seriesIndex, dataPointIndex, w}) {
            var values = [{
              val: w.globals.seriesCandleO[0][dataPointIndex],
              libelle: '10<sup>e</sup> centile'
            }, {
              val: w.globals.seriesCandleH[0][dataPointIndex],
              libelle: '25<sup>e</sup> centile'
            }, {
              val: w.globals.seriesCandleM[0][dataPointIndex],
              libelle: 'médiane'
            }, {
              val: w.globals.seriesCandleL[0][dataPointIndex],
              libelle: '75<sup>e</sup> centile'
            }, {
              val: w.globals.seriesCandleC[0][dataPointIndex],
              libelle: '90<sup>e</sup> centile'
            }, {
              val: w.globals.series[1][dataPointIndex],
              libelle: 'entreprise'
            }].filter(v => v.val).sort((v1, v2) => (v1.val > v2.val) ? -1 : 1)
            return '<div class="apexcharts-tooltip-candlestick">' +
                '<table>' +
                values.map(v => {
                  return '<tr><td>' + v.libelle + '</td><td style="text-align: right">' + Math.round(v.val * 10) / 10 + ' jours</td></tr>'
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
            formatter: this.joursAxisFormatter
          }
        },
      }
    },
  },
}

</script>