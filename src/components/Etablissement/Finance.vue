<template>
<div>
 <span v-for="f in fichiers" :key="f">
 {{f}}<br/>
 </span>

  <span v-for="f in cleanFichiers" :key="'toto' + f">
 {{f}}<br/>
 </span>
</div>
</template>

<script>
export default {
  name: 'Finance',
  props: ['siren'],
  computed: {
    clotures() {return Object.keys(this.bilans).map((b) => this.bilans[b].date_cloture_exercice)},
    cleanFichiers() {return Object.keys(this.bilans).map((b) => this.bilans[b].nom_fichier)},
    fichiers() {return this.rawBilans.map((b) => b.nom_fichier)},
  },
  data() {
    return {
      bilans: [],
      rawBilans: [],
    }
  },
  mounted() {
    this.getBilans(this.siren)
  },
  methods: {
    getBilans(siren) {
      const self = this
      this.$axios.get('/bilan/' + siren).then((r) => {
        self.bilans = this.cleanup(r.data)
        self.rawBilans = r.data
      })
    },
    cleanup(bilan) {
      bilan = bilan.sort((b1, b2) => b1.nom_fichier > b2.nom_fichier)
      return bilan.reduce((m, b) => {
        m[b.date_cloture_exercice] = b
        return m
      }, {})
    },
  },
}
</script>