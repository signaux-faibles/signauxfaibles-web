import FollowCards from '@/components/etablissement/cards/main.vue'

export default {
  name: "FollowCardsDialog",
  components: {FollowCards},
  props: ['siret', 'denomination', 'codeDepartement'],
  computed: {
    followCardsDialog: {
      get() {
        return this.$store.state.followCardsDialog
      },
      set(value) {
        return this.$store.dispatch('setFollowCardsDialog', value)
      },
    },
  },
  methods: {
    closeFollowCardsDialog() {
      this.$parent.siret = null
      this.followCardsDialog = false
    }
  }
}