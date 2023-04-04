<template>
  <div>
    <v-card>
      <v-card-title>
        Étape 2: Problématiques de l'entreprise
      </v-card-title>
    {{ typeCurrentBoard }}
      <v-card-text>
        Vous pouvez dès à présent commencer à renseigner des informations sur le suivi de cette entreprise.
        <p/>
        <h3>
          Quelles problématiques avez vous identifiées à ce stade ?
          <Help titre="Problématiques identifiées" :big="true">
            <div v-html="newCardConfig.problemHelpContent" />
          </Help>
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
  name: 'Step2',
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
    typeCurrentBoard() {
      const typeRegexp = /^(tableau-.*)-.*/
      const match = this.currentBoard.match(typeRegexp)
      return (match.length>1)?match[1]:null
    },
    newCardConfig() {
      return newCardConfigBase[this.typeCurrentBoard]
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