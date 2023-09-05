import Card from "@/components/card/main.vue"
import ScoreWidget from "@/components/ScoreWidget.vue"
import Etablissement from "@/components/etablissement/Main.vue"
import Entreprise from "@/components/entreprise/main.vue"
import CampaignsDepartementFilter from "@/components/campaigns/departementFilter/main.vue"
import CampaignsPendingActionsEtablissement from "@/components/campaigns/pendingActions/etablissement/main.vue";
import {useDialogsStore} from "@/stores/dialogs";
import {useCampaignsStore} from "@/stores/campaigns";
import Spinner from "@/components/Spinner.vue";
import CampaignsPendingActionsWithdrawDialog from "@/components/campaigns/pendingActions/withdrawDialog/main.vue";

export default {
  name: "CampaignsPendingActions",
  components: {
    CampaignsPendingActionsWithdrawDialog,
    Spinner, CampaignsPendingActionsEtablissement, ScoreWidget, Etablissement, Entreprise, CampaignsDepartementFilter},
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
      cardsPayload: {summaries: []},
      loading: true,
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
    },
    cards() {
      return this.cardsPayload.summaries.reduce((m, f) => {
        m[f.siret] = f
        return m
      }, {})
    },
    selectedEtablissements() {
      return this.pending.etablissements.filter((e) => {
        return (this.campaigns.selectedDepartement)?e.codeDepartement==this.campaigns.selectedDepartement:true
      })
    },
    etablissements() {
      return this.pending.etablissements
    },
  },
  methods: {
    processMessage() {
      this.getPendingEtablissements()
      this.campaigns.getCampaigns(this.$axios)
    },
    getPendingEtablissements() {
      this.$axios.get('/campaign/actions/pending/' + this.campaignsSelectedID).then((r) => {
        this.pending = r.data || {etablissements: []}
        if (
          !this.pending.etablissements.some((e) => {
            return (e.codeDepartement == this.campaigns.selectedDepartement)
          })) {
          this.campaigns.selectedDepartement = null
        }
      }).catch((e) => {
        this.pending = {
          etablissements: [],
        }
      }).finally(() => {
        this.loading = false
      })
    },
  },
}