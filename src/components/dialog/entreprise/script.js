import Etablissement from '@/components/Etablissement/Score'
export default {
  name: 'DialogEtablissement',
  components: { Etablissement },
  computed: {
    etablissementDialog: {
      get() { return this.$store.state.etablissementDialog },
      set(value) { return this.$store.dispatch('setEtablissementDialog', value)}
    }
  }
}