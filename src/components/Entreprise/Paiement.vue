<template>
  <div>
    <v-toolbar dark color="indigo darken-5">
      <v-toolbar-title class="localtoolbar">Comportement de paiement</v-toolbar-title>
      <v-spacer />
      <Help titre="Comportement de paiement">
        <template>
          <p>Ce graphique illustre le comportement de paiement de l'entreprise vis à vis de ses créanciers à partir du nombre de jours de retard mensuel sur les 24 derniers mois.</p>
          <p>Le retard moyen à l'échelle de Signaux Faibles est de l'ordre de 12 jours mais celui-ci peut varier de 10 à 28 jours selon le secteur d'activité.</p>
          <em>Fournisseur : Altares D&B.</em>
        </template>
      </Help>
    </v-toolbar>
    <div>
      <v-layout mt-4 wrap>
        <v-flex md6 xs12>
          <div px-3 align-center style="font-size: 16px">
            {{ introPaiement }}
          </div>
          <apexchart width="100%" heigth="100%" type="line" :options="options" :series="series"></apexchart>
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
  methods: {
    average(array) {
      const total = array.reduce((acc, c) => acc + c, 0)
      return total / array.length
    },
  },
  computed: {
    series() {
      if ((this.paydex.date_valeur || []).length > 0 && (this.paydex.nb_jours || []).length > 0) {
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
          xaxis: [{
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
          }],
          yaxis: [{
            y: this.avg24m,
            borderColor: '#4f8a83',
            label: {
              borderColor: '#4f8a83',
              style: {
                color: '#fff',
                background: '#4f8a83',
              },
              text: 'retard moyen de l\'entreprise : ' + this.avg24m.toFixed(0) + ' jours',
            },
          }],
        },
      }
    },
    introPaiement() {
      let introPaiement = ''
      const tiers = [0, 15, 30, 60]
      if (this.avg24m === tiers[0]) {
        introPaiement += 'Cette entreprise ne présente jamais de retard de paiement'
      } else if (this.avg24m > tiers[0] && this.avg24m <= tiers[1]) {
        introPaiement += 'Cette entreprise présente des petits retards de paiement communs'
      } else if (this.avg24m > tiers[1] && this.avg24m <= tiers[2]) {
        introPaiement += 'Cette entreprise présente des retards de paiement à surveiller'
      } else if (this.avg24m > tiers[2] && this.avg24m <= tiers[3]) {
        introPaiement += 'Cette entreprise présente des retards de paiement inquiétants'
      } else if (this.avg24m > tiers[3]) {
        introPaiement += 'Cette entreprise présente des retards de paiement très préoccupants'
      }
      const variationThresholds = [0.1, 0.25, 0.5]
      if (this.variation > variationThresholds[2]) {
        introPaiement += ' et son comportement est en très forte détérioration sur les 6 derniers mois.'
      } else if (this.variation > variationThresholds[1]) {
        introPaiement += ' et son comportement est en forte détérioration sur les 6 derniers mois.'
      } else if (this.variation > variationThresholds[0]) {
        introPaiement += ' et son comportement est en détérioration sur les 6 derniers mois.'
      } else if (this.variation < -variationThresholds[2]) {
        introPaiement += ' et son comportement est en très forte amélioration sur les 6 derniers mois.'
      } else if (this.variation < -variationThresholds[1]) {
        introPaiement += ' et son comportement est en forte amélioration sur les 6 derniers mois.'
      } else if (this.variation < -variationThresholds[0]) {
        introPaiement += ' et son comportement est en amélioration sur les 6 derniers mois.'
      } else {
        introPaiement += '.'
      }
      return introPaiement
    },
    avg24m() {
      return this.average(this.paydex.nb_jours || [])
    },
    avg6m() {
      return this.average((this.paydex.nb_jours || []).slice(-6))
    },
    variation() {
      const diff = this.avg6m - this.avg24m
      return diff / Math.abs(this.avg24m)
    },
  },
}
</script>