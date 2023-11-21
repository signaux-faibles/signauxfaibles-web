<template>
  <div>
    <v-toolbar dark color="indigo">

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

    <v-alert
      dense
      outlined
      v-if="hasCCSFNow"
      class="ml-12 mr-3"
      type="info"
      color="indigo"
    >
        Au regard des dernières informations fournies par l'URSSAF, cette établissement fait actuellement l'objet d'un plan CCSF.
    </v-alert>
    <v-layout align-center justify-center text-center style="min-height: 500px" v-if="!permUrssaf">
      <v-flex xs5>
        <v-icon size="100">fa-lock</v-icon>
        <div v-if="roles.includes('urssaf')" class="lock-urssaf mt-2">Veuillez suivre cet établissement pour consulter ses données de cotisations et d’impayés Urssaf</div>
        <div v-else class="lock-urssaf mt-2">Vous n’êtes pas autorisé(e) à consulter les données de cotisations et d’impayés Urssaf</div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
export default {
  name: 'Urssaf',
  components: { Help },
  props: ['debit', 'cotisation', 'delai', 'chart', 'permUrssaf'],
  computed: {
    hasCCSFNow() {
      return this.delai.filter((delai) => {
        const now = new Date()
        const dateEcheance = new Date(delai.dateEcheance)
        return delai.action=='CCSF' && now < dateEcheance
      }).length>0
    },
    series() {
      if ((this.cotisation || []).length > 0 || (this.debit || []).length > 0) {
        return [{
          name: 'cotisations appelées',
          type: 'line',
          data: this.cotisation.map((c, i) => {
            return [
                new Date(this.debit[i].periode),
                Math.round(c),
              ]
          }),
        }, {
          name: 'délai accordé',
          type: 'line',
          data: this.debit.map((d) => {
            return [
              new Date(d.periode),
              Math.round(d.delai),
            ]
          }),
        }, {
          name: 'dette restante (part salariale)',
          type: 'area',
          data: this.debit.map((d) => {
            return [
              new Date(d.periode),
              Math.round(d.part_ouvriere+d.part_patronale),
            ]
          }),
        }, {
          name: 'dette restante (part patronale)',
          type: 'area',
          data: this.debit.map((d) => {
            return [
              new Date(d.periode),
              Math.round(d.part_patronale),
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
          shared: true,
          custom: function({series, seriesIndex, dataPointIndex, w}) {
            const date = new Date(w.globals.seriesX[1][dataPointIndex])
            const month = String(date.getUTCMonth()+1).padStart(2, '0')
            const year =  String(date.getUTCFullYear())
            const displayDate = month + '/' + year

            const cotisation = (series[0][dataPointIndex])? series[0][dataPointIndex] + ' €' : 'n/c'
            const delai = series[1][dataPointIndex] + ' €'
            const partSalariale = series[2][dataPointIndex] - series[3][dataPointIndex] + ' €'
            const partPatronale = series[3][dataPointIndex] + ' €'
            return '<div style="width: 300px; height: 120px; overflow-wrap: anywhere; ">' +
              '<h4 style="background-color:#eee">' + displayDate +'</h4>' +
              '<hr style="border-width: 1px; background-color: #ddd; border-color: #eee">' +
              '<table class="tooltip">' +
              '<tr><td style="padding-right: 15px">cotisation appelée</td><td>' + cotisation + '</td></tr>' +
              '<tr><td style="padding-right: 15px">délai accordé</td><td>' + delai + '</td></tr>' +
              '<tr><td style="padding-right: 15px">dette restante (part patronale)</td><td>' + partPatronale + '</td></tr>' +
              '<tr><td style="padding-right: 15px">dette restante (part salariale)</td><td>' + partSalariale + '</td></tr>' +
              '</div>'
          },
          x: {
            format: 'MM/yyyy',
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
          curve: ['smooth', 'stepline', 'smooth', 'smooth'],
          width: [5, 3, 0, 0],
          dashArray: [0,8,0,0]
        },
        colors: ['#4f8a83', '#573D1C', '#e76278', '#fac699'],
        fill: {
          type: ['solid', 'solid', 'solid', 'solid'],
          colors: ['#4f8a83', '#573D1C', '#e76278', '#fac699'],
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
          type: 'line',
          stacked: false,
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
        }
      }
    },
  },
}
</script>
<style scoped>
.lock-urssaf {
  color: #0000008A;
  font-family: "Abel";
  font-size: 16px;
  font-weight: 800;
}
</style>