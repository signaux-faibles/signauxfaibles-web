<template>
  <div>
    <v-card>
      <v-card-title>
          Quelles actions sont menées ou envisagées ?
      </v-card-title>
      <v-card-text>
        <v-select
            ref="actions"
            v-model="dialogs.createCardActions"
            :items="newCardConfig.actionItems"
            :menu-props="{ maxHeight: 400 }"
            chips
            multiple
        >
          <template v-slot:append-item>
            <div class="text-center my-2">
              <v-btn color="primary" @click="$refs.actions.isMenuActive = false">OK</v-btn>
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
import {useKanbanStore} from "@/stores/kanban";
import {useDialogsStore} from "@/stores/dialogs";

export default {
  name: 'DialogCreateCardCrpStep3',
  components: {Help},
  setup() {
    const kanban = useKanbanStore()
    const dialogs = useDialogsStore()
    return {kanban,dialogs}
  },
  methods: {
    nextStep() {
      this.dialogs.createCardSequence = 'crpStep4'
    },
    previousStep() {
      this.dialogs.createCardSequence = 'crpStep2'
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
  },
}
</script>