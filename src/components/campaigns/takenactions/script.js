import {useCampaignsStore} from "@/stores/campaigns";
import CampaignsTakenActionsEtablissement from "@/components/campaigns/takenactions/etablissement/main.vue";
import {useKanbanStore} from "@/stores/kanban";
import Spinner from "@/components/Spinner.vue";
import CampaignsDepartementFilter from "@/components/campaigns/departementFilter/main.vue";

export default {
  name: "CampaignsTakenActions",
  components: {CampaignsDepartementFilter, Spinner, CampaignsTakenActionsEtablissement},
  setup() {
    const campaigns = useCampaignsStore()
    const kanban = useKanbanStore()
    return {campaigns, kanban}
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
        if (
          !this.allActionsPayload.etablissements.some((e) => {
            return (e.codeDepartement == this.campaigns.selectedDepartement)
          })) {
          this.campaigns.selectedDepartement = null
        }
      }).catch(() => {
        this.allActionsPayload = {etablissements: []}
      }).finally(() => {
        this.loading = false
      })
    },
    pluriel(nb) {
      return (nb>1)?'s':''
    },
  },
  computed: {
    kanbanConfig() {
      return this.$store.state.kanbanConfig
    },
    etablissements() {
      return this.allActionsPayload.etablissements
    },
    selectedEtablissements() {
      return this.etablissements.filter((e) => {
        return (this.campaigns.selectedDepartement)?e.codeDepartement==this.campaigns.selectedDepartement:true
      })
    },
    allActions() {
      return this.selectedEtablissements
        .filter((e) => e.action == 'take' || e.action == 'success')
        .reduce((m, e) => {
          if (m[e.username] == undefined) {
            m[e.username] = []
          }
          m[e.username].push(e)
          return m
        }, {})
    }
  },
  data() {
    return {
      allActionsPayload: {etablissements: []},
      loading: true,
    }
  }
}