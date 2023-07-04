import Card from "@/components/card/main.vue"
import ScoreWidget from "@/components/ScoreWidget.vue"
import Etablissement from "@/components/etablissement/Main.vue"
import Entreprise from "@/components/entreprise/main.vue"
import CampaignsPendingActionsEtablissement from "@/components/campaigns/pendingActions/etablissement/main.vue";
import {useDialogsStore} from "@/stores/dialogs";
import {useCampaignsStore} from "@/stores/campaigns";

export default {
  name: "CampaignsPendingCards",
  props: ['cards'],
  components: {CampaignsPendingActionsEtablissement, Card, ScoreWidget, Etablissement, Entreprise},
  setup() {
    const dialogs = useDialogsStore()
    const campaigns = useCampaignsStore()
    return {dialogs, campaigns}
  },
  data() {
    return {
      dialogEntreprise: false,
      siret: null,
      siren: null,
      pending: {
        etablissements: [],
      },
    }
  },
  mounted() {
    this.getPendingEtablissements()
    this.$bus.$on('campaign-message', this.processMessage)
  },
  beforeDestroy() {
    this.$bus.$off()
  },
  computed: {
    campaignsSelectedID() {
      return this.campaigns.selectedID
    }
  },
  methods: {
    processMessage() {
      this.getPendingEtablissements()
      this.campaigns.getCampaigns(this.$axios)
    },
    getPendingEtablissements() {
      this.$axios.get('/campaign/actions/pending/' + this.campaignsSelectedID).then((r) => {
        this.pending = r.data || []
      }).catch((e) => {
        this.pending = {
          etablissements: [],
        }
      })
    },
    take(campaignID, id) {
      this.$axios.get('/campaign/take/' + campaignID + '/' + id).then(() => {
      })
    },
    etablissements() {
      return this.pending.etablissements
    },
  },
}