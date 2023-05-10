export default {
  name: "CampaignsAppBar",
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    closeRightDrawer() {
      this.rightDrawer = false
    },
    openLeftDrawer() {
      this.leftDrawer = true
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
    },
    leftDrawer: {
      get() {
        return this.$store.state.leftDrawer
      },
      set(value) {
        this.$store.dispatch('setLeftDrawer', value)
      }
    }
  }
}