<template>
  <div>
    <apexchart width="100%" heigth="100%" type="radar" :options="options" :series="series"></apexchart>
  </div>
</template>

<script>
export default {
  name: 'BilanGraph',
  props: ['ratios', 'chartOptions'],
  data() {
    return {
      localOptions: {
        labels: [
          ['Poids BFR exploitation','sur CA (jours)'],
          ['Rotation','des stocks'],
          ['Crédit fournisseurs','(jours)'],
          ['Crédit clients','(jours)'],
        ]
      }
    }
  },
  methods: {
    exercices(length) {
      const currentYear = (new Date()).getFullYear()
      return Array(length).fill().map((_, index) => currentYear - index - 1)
    }
  },
  computed: {
    options() {
      return Object.assign(this.chartOptions, this.localOptions)
    },
    series() {
      if (this.ratios == null) {return []}
      return this.ratios
          .slice(0,2)
          .reverse()
          .map((exercice) => {
        return {
          name: exercice.exercice,
          data: [
            exercice.gestion.poidsBFRExploitationSurCAJours,
            exercice.gestion.rotationDesStocks,
            exercice.gestion.creditFournisseurs,
            exercice.gestion.creditClients,
          ]
        }
      })
    },
  }
}

</script>