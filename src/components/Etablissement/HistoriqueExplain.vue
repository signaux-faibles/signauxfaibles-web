<template>
  <div style="font-size: 17px">
    <div v-if="permScore">
      <span v-if="typeExplication=='crash'">Cet établissement est fermé ou est en situation de défaillance</span>
      <span v-else-if="typeExplication == 'ras'">Cet établissement n’a pas été identifié par l’algorithme comme étant à risque de défaillance à 18 mois.</span>
      <span v-else-if="typeExplication == 'horsperimetre'">Cet établissement ne faisait pas partie du périmètre de Signaux Faibles au moment de la production de cette liste de détection.</span>
      <span v-else-if="typeExplication == 'mixte'">
        Cette entreprise a été identifié par Signaux-Faibles comme étant à risque{{ this.alert=="Alerte seuil F2"?' modéré ':' '}}de défaillance à 18 mois.<br/>
        Cette alerte se fonde sur des données datant de Mars 2020 (pré-crise COVID) et des redressements experts basés sur des données actuelles.
        <HistoriqueExplainStructurel :summary="summary" :historique="historique"/>
        <HistoriqueExplainConjoncturel :summary="summary" :historique="historique"/>
      </span>
      <span v-else-if="typeExplication == 'structurel'">
        Cette entreprise a été identifiée par Signaux-Faibles comme étant à risque{{ this.alert=="Alerte seuil F2"?' modéré ':' '}}de défaillance à 18 mois.<br/>
        Cette alerte se fonde sur des données datant de Mars 2020 (pré-crise COVID). Les redressements experts n'indiquent pas d'évolution.
        <HistoriqueExplainStructurel :summary="summary" :historique="historique"/>
      </span>
      <span v-else-if="typeExplication == 'conjoncturel'">
        Cette entreprise a été identifiée par Signaux-Faibles comme étant à risque{{ this.alert=="Alerte seuil F2"?' modéré ':' '}}de défaillance à 18 mois.<br/>
        Les données datant de Mars 2020 n'ont pas provoqué d'alerte, toutefois les redressements experts indiquent un changement de situation.
        <HistoriqueExplainConjoncturel :summary="summary" :historique="historique"/>
      </span>
    </div>
    <div v-else>
      <div v-if="roles.includes('score')">Veuillez suivre cet établissement pour consulter ses données de détection.</div>
      <div v-else>Vous n’êtes pas autorisé(e) à consulter les données de détection.</div>
    </div>

  </div>
</template>

<script>
import libellesVariablesScores from '@/assets/libelles_variables_scores.json'
import HistoriqueExplainConjoncturel from '@/components/Etablissement/HistoriqueExplainConjoncturel.vue'
import HistoriqueExplainStructurel from '@/components/Etablissement/HistoriqueExplainStructurel.vue'

export default {
  data() {
    return {
      variablesMacro: ['activite_partielle', 'dette_urssaf', 'retards_paiement', 'sante_financiere'],
    }
  },
  props: ['historique', 'summary'],
  components: {HistoriqueExplainConjoncturel, HistoriqueExplainStructurel},
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
    alertPreRedressements() {
      return this.dernierScore.alertPreRedressements
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
    hasAlertPreRedressements() {
      return (this.alertPreRedressements === "Alerte seuil F1" || this.alertPreRedressements === "Alerte seuil F2")
    },
    typeExplication() {
      if (this.crash) {
        return "crash" 
      } else if (this.alert == null) {
        return "horsperimetre"
      } else if (this.hasRedressements && this.hasAlertPreRedressements && this.hasAlert) {
        return "mixte"
      } else if (this.hasRedressements && !this.hasAlertPreRedressements) {
        return "conjoncturel"
      } else if (!this.hasRedressements && this.hasAlertPreRedressements) {
        return "structurel" 
      } else {
        return "ras"
      }
    },
  }
}

</script>
