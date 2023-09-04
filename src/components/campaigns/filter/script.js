import {useCampaignsStore} from "@/stores/campaigns";

export default {
  name: "CampaignsMyActions",
  components: {Spinner, Help, Entreprise, Etablissement, Card, Toolbar, CampaignsEtablissement},
  props: ['cards'],
  setup() {
    const campaigns = useCampaignsStore()
    return {campaigns}
  },
  data() {
    return {
      siret: null,
      denomination: null,
      codeDepartement: null,
      siren: null,
      campaignEtablissementSelectedID: null,
      entrepriseDialog: false,
      etablissementDialog: false,
      successDialog: false,
      successRadio: null,
      cancelDialog: false,
      cancelRadio: null,
      loading: true,
    }
  },
  mounted() {
    this.getMyActions(this.campaignSelectedID)
    this.$bus.$on('campaign-message', this.processMessage)
  },
  methods: {
    processMessage(message) {
      this.getMyActions()
      this.campaigns.getCampaigns(this.$axios)
    },
    getMyActions(campaignID) {
      this.$axios.get('/campaign/actions/mine/' + this.campaigns.selectedID)
        .then((r) => {
          this.myActions = r.data
        }).catch(() => {
        this.myActions = {
          etablissements: [],
        }
      }).finally(() => {
        this.loading = false
      })
    },
  }
  ,
  computed: {
    followCardsDialog: {
      get() {
        return this.$store.state.followCardsDialog
      },
      set(value) {
        return this.$store.dispatch('setFollowCardsDialog', value)
      },
    },
  }
}