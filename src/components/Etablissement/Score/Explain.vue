<template>
  <div style="font-size: 17px">
    <div v-if="permScore">
      <span v-if="typeExplication === 'crash'">Cet établissement est fermé ou est en situation de défaillance</span>
      <span v-else-if="typeExplication === 'ras'">Cet établissement n’a pas été identifié par l’algorithme comme étant à risque de défaillance à 18 mois.</span>
      <span v-else-if="typeExplication === 'horsperimetre'">Cet établissement ne faisait pas partie du périmètre de Signaux Faibles au moment de la production de cette liste de détection.</span>
      <span v-else>
        Cette entreprise est portée à votre attention car elle présente des signes d'alerte {{ this.alert === "Alerte seuil F2"?' modérés':' importants'}} détaillés ci-dessous.<br/>
        <p/>
        <span>
          <Gitbook target="f.a.q.#comment-sont-obtenues-les-listes-comment-fonctionne-le-modele-algorithmique"/>
        </span>
        <ExplainConjoncturel
            :signalAugmentationUrssaf="signalAugmentationUrssaf"
            :signalDiminutionUrssaf="signalDiminutionUrssaf"
            :signalActivitePartielle="signalActivitePartielle"
            :signalFinancier="signalFinancier"
            :redressements="redressements"
            :typeExplication="typeExplication"
        />

        <ExplainStructurel
            :summary="summary"
            :historique="historique"
            :typeExplication="typeExplication"
        />
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
import ExplainConjoncturel from '@/components/Etablissement/Score/ExplainConjoncturel.vue'
import ExplainStructurel from '@/components/Etablissement/Score/ExplainStructurel.vue'
import Gitbook from '@/components/Gitbook.vue'

export default {
  data() {
    return {
      variablesMacro: ['activite_partielle', 'dette_urssaf', 'retards_paiement', 'sante_financiere'],
    }
  },
  props: ['historique', 'summary'],
  components: {ExplainConjoncturel, ExplainStructurel, Gitbook},
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
    hasRedressement(redressement) {
      return this.redressements.includes(redressement)
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
    redressements() {
      return this.dernierScore.redressements
    },
    hasSignal() {
      return this.signals.some((signal) => signal)
    },
    signals() {
      return [
        this.signalAugmentationUrssaf,
        this.signalDiminutionUrssaf,
        this.signalActivitePartielle,
        this.signalFinancier,
      ]
    },
    signalAugmentationUrssaf() {
      return (this.hasRedressement("augmentation_dette_sur_cotisation_urssaf_recente") &&
      !this.hasRedressement("dette_urssaf_macro_preponderante"))
    },
    signalDiminutionUrssaf() {
      return (this.hasRedressement("diminution_dette_urssaf_ancienne") &&
      !this.hasRedressement("augmentation_dette_sur_cotisation_urssaf_recente") &&
      this.hasRedressement("dette_urssaf_ancienne_significative"))
    },
    signalActivitePartielle() {
      return (this.hasRedressement("demande_activite_partielle_elevee"))
    },
    signalFinancier() {
      return ((this.hasRedressement("solvabilité_faible")?1:0) +
      (this.hasRedressement("k_propres_negatifs")?1:0) +
      (this.hasRedressement("rentabilité_faible")?1:0) +
      (this.hasRedressement("tva_rar_elevé")?1:0)) > 1
    },
    typeExplication() {
      if (this.crash) {
        return "crash"
      } else if (this.alert == null) {
        return "horsperimetre"
      } else if (this.hasSignal && this.hasAlertPreRedressements && this.hasAlert) {
        return "mixte"
      } else if (this.hasSignal && !this.hasAlertPreRedressements) {
        return "conjoncturel"
      } else if (!this.hasSignal && this.hasAlertPreRedressements) {
        return "structurel"
      } else {
        return "ras"
      }
    },
  }
}

</script>
