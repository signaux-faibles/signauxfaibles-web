<template>
  <div>
    <v-tabs v-model="graphTab">
      <v-tab @click="trackMatomoEvent('finoscope', 'solvabilite_tresorerie_evolution_graph', siren)">Évolution</v-tab>
      <v-tab @click="trackMatomoEvent('finoscope', 'solvabilite_tresorerie_sectoriel_graph', siren)">Comparaison
        sectorielle
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="graphTab">
      <v-tab-item>
        <apexchart :options="options" :series="series" height="400px" type="bar" width="100%"></apexchart>
      </v-tab-item>
      <v-tab-item>
        <v-layout wrap>
          <v-flex style="text-align: center" xs8>
            <div style="position: relative; top: 30px">
              Exercice {{ sectors[perimeter].exercice }}
            </div><br/>
          </v-flex><v-flex xs4></v-flex>
          <v-flex xs6>
            <apexchart :options="optionsSectors1" :series="seriesSectors1" height="400px" type="boxPlot"
                       width="100%"></apexchart>
          </v-flex>
          <v-flex xs3>
            <apexchart :options="optionsSectors2" :series="seriesSectors2" height="400px" type="boxPlot"
                       width="100%"></apexchart>
          </v-flex>
          <v-flex xs3>
            <v-switch
                v-model="withCA"
                :label="'Comparer aux entreprises ayant un chiffre d\'affaires ' + libelleCA"
                @click="trackMatomoEvent('finoscope', 'solvabilite_tresorerie_graph_switch_sector_', siren)"
                @change="fakeResize"
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
  name: 'SolvabiliteEtTresorerieGraph',
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
        labels: [
          'Taux d\'endettement',
          ['Ratio de', 'liquidité'],
          ['Ratio de', 'vétusté'],
          ['Autonomie', 'financière'],
          ['BFR exploit.', 'sur CA']
        ],
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
            formatter: this.percentAxisFormatter
          },
        },
        theme: {
          palette: 'palette3',
        },
        tooltip: {
          y: {
            formatter: this.percentAxisFormatter
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
    this.trackMatomoEvent('finoscope', 'solvabilite_tresorerie_evolution_graph', this.siren)
  },
  methods: {
    fakeResize() {
      window.dispatchEvent(new Event('resize'));
    },
    percentAxisFormatter(value) {
      return (Math.round(value * 10) / 10).toLocaleString() + ' %'
    },
    exercices(length) {
      const currentYear = (new Date()).getFullYear()
      return Array(length).fill().map((_, index) => currentYear - index - 1)
    }
  },
  computed: {
    minSectors1() {
      return Math.floor(
          Math.min(
              this.sectors[0].solvabiliteEtTresorerie.tauxDEndettement[0],
              this.sectors[0].solvabiliteEtTresorerie.autonomieFinanciere[0],
              this.sectors[0].solvabiliteEtTresorerie.ratioDeVetuste[0],
              this.sectors[0].solvabiliteEtTresorerie.ratioDeLiquidite[0],
              this.sectors[1].solvabiliteEtTresorerie.tauxDEndettement[0],
              this.sectors[1].solvabiliteEtTresorerie.autonomieFinanciere[0],
              this.sectors[1].solvabiliteEtTresorerie.ratioDeVetuste[0],
              this.sectors[1].solvabiliteEtTresorerie.ratioDeLiquidite[0],
              this.ratios[0].solvabiliteEtTresorerie.tauxDEndettement,
              this.ratios[0].solvabiliteEtTresorerie.autonomieFinanciere,
              this.ratios[0].solvabiliteEtTresorerie.ratioDeVetuste,
              this.ratios[0].solvabiliteEtTresorerie.ratioDeLiquidite,
          ) / 5
      ) * 5 - 5
    },
    maxSectors1() {
      return Math.floor(
          Math.max(
              this.sectors[0].solvabiliteEtTresorerie.tauxDEndettement[4],
              this.sectors[0].solvabiliteEtTresorerie.autonomieFinanciere[4],
              this.sectors[0].solvabiliteEtTresorerie.ratioDeVetuste[4],
              this.sectors[0].solvabiliteEtTresorerie.ratioDeLiquidite[4],
              this.sectors[1].solvabiliteEtTresorerie.tauxDEndettement[4],
              this.sectors[1].solvabiliteEtTresorerie.autonomieFinanciere[4],
              this.sectors[1].solvabiliteEtTresorerie.ratioDeVetuste[4],
              this.sectors[1].solvabiliteEtTresorerie.ratioDeLiquidite[4],
              this.ratios[0].solvabiliteEtTresorerie.tauxDEndettement,
              this.ratios[0].solvabiliteEtTresorerie.autonomieFinanciere,
              this.ratios[0].solvabiliteEtTresorerie.ratioDeVetuste,
              this.ratios[0].solvabiliteEtTresorerie.ratioDeLiquidite,
          ) / 5
      ) * 5 + 5
    },
    minSectors2() {
      return Math.floor(
          Math.min(
              this.sectors[0].solvabiliteEtTresorerie.cafSurCA[0],
              this.sectors[0].solvabiliteEtTresorerie.capaciteDeRemboursement[0],
              this.sectors[1].solvabiliteEtTresorerie.cafSurCA[0],
              this.sectors[1].solvabiliteEtTresorerie.capaciteDeRemboursement[0],
              this.ratios[0].solvabiliteEtTresorerie.cafSurCA,
              this.ratios[0].solvabiliteEtTresorerie.capaciteDeRemboursement,
          ) / 5
      ) * 5 - 5
    },
    maxSectors2() {
      return Math.floor(
          Math.max(
              this.sectors[0].solvabiliteEtTresorerie.cafSurCA[0],
              this.sectors[0].solvabiliteEtTresorerie.capaciteDeRemboursement[0],
              this.sectors[1].solvabiliteEtTresorerie.cafSurCA[4],
              this.sectors[1].solvabiliteEtTresorerie.capaciteDeRemboursement[4],
              this.ratios[0].solvabiliteEtTresorerie.cafSurCA,
              this.ratios[0].solvabiliteEtTresorerie.capaciteDeRemboursement,
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
    seriesSectors1() {
      if (this.sectors == []) {
        return [{type: 'boxPlot', data: []}, {type: ''}]
      }
      return [
        {
          type: 'boxPlot',
          data: [{
            x: "Taux d'endettement",
            y: this.sectors[this.perimeter].solvabiliteEtTresorerie.tauxDEndettement
          }, {
            x: "Autonomie financière",
            y: this.sectors[this.perimeter].solvabiliteEtTresorerie.autonomieFinanciere
          }, {
            x: "Ratio de vetusté",
            y: this.sectors[this.perimeter].solvabiliteEtTresorerie.ratioDeVetuste
          }, {
            x: "Ratio de liquidité",
            y: this.sectors[this.perimeter].solvabiliteEtTresorerie.ratioDeLiquidite
          }]
        }, {
          type: 'scatter',
          data: [
            {
              x: "Taux d'endettement",
              y: this.ratios[0].solvabiliteEtTresorerie.tauxDEndettement
            }, {
              x: "Autonomie financière",
              y: this.ratios[0].solvabiliteEtTresorerie.autonomieFinanciere
            }, {
              x: "Ratio de vetusté",
              y: this.ratios[0].solvabiliteEtTresorerie.ratioDeVetuste
            }, {
              x: "Ratio de liquidité",
              y: this.ratios[0].solvabiliteEtTresorerie.ratioDeLiquidite
            },
          ]
        }
      ]
    },
    seriesSectors2() {
      if (this.sectors == []) {
        return [{type: 'boxPlot', data: []}, {type: ''}]
      }
      return [
        {
          type: 'boxPlot',
          data: [{
            x: "CAF / CA",
            y: this.sectors[this.perimeter].solvabiliteEtTresorerie.cafSurCA
          }, {
            x: ["Cap. Remb."],
            y: this.sectors[this.perimeter].solvabiliteEtTresorerie.capaciteDeRemboursement
          }]
        }, {
          type: 'scatter',
          data: [
            {
              x: "CAF / CA",
              y: this.ratios[0].solvabiliteEtTresorerie.cafSurCA
            }, {
              x: ["Cap. Remb."],
              y: this.ratios[0].solvabiliteEtTresorerie.capaciteDeRemboursement
            }
          ]
        }
      ]
    },
    series() {
      if (this.ratios == null) {
        return []
      }
      let ratios = this.ratios.slice(0, 4).reverse()
      return ratios
          .map((exercice) => {
            return {
              name: exercice.exercice,
              data: [
                exercice.solvabiliteEtTresorerie.tauxDEndettement,
                exercice.solvabiliteEtTresorerie.autonomieFinanciere,
                exercice.solvabiliteEtTresorerie.ratioDeVetuste,
                exercice.solvabiliteEtTresorerie.cafSurCA,
                exercice.solvabiliteEtTresorerie.ratioDeLiquidite,
              ]
            }
          })
    },
    optionsSectors1() {
      return {
        chart: {
          fontFamily: 'Oswald',
          toolbar: {
            show: false,
          },
          type: 'bar',
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
            }].filter(v => v.val).sort((v1, v2) => (v1.val > v2.val) ? -1 : 1)
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
          min: this.minSectors1,
          max: this.maxSectors1,
          tickAmount: 7,
          labels: {
            style: {
              fontSize: '13px',
            },
            formatter: this.percentAxisFormatter
          }
        }
      }
    },
    optionsSectors2() {
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
            }].filter(v => v.val).sort((v1, v2) => (v1.val > v2.val) ? -1 : 1)
                .sort((v1, v2) => (v1.val > v2.val) ? -1 : 1)

            return '<div class="apexcharts-tooltip-candlestick">' +
                '<table>' +
                values.map(v => {
                  return '<tr><td>' + v.libelle + '</td><td style="text-align: right">' + (Math.round(v.val * 10) / 10).toLocaleString() + ((dataPointIndex == 0) ? ' %' : '') + '</td></tr>'
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
        yaxis: [{
          min: this.minSectors2,
          max: this.maxSectors2,
          tickAmount: 7,
          labels: {
            style: {
              fontSize: '13px',
            },
            formatter: this.percentAxisFormatter
          }
        }, {
          opposite: true,
          tickAmount: 7,
          labels: {
            style: {
              fontSize: '13px',
            },
          }
        }]
      }
    }
  }
}

</script>