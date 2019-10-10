<template>
  <div>
    <v-toolbar
      dark
      color='indigo darken-5'>
      <v-toolbar-title class="localtoolbar">
        Effectifs
        <span v-if="jwt.resource_access.signauxfaibles.roles.includes('dgefp')">
          / Activité partielle
        </span>
      </v-toolbar-title>
      <v-spacer/>
      <Help titre="Effectifs de l'établissement">
        <template>
          Ce graphique illustre les données d'emploi.<br/><br/>
          <b>effectifs</b>: Évolution des effectifs en nombre de salariés. (donnée fournie par l'ACOSS)<br/>
          <div v-if="jwt.resource_access.signauxfaibles.roles.includes('dgefp')">
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
      return {
        demande: this.apdemande
        .sort((d1, d2) => d1.periode.start > d2.periode.start)
        .filter((d) => d.periode.end > this.min)
        .flatMap(c => {
          return [
            [ new Date(c.periode.start),
              Math.max(c.effectif_autorise,0)],
            [ new Date(c.periode.end),
              0],
          ]
        }),
        conso: this.apdemande
        .sort((d1, d2) => d1.periode.start > d2.periode.start)
        .filter((d) => d.periode.end > this.min)
        .flatMap(c => {
          return [
            [ new Date(c.periode.start),
              c.effectif_consomme],
            [ new Date(c.periode.end),
              0],
          ]
        })
      }
    },
    min() {
      return (this.effectif || []).reduce((m, e) => (m<e.periode)?m:e.periode, '2018-01-01')
    },
    jwt() {
      return this.$keycloak.tokenParsed || {resource_access: { signauxfaibles: {roles: []}}}
    },
    series() {
      return [{
        name: 'effectifs',
        data: this.effectif.map(e => {
          return [
            new Date(e.periode),          
            e.effectif, 
          ]})
      },{
        name: 'consommation activité partielle',
        data: this.apdemandeSeries.conso,
        type: 'area',
      },{
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
          enabled: false,
        },
        
        theme: {
          mode: 'light', 
          palette: 'palette7',
        },
        chart: {
          toolbar: {
            show: false,
          },
          id: 'effectifs'
        },
        zoom: {
            enabled: false,
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
          width: [5,0,0],
        },
        yaxis: {
          min: 0,
        },
      }
    },
  },
}
</script>