<template>
  <span style="position: relative;">
    <v-icon :size="iconSize" style="position: relative; right: 1px" :color="logo.alert[1]">{{logo.alert[0]}}</v-icon>
    <v-icon size="15px" style="position: absolute; bottom: 10px; right: -5px" :color="logo.diff[1]">fa-arrow-down{{logo.diff[0]}}</v-icon>
  </span>
</template>

<script>
export default {
  name: 'ScoreWidget',
  props: ['prediction', 'size'],
  computed: {
    alert() {
      return this.prediction || {alert: 'Pas d\'alerte'}
    },
    iconSize() {
      return this.size || '35px'
    },
    logo() {
      const alerts = {
        high: ['fa-exclamation-triangle', 'red'],
        low: ['fa-question', 'amber'],
        none: ['fa-check-circle', 'green'],
        up: ['fa-arrow-up', 'red'],
        down: ['fa-arrow-down', 'green'],
      }

      return {
        alert: alerts[this.detection.prob],
        diff: this.detection.diff !== 'none' || this.detection.prob !== 'green' ? alerts[this.detection.diff] : '',
      }
    },
    detection() {
      const alert = this.alert.alert
      const diff = this.alert.diff
      let probClass = ''
      let diffClass = ''
      if (alert === 'Pas d\'alerte') {
        probClass = 'none'
      } else if (alert === 'Alerte seuil F2') {
        probClass = 'low'
      } else {
        probClass = 'high'
      }

      if (Math.abs(diff) <= 0.1) {
        diffClass = 'none'
      } else if (diff < 0) {
        diffClass = 'down'
      } else {
        diffClass = 'up'
      }

      return {
        prob: probClass,
        diff: diffClass,
      }
    },
  },
}
</script>
