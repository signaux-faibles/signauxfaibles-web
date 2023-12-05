<template>
  <div>
    <v-card>
      <v-card-title>
        Quelles étiquettes correspondent à ce dossier ?
      </v-card-title>
      <v-card-text>
        <v-select
            ref="labelMenu"
            v-model="dialogs.createCardLabels"
            :items="newCardLabelItems"
            :menu-props="{ maxHeight: 400 }"
            label="Étiquettes"
            multiple
            prepend-icon="fa-tag"
            style="margin-bottom: -30px"
        >
          <template v-if="dialogs.createCardLabels.length > 0" v-slot:prepend-inner>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" @click="resetLabels" v-on="on">
                  fa-xmark
                </v-icon>
              </template>
              Réinitialiser la sélection
            </v-tooltip>
          </template>
          <template v-slot:selection="{ item, index }">
            <v-chip :color="item.background" :text-color="item.front">
              {{ item.text }}
            </v-chip>
          </template>
          <template v-slot:item="{ active, item, attrs, on }">
            <v-chip :color="item.background" :text-color="item.front">{{ item.text }}</v-chip>
          </template>
          <template v-slot:append-item>
            <div class="text-center my-2">
              <v-btn color="primary" @click="$refs.labelMenu.isMenuActive = false">OK</v-btn>
            </div>
          </template>
        </v-select>

        <v-alert
            style="top: 30px"
            colored-border
            type="info"
        >
          Les étiquettes facilitent la classification et le suivi de vos interventions,
            notamment par des filtres et des statistiques.
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn style="text-transform: none" color="indigo" text
               @click="previousStep">
          Retour
        </v-btn>
        <v-btn style="text-transform: none" color="indigo" dark
               @click="nextStep">
          Étape suivante
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import labelColors from "@/assets/labels.json";
import newCardConfigBase from "@/assets/new_card_config.json";
import Help from "@/components/Help.vue";
import {useKanbanStore} from "@/stores/kanban";
import {useDialogsStore} from "@/stores/dialogs";

export default {
  name: 'DialogCreateCardCrpStep4',
  components: {Help},
  setup() {
    const kanban = useKanbanStore()
    const dialogs = useDialogsStore()
    return {kanban,dialogs}
  },
  methods: {
    nextStep() {
      this.dialogs.createCardSequence = 'crpStep5'
    },
    previousStep() {
      this.dialogs.createCardSequence = 'crpStep3'
    },
    resetLabels(event) {
      this.createCardLabels = []
      event.stopPropagation()
    },
  },
  computed: {
    newCardConfig() {
      return newCardConfigBase[this.currentBoardType] || []
    },
    newCardConfigBase() {
      return newCardConfigBase
    },
    newCardLabelItems() {
      const currentBoardID = this.kanban.boardIDFromSwimlaneID(this.dialogs.createCardSwimlaneID)
      const currentBoard = this.kanban.config.boards[currentBoardID]
      const labels = Object.values(currentBoard.labels).reduce((m, label) => {
          if (label.name !== '') {
            m[label.name] = labelColors[label.color]
          }
          return m
        }, {})
      return Object.entries(labels).map(([name, color]) => {
        return {
          text: name,
          background: color.background,
          front: color.front,
          value: name,
        }
      }).sort((label1, label2) => {
        return (label1.background + label1.name < label2.background + label2.name) ? -1 : 1
      })
    },
  },
}
</script>