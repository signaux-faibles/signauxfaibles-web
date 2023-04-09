<template>
  <v-card>
    <v-card-title>
      Tableau de prise en charge
    </v-card-title>
    <v-card-text height="300px">
      Plusieurs tableaux de prise en charge correspondent à cet établissement, veuillez sélectionner le couloir dans lequel vous souhaitez créer la carte de suivi.
      <v-radio-group
          v-model="createCardSwimlaneID"
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
        Seuls les tableaux correspondant à l'implantation géographique de l'établissement vous sont ici présentés.
        Le choix que vous opérez ici va définir le cercle de personnes avec lesquels vous partagez vos informations au sujet de cette entreprise.

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