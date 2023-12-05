<template>
  <v-dialog v-if="kanbanConfig" v-model="dialogs.createCardDialog" max-width="600px" persistent
            @input="dialogs.closeCreateCardDialog()">
    <v-toolbar
      color="indigo"
      dark
    >
      <v-toolbar-title>Nouvel accompagnement</v-toolbar-title>
      <v-spacer/>
      <v-btn
        dark
        icon
        @click="dialogs.closeCreateCardDialog"
      >
        <v-icon>fa-xmark</v-icon>
      </v-btn>
    </v-toolbar>
    <dialogCreateCardStart v-if="dialogs.createCardSequence==='start'" :cards="cards" :codeDepartement="codeDepartement"/>
    <DialogCreateCardCrpStep2 v-if="dialogs.createCardSequence==='crpStep2'"/>
    <DialogCreateCardCrpStep3 v-if="dialogs.createCardSequence==='crpStep3'"/>
    <DialogCreateCardCrpStep4 v-if="dialogs.createCardSequence==='crpStep4'"/>
    <DialogCreateCardCrpStep5 :siret="siret" v-if="dialogs.createCardSequence==='crpStep5'"/>
    <DialogCreateCardCampaignStep2 :siret="siret" v-if="dialogs.createCardSequence==='campaignStep2'"/>
<!--    <div style="background-color: #fff">-->
<!--      dialogs.createCard: {{ dialogs.createCard }} <br/>-->
<!--      dialogs.createCardSequence: {{ dialogs.createCardSequence }} <br/>-->
<!--      dialogs.createCardSwimlaneID: {{ dialogs.createCardSwimlaneID }} <br/>-->
<!--      dialogs.createCardDialog: {{ dialogs.createCardDialog }} <br/>-->
<!--      dialogs.createCardProblems:  {{ dialogs.createCardProblems }} <br/>-->
<!--      dialogs.createCardActions: {{ dialogs.createCardActions }} <br/>-->
<!--      dialogs.createCardLabels: {{ dialogs.createCardLabels }} <br/>-->
<!--      kanban.availableSwimlanes({{codeDepartement}}): {{ kanban.availableSwimlanes(codeDepartement) }}<br/>-->
<!--      <span v-if="dialogs.createCardSwimlaneID">boardID: {{ kanban.boardIDFromSwimlaneID(dialogs.createCardSwimlaneID) }}<br/></span>-->
<!--      <span v-if="dialogs.createCardSwimlaneID">lists: {{ kanban.isCampaignBoardID(kanban.boardIDFromSwimlaneID(dialogs.createCardSwimlaneID)) }}</span>-->
<!--    </div>-->
  </v-dialog>
</template>

<script>
import Help from '@/components/Help.vue'
import DialogCreateCardStart from './start.vue'
import DialogCreateCardCrpStep2 from './crpStep2.vue'
import DialogCreateCardCrpStep3 from './crpStep3.vue'
import DialogCreateCardCrpStep4 from './crpStep4.vue'
import DialogCreateCardCrpStep5 from './crpStep5.vue'
import DialogCreateCardCampaignStep2 from "./campaignStep2.vue";
import {useDialogsStore} from "@/stores/dialogs";
import {useKanbanStore} from "@/stores/kanban";

export default {
  components: {
    DialogCreateCardCampaignStep2,
    Help,
    DialogCreateCardStart,
    DialogCreateCardCrpStep2,
    DialogCreateCardCrpStep3,
    DialogCreateCardCrpStep4,
    DialogCreateCardCrpStep5
  },
  name: 'NewCardDialog',
  props: ['codeDepartement', 'siret', 'cards'],
  setup() {
    const dialogs = useDialogsStore()
    const kanban = useKanbanStore()
    return { dialogs, kanban }
  },
  data() {
    return {
      boardAlert: false,
      boardAlertError: '',
      boardError: '',
      creatingCard: false,
    }
  },
  methods: {
    createNewFollowCard() {
      this.trackMatomoEvent('etablissement', 'creer_carte_suivi', this.siret)
      this.creatingCard = true
      const params = {
        description: this.formattedDescription,
        boardId: this.currentBoard,
      }
      this.$axios.post(`/wekan/cards/${this.siret}`, params).then((response) => {
        this.dialogs.createCardProblems = []
        this.dialogs.createCardActions = []
        this.boardAlertError = ''
        this.boardAlert = false
        this.$parent.getBoards()
      }).catch((error) => {
        this.boardAlertError = 'Une erreur est survenue lors de la création de la carte de suivi'
        this.boardAlert = true
      }).finally(() => {
        this.creatingCard = false
      })
    },
    closeCreateCardDialog() {
      this.dialogs.createCardProblems = []
      this.dialogs.createCardActions = []
      this.dialogs.createCardDialog = false
      this.dialogs.createCardSequence = 'start'
      this.dialogs.boardAlertError = ''
      this.dialogs.boardAlert = false
    },
  },
  computed: {
    wekanUser() {
      return this.roles.includes('wekan')
    },
    kanbanConfig() {
      return this.$store.state.kanbanConfig
    },
  },
}
</script>