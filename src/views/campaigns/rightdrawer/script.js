import Markdown from "@/components/Markdown.vue"
export default {
  name: "CampaignsRightDrawer",
  components: {Markdown},
  props: ['campaigns'],
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
    campaignsSelectItems() {
      return Object.entries(this.campaigns).map(([k,v]) => {
        return {
          "text": v.title,
          "value": k,
        }
      })
    },
    campaignsSelected() {
      return this.campaigns[this.campaignsSelectedID] || {}
    },
    campaignsSelectedDueDate() {
      return this.campaignsSelected.due.toLocaleString('fr-FR').slice(0,10)
    },
    campaignSelectedStatus() {
      return this.campaignsSelected.active ? "en cours de traitement" : "traitement terminé"
    },
    campaignsSelectedStats() {
      return {
        total: this.campaignsSelected.cards.length,
        pending: this.campaignsSelected.cards.filter(c => c.assignee == "nobody" && !c.done).length,
        mine: this.campaignsSelected.cards.filter(c => c.assignee == this.jwt.email && !c.done).length,
        workinprogress: this.campaignsSelected.cards.filter(c => (c.assignee != 'nobody' && !c.done)).length,
        done: this.campaignsSelected.cards.filter(c => c.done).length,
      }
    },
    campaignsSelectedManifest() {
      return this.campaignsSelected.manifest
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