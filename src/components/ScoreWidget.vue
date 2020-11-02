<template>
  <span style="position: relative;">
    <v-icon
      :size="iconSize"
      style="position: relative; right: 1px"
      :color="logo.alert[1]"
    >{{logo.alert[0]}}</v-icon>
    
  </span>
  
</template>

<script>
export default {
  name: 'ScoreWidget',
  props: ['prediction', 'size'],
  computed: {
    alert() {
      return this.prediction
    },
    iconSize() {
      return this.size || '35px'
    },
    permScore() {
      return this.prediction.hasOwnProperty('permScore') ? this.prediction.permScore : true
    },
    logo() {
      const alerts = {
        high: ['fa-exclamation-triangle', 'red accent-2'],
        low: ['fa-exclamation-triangle', 'amber'],
        none: ['fa-check-circle', 'green'],
        forbidden: ['fa-lock', '#33333358'],
        absent: ['fa-question-circle', '#33333358'],
      }
      return {
        alert: alerts[this.detection.prob],
      }
    },
    detection() {
      const alert = this.alert.alert
      let probClass = ''
      if (!this.permScore) {
        probClass = 'forbidden'
      } else if (this.permScore && alert == null) {
        probClass = 'absent'
      } else if (alert === 'Pas d\'alerte') {
        probClass = 'none'
      } else if (alert === 'Alerte seuil F2') {
        probClass = 'low'
      } else {
        probClass = 'high'
      }
      return {
        prob: probClass,
      }
    },
  },
}
</script>
