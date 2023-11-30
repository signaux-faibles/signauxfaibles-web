<template>
  <v-card>
    <v-card-text height="300px">
      <h3 class="pt-5">Au sein de quel groupe accompagnez vous cet établissement ?</h3>
      <v-radio-group
        v-model="dialogs.createCardSwimlaneID"
        mandatory
        @change="dialogs.resetCreateCard"
      >
        <v-radio v-for="swimlane in availableSwimlanes" :key="swimlane.index"
                 :label="swimlane.boardTitle"
                 :value="swimlane.id"
        ></v-radio>
      </v-radio-group>
      <v-alert
        v-if="cardsForCurrentSwimlaneID"
        border="left"
        density="compact"
        elevation="3"
        title="Avertissement"
        type="error"
      >
        Cet établissement est déjà accompagné au sein de ce groupe, souhaitez-vous vraiment créer un autre accompagnement ?
      </v-alert>
      <v-alert
        v-if="archivedCardsForCurrentSwimlaneID && !cardsForCurrentSwimlaneID"
        density="compact"
        elevation="3"
        title="Avertissement"
        type="error"
      >
        Cet établissement a une accompagnement archivé dans ce groupe, en avez-vous pris connaissance avant de créer
        cette nouvelle entrée ?
      </v-alert>
      <v-alert
        colored-border
        type="info"
      >
        Le choix que vous opérez ici définit l'ensemble des personnes avec lesquelles vous partagez les informations de
        suivi.
      </v-alert>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="mb-2" color="indigo" style="text-transform: none" text @click="dialogs.closeCreateCardDialog">
        Annuler
      </v-btn>
      <v-btn class="mb-2" color="indigo" dark style="text-transform: none;" @click="nextSequence">
        Étape suivante
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {useKanbanStore} from "@/stores/kanban";
import {useDialogsStore} from "@/stores/dialogs";

export default {
  name: "dialogCreateCardStart",
  props: ['codeDepartement', 'cards'],
  setup() {
    let kanban = useKanbanStore();
    let dialogs = useDialogsStore();
    return {kanban, dialogs}
  },
  methods: {
    nextSequence() {
      const boardID = this.kanban.boardIDFromSwimlaneID(this.dialogs.createCardSwimlaneID)
      if (this.kanban.isCampaignBoardID(boardID)) {
        this.dialogs.createCardSequence = 'campaignStep2'
      }  else {
        this.dialogs.createCardSequence = 'crpStep2'
      }
    }
  },
  computed: {
    cardsForCurrentSwimlaneID() {
      return this.cards.filter((c) => c.swimlaneID == this.createCardSwimlaneID && !c.archived).length
    },
    archivedCardsForCurrentSwimlaneID() {
      return this.cards.filter((c) => c.swimlaneID == this.createCardSwimlaneID && c.archived).length
    },
    availableSwimlanes() {
      return this.kanban.availableSwimlanes(this.codeDepartement)
    },
  }
}
</script>