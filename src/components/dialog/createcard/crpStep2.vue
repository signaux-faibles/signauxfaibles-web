<template>
  <div>
    <v-card>
      <v-card-title>
        Identifiez les problématiques de l'entreprise
      </v-card-title>
      <v-card-text>
        <h3>

        </h3>
        <v-select
          ref="problems"
          v-model="dialogs.createCardProblems"
          :items="newCardConfig.problemItems"
          :menu-props="{ maxHeight: 400 }"
          multiple
          chips
        >
          <template v-slot:append-item>
            <div class="text-center my-2">
              <v-btn @click="$refs.problems.isMenuActive = false" color="primary">ok</v-btn>
            </div>
          </template>
        </v-select>
        <v-alert
            colored-border
            type="info"
        >
          Ces informations restent modifiables à tout moment.
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo" style="text-transform: none" text
               @click="previousStep">
          Retour
        </v-btn>
        <v-btn color="indigo" style="text-transform: none" dark
               @click="nextStep">
          Étape suivante
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import newCardConfigBase from '@/assets/new_card_config.json'
import Help from '@/components/Help.vue'
import {useDialogsStore} from "@/stores/dialogs";
import {useKanbanStore} from "@/stores/kanban";

export default {
  name: 'DialogCreateCardCrpStep2',
  components: { Help },
  setup() {
    const dialogs = useDialogsStore()
    const kanban = useKanbanStore()
    return {dialogs, kanban}
  },
  methods: {
    nextStep() {
      this.dialogs.createCardSequence = 'crpStep3'
    },
    previousStep() {
      this.dialogs.createCardSequence = 'start'
    },
  },
  computed: {
    currentBoardType() {
      const boardID = this.kanban.boardIDFromSwimlaneID(this.dialogs.createCardSwimlaneID)
      return this.kanban.boardType(boardID)
    },
    newCardConfig() {
      return newCardConfigBase[this.currentBoardType] || []
    },
    newCardConfigBase() {
      return newCardConfigBase
    },
    kanbanConfig() {
      return this.$store.state.kanbanConfig
    },
  },
}
</script>