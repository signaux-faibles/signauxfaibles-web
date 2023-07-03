import Markdown from "@/components/Markdown.vue"
export default {
  name: "CampaignsRightDrawer",
  components: {Markdown},
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
    campaignsSelectedID: {
      get() {
        return this.$store.state.campaignsSelectedID
      },
      set(value) {
        return this.$store.dispatch('setCampaignsSelectedID', value)
      }
    },
  }
}