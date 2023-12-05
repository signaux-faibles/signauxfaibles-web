<template>
  <div>
    <v-toolbar color="indigo" dark>

      <v-toolbar-title class="localtoolbar">Cotisations, impayés et délais de paiement URSSAF</v-toolbar-title>
      <v-spacer/>
      <Help titre="Cotisations, impayés et délais de paiement URSSAF">
        <template>
          <p>Ce graphique représente les données de l'URSSAF.</p>
          <p>Les dates représentées sont les dates de fin des périodes appelées.</p>
          <p>
            <ul>
              <li>Cotisations : montant des cotisations appelées.</li>
              <li>Dette (part patronale) : montant cumulé des dettes <strong>restant à payer</strong> sur la part
                patronale.
              </li>
              <li>Dette (part salariale) : montant cumulé des dettes <strong>restant à payer</strong> sur la part
                salariale (ou ouvrière).
              </li>
              <li>Délai de paiement accordé (expérimental) : montant cumulé des <strong>délais accordés</strong> sur la période
                séparant leur création et leur échéances.
              </li>
            </ul>
          </p>
          <em>Fournisseur : ACOSS.</em>
        </template>
      </Help>
    </v-toolbar>
    <div v-if="permUrssaf">
      <apexchart
        :options="options"
        :series="series"
        heigth="100%"
        type="line"
        width="100%"
      ></apexchart>

      <v-alert
        v-if="hasCCSFNow"
        class="ml-12 mr-3"
        color="indigo"
        dense
        outlined
        type="info"
      > Au regard des dernières informations fournies par l'URSSAF, cet établissement fait actuellement l'objet d'un
        plan CCSF.
      </v-alert>

      <v-alert
        v-if="hasMultipleDelai"
        class="ml-12 mr-3"
        color="indigo"
        dense
        icon="fa-circle-exclamation"
        outlined
      >
        Le délai de paiement accordé à cette entreprise semble évoluer, ce qui indique la possibilité d'une renégociation
        de l'échéancier. Il est fortement recommandé d'échanger avec votre référent URSSAF pour en savoir plus sur la
        situation de cette entreprise.
      </v-alert>

      <v-alert
        v-if="hasDelai"
        class="ml-12 mr-3"
        color="indigo"
        dense
        icon="fa-flask-vial"
        outlined
      > L'exploitation des données de délai de paiement URSSAF est encore expérimentale, nous vous invitons à nous faire part de vos
        problèmes ou interrogations dans l'exploitation de ces nouvelles informations.
      </v-alert>
    </div>

    <v-layout v-if="!permUrssaf" align-center justify-center style="min-height: 500px" text-center>
      <v-flex xs5>
        <v-icon size="100">fa-lock</v-icon>
        <div v-if="roles.includes('urssaf')" class="lock-urssaf mt-2">Veuillez suivre cet établissement pour consulter
          ses données de cotisations et d’impayés Urssaf
        </div>
        <div v-else class="lock-urssaf mt-2">Vous n’êtes pas autorisé(e) à consulter les données de cotisations et
          d’impayés Urssaf
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'

export default {
  name: 'Urssaf',
  components: {Help},
  props: ['debit', 'cotisation', 'delai', 'chart', 'permUrssaf'],
  computed: {
    hasDelai() {
      return this.debit.filter((delai) => {
        return delai.delai > 0
      }).length > 0
    },
    hasCCSFNow() {
      return this.delai.filter((delai) => {
        const now = new Date()
        const dateEcheance = new Date(delai.dateEcheance)
        return delai.action == 'CCSF' && now < dateEcheance
      }).length > 0
    },
    hasMultipleDelai() {
      return this.debit.filter((delai) => {
        return delai.nbdelai > 1
      }).length > 0
    },
    series() {
      console.log(this.debit)
      if ((this.cotisation || []).length > 0 || (this.debit || []).length > 0) {
        return [{
          name: 'cotisations appelées',
          type: 'line',
          data: this.cotisation.map((c, i) => {
            return [
              new Date(this.debit[i].periode),
              (Math.round(c) > 0) ? Math.round(c) : null,
            ]
          }),
        }, {
          name: 'montant de l\'échéancier du délai de paiement (expérimental)',
          type: 'line',
          data: this.debit.map((delai, index, array) => {
            const delai_prec = (index > 0) ? array[index - 1].delai > 0 : false
            const delai_foll = (array[index + 1]) ? (array[index + 1].delai || 0) > 0 : false
            const display = delai.delai > 0 || delai_prec || delai_foll
            return [
              new Date(delai.periode),
              (display) ? Math.round(delai.delai) : null,
            ]
          }),
        }, {
          name: 'dette restante (part salariale)',
          type: 'area',
          data: this.debit.map((d) => {
            return [
              new Date(d.periode),
              Math.round(d.part_ouvriere + d.part_patronale),
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
          custom: function ({series, seriesIndex, dataPointIndex, w}) {
            const date = new Date(w.globals.seriesX[1][dataPointIndex])
            const month = String(date.getUTCMonth() + 1).padStart(2, '0')
            const year = String(date.getUTCFullYear())
            const displayDate = month + '/' + year

            const cotisation = (series[0][dataPointIndex]) ? series[0][dataPointIndex] + ' €' : 'n/c'

            const delai = series[1][dataPointIndex]
            const delai_libelle = delai + ' €'

            const partSalariale = series[2][dataPointIndex] - series[3][dataPointIndex] + ' €'
            const partPatronale = series[3][dataPointIndex] + ' €'
            const height = (delai != null) ? '124px' : '98px'
            return '<div style="height: ' + height + '; overflow-wrap: anywhere; ">' +
              '<h4 style="background-color:#eee">' + displayDate + '</h4>' +
              '<hr style="border-width: 1px; background-color: #ddd; border-color: #eee">' +
              '<table class="tooltip">' +
              '<tr><td style="padding-right: 15px">cotisation appelée</td><td style="width: 100px;text-align: right">' + cotisation + '</td></tr>' +
              '<tr><td style="padding-right: 15px">dette restante (part patronale)</td><td style="text-align: right">' + partPatronale + '</td></tr>' +
              '<tr><td class="pb-1" style="padding-right: 15px">dette restante (part salariale)</td><td class="pb-1" style="text-align: right">' + partSalariale + '</td></tr>' +
              ((delai != null) ? '<tr><td style="padding-right: 15px">délai de paiement accordé (expérimental)</td><td style="text-align: right">' + delai_libelle + '</td></tr>' : '') +
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
          dashArray: [0, 8, 0, 0]
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
          animations: {
            enabled: false
          },
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