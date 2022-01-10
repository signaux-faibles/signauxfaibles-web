<template>
  <div>
    <v-toolbar
      dark
      color='indigo'>
      <v-toolbar-title class="localtoolbar">
        Effectifs
        <span v-if="permDGEFP">
          / Activité partielle
        </span>
      </v-toolbar-title>
      <v-spacer/>
      <Help titre="Effectifs de l'établissement">
        <template>
          Ce graphique illustre les données d'emploi.<br/><br/>
          <b>effectifs</b>: Évolution des effectifs en nombre de salariés. (donnée fournie par l'ACOSS)<br/>
          <div v-if="permDGEFP">
          <b>autorisation d'activité partielle</b>: Nombre de salariés concernés par une autorisation d'activité partielle pour la période représentée. (donnée fournie par la DGEFP)<br/> 
          <b>consommation d'activité partielle</b>: Nombre d'équivalents temps plein mensuel calculé à partir de la somme du nombre d'heures d'activité partielle consommées divisée par la durée légale de 151,67 h. (donnée fournie par la DGEFP)
          </div>
        </template>
      </Help>
    </v-toolbar>
    <apexchart width="100%" heigth="100%" type="line" :options="options" :series="series"></apexchart>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'

export default {
  name: 'Effectif',
  props: ['effectif', 'chart', 'apdemande', 'apconso', 'permDGEFP'],
  components: { Help },
  methods: {
    equivalentTempsPlein(heures) {
      return heures / 151.67
    },
    lastDayOfMonth(date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0)
    },
  },
  computed: {
    apdemandeSeries() {
      return {
        demande: (this.apdemande || [])
        .sort((d1, d2) => {
          return (d2.debut > d1.debut ? -1 : 1)
        })
        .filter((d) => {
          return new Date(d.fin) > new Date(this.min)
        })
        .reduce((m, c) => {
          m = m.concat([
            [ new Date(c.debut),
              Math.max(c.effectifAutorise, 0)],
            [ new Date(c.fin),
              0],
          ])
          return m
        }, []),
        conso: (this.apconso || [])
        .sort((d1, d2) => {
          return (d2.date > d1.date ? -1 : 1)
        })
        .filter((d) => {
          return new Date(d.date) > new Date(this.min)
        })
        .reduce((m, c, i) => {
          const etp = Math.max(this.equivalentTempsPlein(c.heureConsomme), 0)
          if (i > 0 && m[m.length - 2][0].getTime() === new Date(c.date).getTime()) {
            m[m.length - 2][1] += etp
          } else {
            m = m.concat([
              [ new Date(c.date),
                etp],
              [ this.lastDayOfMonth(new Date(c.date)),
                0],
            ])
          }
          return m
        }, []),
      }
    },
    min() {
      const today = new Date()
      const minLimit = new Date(today.getFullYear() - 2, 0, 0)
      return (this.effectif || []).reduce((m, e) => (m < e.periode) ? m : e.periode, minLimit)
    },
    series() {
      if (this.effectif.length > 0
        || this.apdemandeSeries.conso.length > 0
        || this.apdemandeSeries.demande.length > 0) {
        return [
          {
            name: 'autorisation activité partielle',
            data: this.apdemandeSeries.demande,
            type: 'area',
          }, 
            {
              name: 'consommation activité partielle',
            data: this.apdemandeSeries.conso,
            type: 'area',
            }, 
          {
            name: 'effectifs',
            data: (this.effectif || []).map((e) => {
              return [
                new Date(e.periode),
                e.effectif,
              ]
            }),
          }, 
        ]
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
          showForZeroSeries: true,
        },
        tooltip: {
          enabled: true,
          x: {
            formatter(val) {
              return new Date(val).toLocaleDateString()
            },
          },
           y: {
            formatter(val, { series, seriesIndex, dataPointIndex, w }) {
              let y = parseFloat(val.toFixed(1)).toLocaleString()
              const etpIndex = 1
              y += (seriesIndex === etpIndex) ? ' ETP' : ' salariés'
              return y
            },
          },
        },
        theme: {
          mode: 'light',
          palette: 'palette6',
        },
        chart: {
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          id: 'effectifs',
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          min: 0,
          labels: {
            formatter(val, index) {
              return val.toFixed(0)
            },
          },
        },
        colors: [ '#fac699', '#e76278', '#4f8a83'],
        fill: {
          type: ['solid', 'solid', 'solid'],
          colors: [ '#fac699', '#e76278', '#4f8a83' ],
          opacity: [1, 1, 1],
        },
        stroke: {
          curve: ['stepline', 'stepline', 'smooth'],
          width: [0, 0, 5],
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
        },
      }
    },
  },
}
</script>