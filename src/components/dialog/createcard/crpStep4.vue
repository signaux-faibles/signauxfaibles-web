<template>
  <div>
    <v-card>
      <v-card-title>
        Quelles étiquettes correspondent à ce dossier ?
      </v-card-title>
      <v-card-text>
        <v-select
            ref="labelMenu"
            v-model="createCardLabels"
            :items="newCardLabelItems"
            :menu-props="{ maxHeight: 400 }"
            label="Étiquettes"
            multiple
            prepend-icon="fa-tag"
            style="margin-bottom: -30px"
        >
          <template v-if="createCardLabels.length > 0" v-slot:prepend-inner>
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
        <v-btn color="indigo" outlined
               @click="createCardSequence=3">
          retour
        </v-btn>
        <v-btn color="indigo" dark
               @click="createCardSequence=5">
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

export default {
  name: 'DialogCreateCardCrpStep4',
  components: {Help},
  methods: {
    resetLabels(event) {
      this.createCardLabels = []
      event.stopPropagation()
    },
  },
  computed: {
    currentBoard() {
      const currentSwimlaneID = this.createCardSwimlaneID
      for (const board of Object.values(this.kanbanConfig.boards)) {
        if (currentSwimlaneID in board.swimlanes) {
          return board
        }
      }
      return null
    },
    currentBoardSlug() {
      const currentSwimlaneID = this.createCardSwimlaneID
      for (const board of Object.values(this.kanbanConfig.boards)) {
        if (currentSwimlaneID in board.swimlanes) {
          return board.slug
        }
      }
      return null
    },
    currentBoardType() {
      const typeRegexp = /^(tableau-.*)-.*/
      const match = this.currentBoardSlug.match(typeRegexp)
      return (match.length>1)?match[1]:null
    },
    newCardConfig() {
      return newCardConfigBase[this.currentBoardType] || []
    },
    newCardConfigBase() {
      return newCardConfigBase
    },
    newCardLabelItems() {
      const labels = Object.values(this.currentBoard.labels).reduce((m, label) => {
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
    createCardLabels: {
      get() {
        return this.$store.state.createCardLabels
      },
      set(value) {
        this.$store.commit('setCreateCardLabels', value)
      },
    },
    createCardSequence: {
      get() {
        return this.$store.state.createCardSequence
      },
      set(value) {
        this.$store.commit('setCreateCardSequence', value)
      },
    },
    kanbanConfig() {
      return this.$store.state.kanbanConfig
    },
    createCardSwimlaneID: {
      get() {
        return this.$store.state.createCardSwimlaneID
      },
      set(value) {
        this.$store.commit('setCreateCardSwimlaneID', value)
      },
    },
  },
}
</script>