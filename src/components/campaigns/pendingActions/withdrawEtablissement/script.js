import ScoreWidget from "@/components/ScoreWidget.vue";
import Card from "@/components/card/main.vue";
import {useDialogsStore} from "@/stores/dialogs";
import {useWithdrawDialogStore} from "@/stores/withdrawDialog";
import StatusLabels from "@/assets/campaignStatus.json";

export default {
  name: 'CampaignsPendingActionsWithdrawEtablissement',
  components: {Card, ScoreWidget},
  data() {
    return {}
  },
  props: ['etablissement', 'card'],
  setup() {
    const dialogs = useDialogsStore()
    const withdrawDialog = useWithdrawDialogStore()
    return {dialogs,withdrawDialog}
  },
  computed: {
    withdrawLabels() {
      return StatusLabels.withdraw
    }
  },
  methods: {
    take(campaignID, id) {
      this.$axios.get('/campaign/take/' + campaignID + '/' + id).then(() => {
      })
    },
    showCampaignCardEditor() {
      this.dialogs.showCampaignCardEditor(
        this.etablissement.siret,
        this.etablissement.codeDepartement,
        this.etablissement.raisonSociale,
        this.etablissement.id,
        this.etablissement.description)
    }
  },
}