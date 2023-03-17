<template>
  <div>
    <v-tabs v-model="graphTab">
      <v-tab>Évolution</v-tab>
      <v-tab>Comparaison sectorielle</v-tab>
    </v-tabs>
    <v-tabs-items v-model="graphTab">
      <v-tab-item>
        <apexchart width="100%" height="400px" type="bar" :options="options" :series="series"></apexchart>
      </v-tab-item>
      <v-tab-item>
        <v-layout>
          <v-flex xs6>
            <apexchart width="100%" height="400px" type="boxPlot" :options="optionsSectors1" :series="seriesSectors1"></apexchart>
          </v-flex>
          <v-flex xs3>
            <apexchart width="100%" height="400px" type="boxPlot" :options="optionsSectors2" :series="seriesSectors2"></apexchart>
          </v-flex>
          <v-flex xs3>
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
  name: 'SolvabiliteEtTresorerieGraph',
  props: ['ratios', 'sectors', 'naf'],
  data() {
    return {
      graphTab: 0,
      withCA: true,
      optionsSectors1: {
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
            }].filter(v => v.val).sort((v1, v2) => (v1.val > v2.val) ? -1 : 1)
                .sort((v1, v2) => (v1.val > v2.val)?-1:1)

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
      optionsSectors2: {
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
            }].filter(v => v.val).sort((v1, v2) => (v1.val > v2.val) ? -1 : 1)
                .sort((v1, v2) => (v1.val > v2.val)?-1:1)

            return '<div class="apexcharts-tooltip-candlestick">' +
                '<table>' +
                values.map(v => {return '<tr><td>'+v.libelle+'</td><td style="text-align: right">'+v.val+ ((dataPointIndex==0)?' %':'') +'</td></tr>'}).join('') +

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
        yaxis: [{
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
      },
      options: {
        labels: [
          'Taux d\'endettement',
          ['Ratio de', 'liquidité'],
          ['Ratio de','vétusté'],
          ['Autonomie','financière'],
          ['BFR exploit.','sur CA']
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
  methods: {
    fakeResize() {
      window.dispatchEvent(new Event('resize'));
    },
    percentAxisFormatter(value) {
      return (Math.round(value * 10)/10).toLocaleString() + ' %'
    },
    exercices(length) {
      const currentYear = (new Date()).getFullYear()
      return Array(length).fill().map((_, index) => currentYear - index - 1)
    }
  },
  computed: {
    perimeter() {
      return (this.withCA)?0:1
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
    seriesSectors1() {
      if (this.sectors == []) {return [{type: 'boxPlot', data: []}, {type:''}]}
      return [
        {
          type: 'boxPlot',
          data: [{
            x: "Taux d'endettement",
            y: this.sectors[this.perimeter].solvabiliteEtTresorerie.tauxDEndettement
          },{
            x: "Autonomie financière",
            y: this.sectors[this.perimeter].solvabiliteEtTresorerie.autonomieFinanciere
          },{
            x: "Ratio de vetusté",
            y: this.sectors[this.perimeter].solvabiliteEtTresorerie.ratioDeVetuste
          },{
            x: "Ratio de liquidité",
            y: this.sectors[this.perimeter].solvabiliteEtTresorerie.ratioDeLiquidite
          } ]
        }, {
          type: 'scatter',
          data: [
            {
              x: "Taux d'endettement",
              y: this.ratios[0].solvabiliteEtTresorerie.tauxDEndettement
            },{
              x: "Autonomie financière",
              y: this.ratios[0].solvabiliteEtTresorerie.autonomieFinanciere
            },{
              x: "Ratio de vetusté",
              y: this.ratios[0].solvabiliteEtTresorerie.ratioDeVetuste
            },{
              x: "Ratio de liquidité",
              y: this.ratios[0].solvabiliteEtTresorerie.ratioDeLiquidite
            },
          ]}
      ]
    },
    seriesSectors2() {
      if (this.sectors == []) {return [{type: 'boxPlot', data: []}, {type:''}]}
      return [
        {
          type: 'boxPlot',
          data: [{
            x: "CAF / CA",
            y: this.sectors[this.perimeter].solvabiliteEtTresorerie.cafSurCA
          },{
            x: ["Cap. Remb."],
            y: this.sectors[this.perimeter].solvabiliteEtTresorerie.capaciteDeRemboursement
          }]
        }, {
          type: 'scatter',
          data: [
            {
              x: "CAF / CA",
              y: this.ratios[0].solvabiliteEtTresorerie.cafSurCA
            },{
              x: ["Cap. Remb."],
              y: this.ratios[0].solvabiliteEtTresorerie.capaciteDeRemboursement
            }
          ]}
      ]
    },
    series() {
      if (this.ratios == null) {return []}
      let ratios = this.ratios.slice(0,4).reverse()
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
  }
}

</script>