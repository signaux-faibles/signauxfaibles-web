import ScoreWidget from "@/components/ScoreWidget.vue";
import Card from "@/components/card/main.vue";
import {useDialogsStore} from "@/stores/dialogs";
import CampaignsPendingActionsWithdrawDialog from "@/components/campaigns/pendingActions/withdrawDialog/main.vue";

export default {
  name: 'CampaignsPendingActionsEtablissement',
  components: {CampaignsPendingActionsWithdrawDialog, Card, ScoreWidget},
  data() {
    return {}
  },
  props: ['etablissement', 'card'],
  setup() {
    const dialogs = useDialogsStore()
    return {dialogs}
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
    showWithdrawDialog(campaignID, etablissementID) {
      console.log("yo")
      this.dialogs.campaignWithdrawDialogCampaignID = this.etablissement.campaignID
      this.dialogs.campaignWithdrawDialogEtablissementID = this.etablissement.id
      this.dialogs.campaignWithdrawDialogRaisonSociale = this.etablissement.raisonSociale
      this.dialogs.campaignWithdrawDialog = true
    },
  },
}