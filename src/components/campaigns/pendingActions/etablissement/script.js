import ScoreWidget from "@/components/ScoreWidget.vue";
import Card from "@/components/card/main.vue";
import {useDialogsStore} from "@/stores/dialogs";

export default {
  name: 'CampaignsPendingActionsEtablissement',
  components: {Card, ScoreWidget},
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
  },
}