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
          v-model="createCardProblems"
          :items="newCardConfig.problemItems"
          :menu-props="{ maxHeight: 400 }"
          multiple
          chips
        >
          <template v-slot:append-item>
            <div class="text-center my-2">
              <v-btn @click="$refs.problems.isMenuActive = false" color="primary">OK</v-btn>
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
        <v-btn color="indigo" outlined
               @click="createCardSequence=1">
          retour
        </v-btn>
        <v-btn color="indigo" dark
               @click="createCardSequence=3">
          Étape suivante
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import newCardConfigBase from '@/assets/new_card_config.json'
import Help from '@/components/Help.vue'

export default {
  name: 'DialogCreateCardCrpStep2',
  components: { Help },
  computed: {
    currentBoard() {
      const currentSwimlaneID = this.createCardSwimlaneID
      for (const board of Object.values(this.kanbanConfig.boards)) {
         if (currentSwimlaneID in board.swimlanes) {
           return board.slug
         }
      }
      return currentSwimlaneID
    },
    currentBoardType() {
      const typeRegexp = /^((tableau|actions)-.*)-.*/
      const match = this.currentBoard.match(typeRegexp)
      return (match.length>1)?match[1]:null
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
    createCardSequence: {
      get() {
        return this.$store.state.createCardSequence
      },
      set(value) {
        this.$store.commit('setCreateCardSequence', value)
      },
    },
    createCardProblems: {
      get() {
        return this.$store.state.createCardProblems
      },
      set(value) {
        this.$store.commit('setCreateCardProblems', value)
      },
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