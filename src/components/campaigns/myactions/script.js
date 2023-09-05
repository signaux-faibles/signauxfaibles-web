import Card from "@/components/card/main.vue";
import Etablissement from "@/components/etablissement/Main.vue";
import Entreprise from "@/components/entreprise/main.vue";
import Toolbar from "@/components/Toolbar.vue";
import Help from "@/components/Help.vue";
import CampaignsEtablissement from '@/components/campaigns/myactions/etablissement/main.vue'
import {useCampaignsStore} from "@/stores/campaigns";
import {useDialogsStore} from "@/stores/dialogs";
import Spinner from "@/components/Spinner.vue";
import CampaignsDepartementFilter from "@/components/campaigns/departementFilter/main.vue";

export default {
  name: "CampaignsMyActions",
  components: {
    CampaignsDepartementFilter,
    Spinner, Help, Entreprise, Etablissement, Card, Toolbar, CampaignsEtablissement
  },
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
      myActions: {etablissements: []}
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
          if (
            !this.myActions.etablissements.some((e) => {
              return (e.codeDepartement == this.campaigns.selectedDepartement)
            })) {
            this.campaigns.selectedDepartement = null
          }
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
    etablissements() {
      return this.myActions.etablissements
    },
    selectedEtablissements() {
      return this.etablissements.filter((e) => {
        return (this.campaigns.selectedDepartement) ? e.codeDepartement == this.campaigns.selectedDepartement : true
      })
    },
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