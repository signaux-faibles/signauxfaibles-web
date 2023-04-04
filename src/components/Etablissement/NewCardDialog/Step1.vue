<template>
  <v-card>
    <v-card-title>
      Étape 1: Tableau de suivi
    </v-card-title>
    <v-card-text height="300px">
      Plusieurs couloirs correspondent à cet établissement, veuillez sélectionner le couloir dans lequel vous souhaitez créer la carte de suivi:
      <v-radio-group
          v-model="createCardSwimlaneID"
          mandatory
      >
        <v-radio v-for="swimlane in swimlanes" :key="swimlane.index"
                 :label="swimlane.boardTitle + ', couloir ' + swimlane.title"
                 :value="swimlane.id"
        ></v-radio>
      </v-radio-group>
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
    props: ['swimlanes'],
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
    }
  }
</script>