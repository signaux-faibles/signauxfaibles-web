export default {
  name: "CampaignsAllActions",
  mounted() {
    this.getAllActions()
    this.$bus.$on('campaign-message', this.processMessage)
  },
  methods: {
    processMessage(message) {
      this.getAllActions()
      this.$store.dispatch('updateCampaigns')
    },
    getAllActions() {
      this.$axios.get('/campaign/allactions/' + this.campaignsSelectedID).then((r) => {
        this.allActionsPayload = r.data
      })
    }
  },
  computed: {
    kanbanConfig() {
      return this.$store.state.kanbanConfig
    },
    campaignsSelectedID() {
      return this.$store.state.campaignsSelectedID
    },
    allActions() {
      if (this.allActionsPayload) {
        return {
          pending: this.allActionsPayload.etablissements.filter((e) => e.action == null),
          take: this.allActionsPayload.etablissements.filter((e) => e.action == 'take'),
          cancel: this.allActionsPayload.etablissements.filter((e) => e.action == 'cancel'),
          success: this.allActionsPayload.etablissements.filter((e) => e.action == 'success')
        }
      }
    }
  },
  data() {
    return {
      allActionsPayload: null,
      takeHeaders: [
        {
          text: 'Raison Sociale',
          align: 'start',
          value: 'raisonSociale',
        },
        {text: 'Agent', value: 'username'},
        {text: 'siret', value: 'siret'},
      ],
      successHeaders: [
        {
          text: 'Raison Sociale',
          align: 'start',
          value: 'raisonSociale',
        },
        {text: 'Agent', value: 'username'},
        {text: 'siret', value: 'siret'},
      ],
      cancelHeaders: [
        {
          text: 'Raison Sociale',
          align: 'start',
          value: 'raisonSociale',
        },
        {text: 'Agent', value: 'username'},
        {text: 'siret', value: 'siret'},
      ],
      pendingHeaders: [
        {
          text: 'Raison Sociale',
          align: 'start',
          value: 'raisonSociale',
        },
        {text: 'siret', value: 'siret'},
      ]
    }
  }
}