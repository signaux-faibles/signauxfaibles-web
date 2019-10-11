<template>
  <div>
    <v-toolbar dark color='indigo darken-5'>
      <v-toolbar-title class="localtoolbar">
          Cotisations et impayés Urssaf
      </v-toolbar-title>
      <v-spacer/>
      <Help titre="Cotisations et impayés URSSAF">
        <template>
          Ce graphique représente les données de l'URSSAF.<br/>
          Les dates représentées sont les dates de fin des périodes appelées<br/>
          <ul>
            <li> Cotisations: Montant des cotisations appelées.</li>
            <li> Dette (part patronale): Cumul des dettes restantes à payer sur la part patronale.</li>
            <li> Dette (part salariale): Cumul des dettes restantes à payer sur la part salariale (ou ouvrière).</li>
          </ul>
          Fournisseur: <b>ACOSS</b>
        </template>
      </Help>
    </v-toolbar>
    <apexchart width="100%" heigth="100%" type="line" :options="options" :series="series"></apexchart>
    <div 
      style=" height: 350px; width: 100%; text-align: center;"
      v-if="!roles.includes('urssaf')"
    >
      <img
      style="vertical-align: middle; margin: 125px 0; opacity: 0.2;"
      height="100px"
      src="@/assets/noaccess.svg"/>
    </div>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
export default {
  name: 'Urssaf',
  components: { Help },
  props: ['debit', 'cotisation', 'chart', 'roles'],
  computed: {
    series() {
      return [{
        name: 'cotisations dues',
        type: 'line',
        data: this.cotisation.map((c, i) => {
          return [
            new Date(this.debit[i].periode),
            Math.round(c),
          ]}).filter((d) => d[0].getTime() > 0),
      }, {
        name: 'dette (part patronale)',
        type: 'area',
        data: this.debit.map((d) => {
          return [
            new Date(d.periode),
            Math.round(d.part_patronale),
          ]}).filter((d) => d[0].getTime() > 0),
      }, {
        name: 'dette (part salariale)',
        type: 'area',
        data: this.debit.map((d) => {
          return [
            new Date(d.periode),
            Math.round(d.part_ouvriere),
          ]}).filter((d) => d[0].getTime() > 0),
      }]
    },
    options() {
      return {
        tooltip: {
          enabled: false,
        },
        legend: {
          show: true,
              showForSingleSeries: true,
                  onItemHover: {
        highlightDataSeries: false,
    },
        },
        theme: {
          mode: 'light',
          palette: 'palette6',
        },
        stroke: {
          curve: 'smooth',
          width: [5, 0, 0],
        },
        colors: ['#4f8a83', '#fac699', '#e76278'],
        fill: {
          type: ['solid', 'solid', 'solid'],
          colors: ['#4f8a83', '#fac699', '#e76278'],
          gradient: {
            type: 'vertical',
            shadeIntensity: 0,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.8,
            opacityTo: 0.8,
            stops: [0, 80, 100],
            colorStops: [],
          },
        },
        chart: {
          stacked: true,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          id: 'urssaf',
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {

        },
        states: {
        hover: {
          filter: {
              type: 'none',
            },
          },
        },
      }
    },
  },
}
</script>