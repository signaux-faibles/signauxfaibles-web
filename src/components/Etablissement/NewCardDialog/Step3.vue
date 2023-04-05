<template>
  <div>
    <v-card>
      <v-card-title>
        Étape 3: Actions à entreprendre
      </v-card-title>
      <v-card-text>
        <h3>
          Quelles actions ont déjà été menées ou sont envisagées ?
          <Help :big="true" titre="Actions menées ou envisagées">
            <div v-html="newCardConfig.actionHelpContent"/>
          </Help>
        </h3>
        <v-select
            ref="actions"
            v-model="createCardActions"
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

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo" outlined
               @click="createCardSequence=2">
          retour
        </v-btn>
        <v-btn color="indigo" dark
               @click="createCardSequence=4">
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
  name: 'Step3',
  components: {Help},
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
      const typeRegexp = /^(tableau-.*)-.*/
      const match = this.currentBoard.match(typeRegexp)
      return (match.length > 1) ? match[1] : null
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
    createCardActions: {
      get() {
        return this.$store.state.createCardActions
      },
      set(value) {
        this.$store.commit('setCreateCardActions', value)
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