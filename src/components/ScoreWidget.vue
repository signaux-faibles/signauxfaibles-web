<template>
  <v-tooltip right :disabled="disabled">
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">
        <v-icon
          :size="iconSize"
          :color="logo.alert[1]"
        >{{ logo.alert[0] }}</v-icon>
      </span>
    </template>
    <span>{{ detection.tooltip }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'ScoreWidget',
  props: ['prediction', 'size', 'tooltip'],
  computed: {
    disabled() {
      return !this.tooltip
    },
    iconSize() {
      return this.size || '35px'
    },
    permScore() {
      return this.prediction.hasOwnProperty('permScore') ? this.prediction.permScore : true
    },
    logo() {
      const alerts = {
        crash: ['fa-balance-scale', 'grey darken-4'],
        high: ['fa-exclamation-triangle', 'red darken-2'],
        low: ['fa-exclamation-triangle', 'amber darken-2'],
        none: ['fa-check-circle', 'green'],
        forbidden: ['fa-lock', '#33333358'],
        absent: ['fa-question-circle', '#33333358'],
      }
      return {
        alert: alerts[this.detection.prob],
      }
    },
    detection() {
      const alert = this.prediction.alert
      let probClass = ''
      let tooltip = ''
      if (!this.permScore) {
        probClass = 'forbidden'
        tooltip = 'Non autorisé'
      } else if (alert == null) {
        probClass = 'absent'
        tooltip = 'Hors périmètre'
      } else if (this.crash) {
        probClass = 'crash'
        tooltip = 'Fermé ou en situation de défaillance'
      } else if (alert === 'Pas d\'alerte') {
        probClass = 'none'
        tooltip = 'Pas de risque de défaillance à 18 mois identifié'
      } else if (alert === 'Alerte seuil F2') {
        probClass = 'low'
        tooltip = 'Risque modéré de défaillance à 18 mois'
      } else {
        probClass = 'high'
        tooltip = 'Risque élevé de défaillance à 18 mois'
      }
      return {
        prob: probClass,
        tooltip,
      }
    },
    crash() {
      return this.prediction.etatAdministratif === 'F'
        || this.prediction.etat_procol === 'redressement' || this.prediction.etat_procol === 'liquidation'
    },
  },
}
</script>
