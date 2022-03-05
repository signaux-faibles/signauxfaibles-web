<template>
  <div>
    <v-toolbar dark color="indigo">
      <v-toolbar-title class="localtoolbar">Comportement de paiement</v-toolbar-title>
      <v-spacer />
      <Help titre="Comportement de paiement">
        <template>
          <p>Les données de comportement de paiement sont des informations exclusives de la société <em>Altarès D&B</em>, qui construit depuis des années une base intitulée « Paydex ».<p>
          <p>La base est constituée grâce des informations liées à la comptabilité client de sociétés participantes au partenariat « DunTrade » qui s’appuie sur un tissu large et étendu de partenaires en France et à l’international.</p>
          <p>Si, à l’échelle de la France, ce sont ainsi des millions d’éléments de facturation qui sont annuellement pris en compte, le nombre de fournisseurs reportés est toutefois un sous-ensemble du nombre de fournisseurs total de l’entreprise.</p>
          <p>Par définition, il pourrait ne pas être représentatif de l’ensemble des relations clients-fournisseurs d’une entreprise. Néanmoins, l’objectif est de donner une représentation fidèle du comportement de paiement plus que du niveau exact de retard réel de l’entreprise étudiée.</p>
        </template>
      </Help>
    </v-toolbar>
    <div>
      <v-layout mt-4 wrap style="font-size: 17px">
        <v-flex md6 xs12>
          <div v-html="introPaiement" class="px-3" ></div>
          <apexchart width="100%" heigth="100%" type="line" :options="options" :series="series"></apexchart>
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

export default {
  name: 'Paiement',
  props: ['siren', 'paydex'],
  components: { Help },
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
    series() {
      if (this.paydex) {
        return [{
          name: 'retards de paiement des fournisseurs',
          data: this.paydex.nb_jours.reduce((data, c, i) => {
            if (c !== null) {
              data.push([
                new Date(this.paydex.date_valeur[i]),
                Math.round(c),
              ])
            }
            return data
          }, []),
        }]
      } else {
        return []
      }
    },
    options() {
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
          yaxis: this.paydex ? [{
            y: this.avg24m,
            borderColor: '#4f8a83',
            label: {
              borderColor: '#4f8a83',
              style: {
                color: '#fff',
                background: '#4f8a83',
              },
              text: 'retard moyen de l\'entreprise : ' + this.avg24m.toFixed(0) + ' jours',
              textAnchor: 'start',
              position: 'left',
            },
          }] : [],
        },
      }
    },
    introPaiement() {
      let introPaiement = ''
      if (this.paydex) {
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
      }
      return introPaiement
    },
    avg24m() {
      return (this.paydex.nb_jours.length > 0) ? this.average(this.paydex.nb_jours) : null
    },
    avg6m() {
      return (this.nbJours6m.length > 0) ? this.average(this.nbJours6m) : null
    },
    nbJours6m() {
      return this.paydex.nb_jours.reduce((nbJours6m, nbj, i) => {
        if (new Date(this.paydex.date_valeur[i]) >= this.date6m) {
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