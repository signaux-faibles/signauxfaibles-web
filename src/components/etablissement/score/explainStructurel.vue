<template>
  <div>
    <v-toolbar dense flat class="mytoolbar" light>
      <v-toolbar-title class="localtoolbar mytoolbar">Analyse thématique</v-toolbar-title>
    </v-toolbar>
    <div v-if="permScore && dernierScore && dernierScore.macroRadar && Object.keys(dernierScore.macroRadar).length > 2 && hasAlert">
      <v-card v-if="typeExplication==='mixte' || typeExplication==='structurel'" outlined>
        <v-card-text>
          <div>
            <apexchart
              type="radar"
              height="200px"
              :options="macroOptions(dernierScore)"
              :series="series(dernierScore)"
            ></apexchart>
          </div>
          <div v-if="selectConcerning(dernierScore)">
            Les variables les plus significatives sont, par ordre d'importance :
            <ul >
              <li v-for="c in selectConcerning(dernierScore)" :key="c[1]"><em>{{ libelleMicro(c[1]) }}</em> ({{ libelleMacro(c[0]) }})</li>
            </ul>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import libellesVariablesScores from '@/assets/libelles_variables_scores.json'
import Help from '@/components/Help.vue'

export default {
  data() {
    return {
      variablesMacro: ['activité_partielle', 'dette_urssaf', 'retards_paiement', 'santé_financière'],
    }
  },
  props: ['historique', 'summary', 'typeExplication'],
  components: {Help},
  methods: {
    series(h) {
      return [{
        data: this.variablesMacro.reduce((data, v) => {
          if (h.macroRadar.hasOwnProperty(v)) {
            data.push(h.macroRadar[v])
          }
          return data
        }, []),
      }]
    },
    libelleMicro(variable) {
      return libellesVariablesScores.micro[variable]
    },
    libelleMacro(variable) {
      return libellesVariablesScores.macro[variable]
    },
    alertSuffix(h) {
      return this.selectConcerning(h) ?
        ', principalement en raison des données suivantes :' : '.'
    },
    selectConcerning(h) {
      return ((h || {}).explSelection || {}).selectConcerning
    },
    macroOptions(h) {
      const xaxis = {
        xaxis: {
          categories: this.variablesMacro.reduce((categories, v) => {
            if (h.macroRadar.hasOwnProperty(v)) {
              categories.push(this.libelleMacro(v))
            }
            return categories
          }, []),
        },
      }
      return {...this.options, ...xaxis}
    },
  },
  computed: {
    crash() {
      return this.summary.etatAdministratif === 'F'
        || this.summary.etat_procol === 'redressement' || this.summary.etat_procol === 'liquidation'
    },
    options() {
      return {
        chart: {
          type: 'radar',
          toolbar: {
            show: false,
          },
        },
        colors: ['#999'],
        fill: {
          opacity: 0,
        },
        stroke: {
          show: true,
          width: 2,
        },
        markers: {
          size: 0,
        },
        yaxis: {
          show: false,
          tickAmount: 5,
          max: 1,
        },
        plotOptions: {
          radar: {
            size: 75,
            polygons: {
              strokeColors: ['#f67577', '#f9c16b', '#eeedaa', '#b9e69f', '#8ec07e'],
              fill: {
                colors: ['#f67577', '#f9c16b', '#eeedaa', '#b9e69f', '#8ec07e'],
              },
            },
          },
        },
        legend: {
          show: true,
        },
      }
    },
    dernierScore() {
      return this.historique[0] || {}
    },
    alert() {
      return this.dernierScore.alert
    },
    permScore() {
      return this.summary.hasOwnProperty('permScore') ? this.summary.permScore : true
    },
    hasRedressements() {
      return (this.dernierScore.redressements.length > 0)
    },
    hasAlert() {
      return (this.alert === "Alerte seuil F1" || this.alert === "Alerte seuil F2")
    },
  }
}
</script>

<style scoped>
  .mytoolbar {
    background-color: white;
    /* color: indigo; */
  }
</style>