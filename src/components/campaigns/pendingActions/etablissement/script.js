import ScoreWidget from "@/components/ScoreWidget.vue";
import Card from "@/components/card/main.vue";
import CampaignsPendingActionsWithdrawDialog from "@/components/campaigns/pendingActions/withdrawDialog/main.vue";
import {useDialogsStore} from "@/stores/dialogs";
import {useWithdrawDialogStore} from "@/stores/withdrawDialog";

export default {
  name: 'CampaignsPendingActionsEtablissement',
  components: {CampaignsPendingActionsWithdrawDialog, Card, ScoreWidget},
  data() {
    return {}
  },
  props: ['etablissement', 'card'],
  setup() {
    const dialogs = useDialogsStore()
    const withdrawDialog = useWithdrawDialogStore()
    return {dialogs,withdrawDialog}
  },
  methods: {
    showCampaignCardEditor() {
      this.dialogs.showCampaignCardEditor(
        this.etablissement.siret,
        this.etablissement.codeDepartement,
        this.etablissement.raisonSociale,
        this.etablissement.id,
        this.etablissement.description)
    },
    take(campaignID, id) {
      this.$axios.get('/campaign/take/' + campaignID + '/' + id).then(() => {
      })
    },
    showWithdrawDialog() {
      this.withdrawDialog.show(
        this.etablissement.campaignID,
        this.etablissement.id,
        this.etablissement.raisonSociale
      )
    }
  },
}