<template>
  <div>
    <v-card>
      <v-card-title>
        Récapitulatif
      </v-card-title>
      <v-card-text>
        Avant de terminer, faisons le point sur les informations que vous allez enregistrer
        <h3>Tableau sélectionné: {{ currentBoard.title }}</h3>
        <h3>Couloir: {{ currentSwimlane }}</h3>
        <h3>Description: {{ createCardDescription }}</h3>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo" outlined
               @click="createCardSequence=4">
          retour
        </v-btn>
        <v-btn color="indigo" dark
               @click="createCard">
          Terminer
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Step5',
  methods: {
    createCard() {alert('plop')}
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
    currentSwimlane() {
      return this.currentBoard.swimlanes[this.createCardSwimlaneID].title
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