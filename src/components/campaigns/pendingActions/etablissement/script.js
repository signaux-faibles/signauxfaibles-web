import ScoreWidget from "@/components/ScoreWidget.vue";
import Card from "@/components/card/main.vue";
import {useDialogsStore} from "@/stores/dialogs";

export default {
  name: 'CampaignsPendingActionsEtablissement',
  components: {Card, ScoreWidget},
  props: ['etablissement'],
  setup() {
    const dialogs = useDialogsStore()
    return {dialogs}
  }
}