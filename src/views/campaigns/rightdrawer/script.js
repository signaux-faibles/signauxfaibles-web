export default {
  name: "CampaignsRightDrawer",
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    closeRightDrawer() {
      this.rightDrawer = false
    },
    openRightDrawer() {
      this.rightDrawer = true
    }
  },
  computed: {
    rightDrawer: {
      get() {
        return this.$store.state.rightDrawer
      },
      set(value) {
        this.$store.dispatch('setRightDrawer', value)
      }
    }
  }
}