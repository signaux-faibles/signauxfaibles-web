import Card from "@/components/card/main.vue";
import FollowCardsDialog from "@/components/follow/cardsDialog/main.vue"
import Etablissement from "@/components/etablissement/Main.vue";
import Entreprise from "@/components/entreprise/main.vue";
import Toolbar from "@/components/Toolbar.vue";
import Help from "@/components/Help.vue";
import StatusLabels from "@/assets/campaignStatus.json"
import CampaignsEtablissement from '@/components/campaigns/etablissement/main.vue'

export default {
  name: "CampaignsMyActions",
  components: {Help, Entreprise, Etablissement, Card, Toolbar, FollowCardsDialog, CampaignsEtablissement},
  props: ['cards'],
  data() {
    return {
      myActions: null,
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
    }
  },
  mounted() {
    this.getMyActions(this.campaignSelectedID)
    this.$bus.$on('campaign-message', this.processMessage)
  },
  methods: {
    processMessage(message) {
      this.getMyActions()
      this.$store.dispatch('updateCampaigns')
    },
    showFollowCardsDialog(siret, denomination, codeDepartement) {
      this.siret = siret
      this.denomination = denomination
      this.codeDepartement = codeDepartement
      this.followCardsDialog = true
    },
    getMyActions(campaignID) {
      this.$axios.get('/campaign/myactions/' + this.campaignsSelectedID)
        .then((r) => {
          this.myActions = r.data
        })
    },
  },
  computed: {
    followCardsDialog: {
      get() { return this.$store.state.followCardsDialog },
      set(value) { return this.$store.dispatch('setFollowCardsDialog', value)}
    },
    campaignsSelectedID() {
      return this.$store.state.campaignsSelectedID
    }
  }
}