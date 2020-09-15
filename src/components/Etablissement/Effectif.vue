<template>
  <div>
    <v-toolbar
      dark
      color='indigo darken-5'>
      <v-toolbar-title class="localtoolbar">
        Effectifs
        <span v-if="roles.includes('dgefp')">
          / Activité partielle
        </span>
      </v-toolbar-title>
      <v-spacer/>
      <Help titre="Effectifs de l'établissement">
        <template>
          Ce graphique illustre les données d'emploi.<br/><br/>
          <b>effectifs</b>: Évolution des effectifs en nombre de salariés. (donnée fournie par l'ACOSS)<br/>
          <div v-if="roles.includes('dgefp')">
          <b>autorisation d'activité partielle</b>: Nombre de salariés concernés par une autorisation d'activité partielle pour la période représentée. (donnée fournie par la DGEFP)<br/> 
          <b>consommation d'activité partielle</b>: Nombre de salariés concernés par une consommation d'activité partielle. (donnée fournie par la DGEFP)
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
  props: ['effectif', 'chart', 'apdemande', 'apconso'],
  components: { Help },
  computed: {
    apdemandeSeries() {
      // TODO: understand the data
      return {
        demande: (this.apdemande || [])
        .sort((d1, d2) => {
          return (d2.debut > d1.debut ? -1 : 1)
        })
        .filter((d) => d.fin > this.min)
        .reduce((m, c) => {
          m = m.concat([
            [ new Date(c.debut),
              Math.max(c.effectifAutorise, 0)],
            [ new Date(c.fin),
              Math.max(c.effectifAutorise, 0)],
          ])
          return m
        }, []),
        conso: (this.apdemande || [])
        .sort((d1, d2) => {
          return (d2.debut > d2.debut ? -1 : 1)
        })
        .filter((d) => d.fin > this.min)
        .reduce((m, c) => {
          m = m.concat([
            [ new Date(c.debut),
              Math.min(c.effectifConsomme, c.effectifAutorise)],
            [ new Date(c.fin),
              Math.min(c.effectifConsomme, c.effectifAutorise)],
          ])
          return m
        }, []),
      }
    },
    min() {
      // TODO: update the date according to the new data
      return (this.effectif || []).reduce((m, e) => (m < e.periode) ? m : e.periode, '2018-01-01')
    },
    series() {
      return [{
        name: 'effectifs',
        data: (this.effectif || []).map((e) => {
          return [
            new Date(e.periode),
            e.effectif,
          ]}),
      }, {
        name: 'consommation activité partielle',
        data: this.apdemandeSeries.conso,
        type: 'area',
      }, {
        name: 'autorisation activité partielle',
        data: this.apdemandeSeries.demande,
        type: 'area',
      }]
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
            formatter(val) {
              return new Date(val).toLocaleDateString()
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
          id: 'effectifs',
        },
        xaxis: {
          type: 'datetime',
        },
        colors: ['#4f8a83', '#e76278', '#fac699'],
        fill: {
          type: [ 'solid', 'solid', 'solid'],
          colors: ['#4f8a83', '#e76278', '#fac699'],
        },
        stroke: {
          curve: ['smooth', 'stepline', 'stepline'],
          width: [5, 0, 0],
        },
        yaxis: {
          min: 0,
        },
      }
    },
  },
}
</script>