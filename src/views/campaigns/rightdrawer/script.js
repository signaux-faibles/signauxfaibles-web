export default {
  name: "CampaignsRightDrawer",
  props: ['campaigns'],
  data() {
    return {
      loading: false,
      selectedCampaignID: null,
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
    campaignsSelectItems() {
      return Object.entries(this.campaigns).map(([k,v]) => {
        return {
          "text": v.title,
          "value": k,
        }
      })
    },
    selectedCampaign() {
      return this.campaigns[this.selectedCampaignID] || {}
    },
    selectedCampaignDueDate() {
      return this.selectedCampaign.due.toLocaleString('fr-FR').slice(0,10)
    },
    selectedCampaignStatus() {
      return this.selectedCampaign.active ? "en cours de traitement" : "traitement terminé"
    },
    selectedCampaignStats() {
      return {
        total: this.selectedCampaign.cards.length,
        blank: this.selectedCampaign.cards.filter(c => c.status == "blank").length,
        pending: this.selectedCampaign.cards.filter(c => c.status == "pending").length,
        done: this.selectedCampaign.cards.filter(c => c.status == "done").length,
        rejected: this.selectedCampaign.cards.filter(c => c.status == "rejected").length,
      }
    },
    selectedCampaignManifest() {
      return this.selectedCampaign.manifest
    },
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