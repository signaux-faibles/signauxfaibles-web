<template>
  <div v-if="paydex">
    {{ series }}
    <v-toolbar dark color="indigo">
      <v-toolbar-title class="localtoolbar">Comportement de paiement</v-toolbar-title>
      <v-spacer />
      <Gitbook icon :target="gitbookPath('PAYDEX')"/>
    </v-toolbar>
    <div>
      <v-layout mt-4 wrap style="font-size: 17px">
        <v-flex md6 xs12>
          <div v-html="introPaiement" class="px-3" ></div>
          <apexchart width="100%" heigth="100%" type="line" :options="optionsJoursRetard" :series="seriesJoursRetard"></apexchart>
          <apexchart width="100%" heigth="100%" type="bar" :options="optionsFPI" :series="seriesFPI"></apexchart>

        </v-flex>
        <v-flex md6 xs12>
          <v-layout fill-height align-center justify-center>
            <v-flex md6 xs12 style="text-align: justify; font-size: 14px; font-weight: 400; font-family: 'Roboto', sans-serif">
              <p>Ce graphique illustre le comportement de paiement de l’entreprise vis à vis de ses créanciers (fournisseurs) à partir du nombre de jours de retard mensuel sur les 24 derniers mois.</p>
              <p>Un retard de paiement en détérioration – soit la hausse du retard moyen d’une entreprise dans le règlement de ses factures fournisseurs – constitue un signal avant-coureur de tensions de trésorerie ou d’un changement de politique relation client-fournisseur susceptible de déstabiliser l’entreprise.</p>
              <p>Le retard moyen des entreprises référencées par Signaux Faibles (plus de 10 salariés) et couvertes par les données (56% des entreprises) est de l’ordre de 12 jours. Celui-ci peut néanmoins varier de 10 à 28 jours selon le secteur d’activité.</p>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
    
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
import Gitbook from "@/components/Gitbook.vue";

function customTooltipFPI(fournisseurs, encours, dateString, experiencesPaiement, fpi00,  fpi30_90, fpi90) {
  return `` +
    `<div class="customTooltipTitle"><span class="apexcharts-tooltip-text-y-label">${dateString}</span></div>` +
    `<div class="customTooltipBody">` +
      `${fpi00}% des paiements avant 30 jours de retard<br/>` +
      `${fpi30_90}% des paiements entre 30 et 90 jours de retard<br/>` +
      `${fpi90}% des paiements après 90 jours de retard<br style="margin-bottom: 10px"/>` +
      `<b>statistiques basées sur:<br/></b><ul>` +
      `<li>${(experiencesPaiement)?experiencesPaiement + ' paiements':'paiements: non connu' }</li>` +
      `<li>${(fournisseurs)?fournisseurs + ' fournisseurs':'fournisseurs: non connu' }</li>` +
      `<li>${(encours)?Math.round(encours) + '€ d\'encours fournisseurs':'encours fournisseurs: non connu' }</li><ul/>` +
    `</div>`
}

export default {
  name: 'Paiement',
  props: ['siren', 'paydex'],
  components: {Gitbook, Help },
  data() {
    return {
      tiers: [0, 15, 30, 60],
      variationThresholds: [0.1, 0.25, 0.5],
    }
  },
  methods: {
    average(array) {
      const total = array.reduce((acc, c) => acc + c, 0)
      return total / array.length
    },
  },
  computed: {
    seriesFPI() {
      if (this.paydex) {
        return [{
          name: 'moins de 30 jours',
          data: this.paydex.fpi30.map((p) => {return 100-p}),
          fournisseurs: this.paydex.fournisseurs,
          encours: this.paydex.encours,
          experiencesPaiement: this.paydex.experiencesPaiement,
        },
          {
          name: 'entre 30 et 90 jours',
          data: this.paydex.fpi30.map((p, i) => {return p-this.paydex.fpi90[i]}),
        }, {
          name: 'plus de 90 jours',
          data: this.paydex.fpi90,
        }]
      } else {
        return []
      }
    },
    optionsFPI() {
      return {
        colors: ['#4f8a83', '#fac699', '#e76278'],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: true,
          showForSingleSeries: false,
          showForNullSeries: false,
          showForZeroSeries: false,
        },
        tooltip: {
          custom: function ({series, seriesIndex, dataPointIndex, w}) {
            const fournisseur = w.config.series[0].fournisseurs[dataPointIndex]
            const encours = w.config.series[0].encours[dataPointIndex]
            const experiencesPaiement = w.config.series[0].experiencesPaiement[dataPointIndex]
            const fpi00 = w.config.series[0].data[dataPointIndex]
            const fpi30_90 = w.config.series[1].data[dataPointIndex]
            const fpi90 = w.config.series[2].data[dataPointIndex]
            const date = new Date(w.config.xaxis.categories[dataPointIndex])
            const dateString = ('0' + (date.getUTCMonth() + 1)).slice(-2) + '/' + date.getUTCFullYear()
            return customTooltipFPI(fournisseur, encours, dateString, experiencesPaiement, fpi00, fpi30_90, fpi90)
          },
        },
        theme: {
          mode: 'light',
          palette: 'palette7',
        },
        chart: {
          stacked: true,
          stackType: "100%",
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          id: 'répartition des paiement',
        },
        xaxis: {
          type: 'datetime',
          categories: this.paydex.dateValeur
        },
        yaxis: {
          min: 0,
        },
        noData: {
          text: 'Il n\'y a pas de données associées',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
        },
      }
    },
    seriesJoursRetard() {
      if (this.paydex) {
        return [{
          name: 'retards de paiement des fournisseurs',
          data: this.paydex.joursRetard.reduce((data, c, i) => {
            data.push([
              new Date(this.paydex.dateValeur[i]),
              Math.round(this.paydex.joursRetard[i]),
            ])
            return data
          }, []),
        }]
      } else {
        return []
      }
    },
    optionsJoursRetard() {
      return {
        legend: {
          show: true,
          showForSingleSeries: true,
          showForNullSeries: false,
          showForZeroSeries: false,
        },
        tooltip: {
          enabled: true,
          x: {
            format: 'MM/yyyy',
          },
          y: {
            formatter(val) {
              return parseInt(val, 10) + ' jours'
            },
          },
        },
        theme: {
          mode: 'light',
          palette: 'palette7',
        },
        chart: {
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          id: 'retards de paiement des fournisseurs',
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          min: 0,
          title: {
            text: 'jours de retard',
          },
          labels: {
            formatter(val, index) {
              return val.toFixed(0)
            },
          },
        },
        colors: ['#4f8a83'],
        fill: {
          type: ['solid'],
          colors: ['#4f8a83'],
        },
        stroke: {
          curve: ['smooth'],
          width: [5],
        },
        noData: {
          text: 'Il n\'y a pas de données associées',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
        },
        annotations: {
          position: 'front',
          xaxis: this.paydex ? [{
            x: new Date('17 Mar 2020').getTime(),
            x2: new Date('11 May 2020').getTime(),
            borderColor: '#373D3F',
            fillColor: '#373D3F',
            opacity: 0.1,
            label: {
              text: 'Confinement national n°1',
              borderColor: '#373D3F',
              style: {
                color: '#fff',
                background: '#373D3F',
              },
            },
          }, {
            x: new Date('30 Oct 2020').getTime(),
            x2: new Date('15 Dec 2020').getTime(),
            borderColor: '#373D3F',
            fillColor: '#373D3F',
            opacity: 0.1,
            label: {
              text: 'Confinement national n°2',
              borderColor: '#373D3F',
              style: {
                color: '#fff',
                background: '#373D3F',
              },
            },
          }] : [],
        },
      }
    },
    introPaiement() {
      let introPaiement = ''
        if (this.avg24m === this.tiers[0]) {
          introPaiement += 'Cette entreprise ne présente jamais de retard de paiement sur les 24 derniers mois.'
        } else if (this.avg24m > this.tiers[0] && this.avg24m <= this.tiers[1]) {
          introPaiement += 'Cette entreprise présente des retards de paiement peu significatifs sur les 24 derniers mois.'
        } else if (this.avg24m > this.tiers[1] && this.avg24m <= this.tiers[2]) {
          introPaiement += 'Cette entreprise présente des retards de paiement à surveiller sur les 24 derniers mois.'
        } else if (this.avg24m > this.tiers[2] && this.avg24m <= this.tiers[3]) {
          introPaiement += 'Cette entreprise présente des retards de paiement inquiétants sur les 24 derniers mois.'
        } else if (this.avg24m > this.tiers[3]) {
          introPaiement += 'Cette entreprise présente des retards de paiement très préoccupants sur les 24 derniers mois.'
        }
        if (this.variation > this.variationThresholds[2]) {
          introPaiement += '<br>Son comportement est en très forte détérioration sur les 6 derniers mois.'
        } else if (this.variation > this.variationThresholds[1]) {
          introPaiement += '<br>Son comportement est en forte détérioration sur les 6 derniers mois.'
        } else if (this.variation > this.variationThresholds[0]) {
          introPaiement += '<br>Son comportement est en détérioration sur les 6 derniers mois.'
        } else if (this.variation < -this.variationThresholds[2]) {
          introPaiement += '<br>Son comportement est en très forte amélioration sur les 6 derniers mois.'
        } else if (this.variation < -this.variationThresholds[1]) {
          introPaiement += '<br>Son comportement est en forte amélioration sur les 6 derniers mois.'
        } else if (this.variation < -this.variationThresholds[0]) {
          introPaiement += '<br>Son comportement est en amélioration sur les 6 derniers mois.'
        }
      return introPaiement
    },
    avg24m() {
      return (this.paydex.joursRetard.length > 0) ? this.average(this.paydex.joursRetard) : null
    },
    avg6m() {
      return (this.nbJours6m.length > 0) ? this.average(this.nbJours6m) : null
    },
    nbJours6m() {
      return this.paydex.joursRetard.reduce((nbJours6m, nbj, i) => {
        if (new Date(this.paydex.dateValeur[i]) >= this.date6m) {
          nbJours6m = nbJours6m.concat(nbj)
        }
        return nbJours6m
      }, [])
    },
    date6m() {
      const date6m = new Date()
      date6m.setMonth(date6m.getMonth() - 6)
      date6m.setDate(1)
      date6m.setUTCHours(0, 0, 0)
      return date6m
    },
    variation() {
      if (this.avg6m != null) {
        const diff = this.avg6m - this.avg24m
        return diff / Math.abs(this.avg24m)
      } else {
        return null
      }
    },
  },
}
</script>

<style
>
.customTooltip {
  border-radius: 5px;
}
.customTooltipTitle {
  padding:5px;
  padding-left: 7px;
  font-family: Helvetica,Arial,sans-serif;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: 1px solid #dddddd;
  background-color: #eceff1;
}
.customTooltipBody {
  padding: 10px;
}
</style>