import StatusLabels from "@/assets/campaignStatus.json";

import ScoreWidget from "@/components/ScoreWidget.vue";
import Card from "@/components/card/main.vue";
import {useDialogsStore} from "@/stores/dialogs";
import {useKanbanStore} from "@/stores/kanban";

export default {
  name: 'CampaignsTakenActionsEtablissement',
  components: {Card, ScoreWidget},
  props: ['etablissement', 'card'],
  setup() {
    const dialogs = useDialogsStore()
    const kanban = useKanbanStore()
    return {dialogs, kanban}
  },
  methods: {
    successLabels() {
      return StatusLabels.success
    },
    showCampaignCardEditor() {
      this.dialogs.showCampaignCardEditor(
        this.etablissement.siret,
        this.etablissement.codeDepartement,
        this.etablissement.raisonSociale,
        this.etablissement.id,
        this.etablissement.description)
    },
  },
}