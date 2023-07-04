import {useCampaignsStore} from "@/stores/campaigns";

export default {
  name: "CampaignsTakenActions",
  setup() {
    const campaigns = useCampaignsStore()
    return {campaigns}
  },
  mounted() {
    this.getAllActions()
    this.$bus.$on('campaign-message', this.processMessage)
  },
  methods: {
    processMessage(message) {
      this.getAllActions()
      this.campaigns.getCampaigns(this.$axios)
    },
    getAllActions() {
      this.$axios.get('/campaign/actions/taken/' + this.campaigns.selectedID).then((r) => {
        this.allActionsPayload = r.data
      })
    }
  },
  computed: {
    kanbanConfig() {
      return this.$store.state.kanbanConfig
    },
    allActions() {
      if (this.allActionsPayload) {
        return this.allActionsPayload.etablissements.filter((e) => e.action == 'take' || e.action == 'success')
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