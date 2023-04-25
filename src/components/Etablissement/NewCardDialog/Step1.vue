<template>
  <v-card>
    <v-card-title>

    </v-card-title>
    <v-card-text height="300px">
      <h3>À quel titre souhaitez vous prendre en charge cet établissement ?</h3>
      <v-radio-group
          v-model="createCardSwimlaneID"
          @change="resetCreateCard"
          mandatory
      >
        <v-radio v-for="swimlane in availableSwimlanes" :key="swimlane.index"
                 :label="swimlane.boardTitle + ', couloir ' + swimlane.title"
                 :value="swimlane.id"
        ></v-radio>
      </v-radio-group>
      <v-alert
          colored-border
          type="info"
      >
        Le choix que vous opérez ici définit l'ensemble des personnes avec lesquelles vous partagez les informations de suivi.

      </v-alert>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn dark color="indigo" @click="createCardSequence=2">
        Étape suivante
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: "Step1",
    props: ['codeDepartement'],
    methods: {
      boardFromID(boardID) {
        return this.kanbanConfig.boards[boardID]
      },
      resetCreateCard() {
        this.$store.commit('setCreateCardLabels', [])
        this.$store.commit('setCreateCardProblems', [])
        this.$store.commit('setCreateCardActions', [])
      }
    },
    computed: {
      createCardSwimlaneID: {
        get() {
          return this.$store.state.createCardSwimlaneID
        },
        set(value) {
          this.$store.commit('setCreateCardSwimlaneID', value)
        }
      },
      createCardSequence: {
        get() {
          return this.$store.state.createCardSequence
        },
        set(value) {
          this.$store.commit('setCreateCardSequence', value)
        }
      },
      kanbanConfig() {
        return this.$store.state.kanbanConfig
      },
      availableSwimlanes() {
        const swimlanes = this.kanbanConfig.departements[this.codeDepartement]
        return swimlanes.map((s) => {
          return {
            boardTitle: this.boardFromID(s.boardID).title,
            boardSlug: this.boardFromID(s.boardID).slug,
            title: this.boardFromID(s.boardID).swimlanes[s.swimlaneID].title,
            id: s.swimlaneID,
          }
        }).sort((s1, s2) => (s1.boardTitle < s2.boardTitle)?-1:1)
      },
    }
  }
</script>