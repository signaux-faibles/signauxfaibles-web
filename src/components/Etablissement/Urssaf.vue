<template>
  <div>
    <v-toolbar dark color="indigo darken-5">
      <v-toolbar-title class="localtoolbar">Cotisations et impayés Urssaf</v-toolbar-title>
      <v-spacer />
      <Help titre="Cotisations et impayés URSSAF">
        <template>
          <p>Ce graphique représente les données de l'URSSAF.</p>
          <p>Les dates représentées sont les dates de fin des périodes appelées.</p>
          <p>
            <ul>
              <li>Cotisations : montant des cotisations appelées.</li>
              <li>Dette (part patronale) : montant cumulé des dettes <strong>restant à payer</strong> sur la part patronale.</li>
              <li>Dette (part salariale) : montant cumulé des dettes <strong>restant à payer</strong> sur la part salariale (ou ouvrière).</li>
            </ul>
          </p>
          <em>Fournisseur : ACOSS.</em>
        </template>
      </Help>
    </v-toolbar>
    <apexchart
      v-if="permUrssaf"
      width="100%"
      heigth="100%"
      type="line"
      :options="options"
      :series="series"
    ></apexchart>
    <v-layout align-center justify-center row style="min-height: 500px" v-if="!permUrssaf">
      <v-icon style="color: #33333358" size="100">fa-lock</v-icon>
    </v-layout>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
export default {
  name: 'Urssaf',
  components: { Help },
  props: ['debit', 'cotisation', 'chart', 'permUrssaf'],
  computed: {
    series() {
      if ((this.cotisation || []).length > 0 || (this.debit || []).length > 0) {
        return [{
          name: 'cotisations appelées',
          type: 'line',
          data: this.cotisation.reduce((data, c, i) => {
            if (c !== null) {
              data.push([
                new Date(this.debit[i].periode),
                Math.round(c),
              ])
            }
            return data
          }, []),
        }, {
          name: 'dette restante (part patronale)',
          type: 'area',
          data: this.debit.map((d) => {
            return [
              new Date(d.periode),
              Math.round(d.part_patronale),
            ]
          }),
        }, {
          name: 'dette restante (part salariale)',
          type: 'area',
          data: this.debit.map((d) => {
            return [
              new Date(d.periode),
              Math.round(d.part_ouvriere),
            ]
          }),
        }]
      } else {
        return []
      }
    },
    options() {
      return {
        tooltip: {
          enabled: true,
          x: {
            formatter(val) {
              return new Date(val).toLocaleDateString()
            },
          },
          y: {
            formatter(val) {
              return parseFloat(val).toLocaleString() + ' €'
            },
          },
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
          title: {
            text: '€ (euros)',
          },
        },
        states: {
          hover: {
            filter: {
              type: 'none',
            },
          },
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
            borderColor: '#000',
            fillColor: '#000',
            opacity: 0.1,
            label: {
              text: 'Confinement national n°1',
              borderColor: '#000',
              style: {
                color: '#fff',
                background: '#000',
              },
            },
          }, {
            x: new Date('30 Oct 2020').getTime(),
            x2: new Date('15 Dec 2020').getTime(),
            borderColor: '#000',
            fillColor: '#000',
            opacity: 0.1,
            label: {
              text: 'Confinement national n°2',
              borderColor: '#000',
              style: {
                color: '#fff',
                background: '#000',
              },
            },
          }],
        },
      }
    },
  },
}
</script>