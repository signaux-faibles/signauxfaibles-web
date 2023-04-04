<template>
  <div>
    <v-card>
      <v-card-title>
        Étape 4: Récapitulatif
      </v-card-title>
      <v-card-text>
        Vous êtes sur le point de créer une nouvelle carte de suivi, prenez quelques seconde pour vérifier les informations que
        vous allez transmettre
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="indigo" outlined
               @click="createCardSequence=3">
          retour
        </v-btn>
        <v-btn color="indigo" dark
               @click="createCard">
          Créer la carte
          <v-icon class="ml-3" left>mdi-tray-arrow-up</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Step4',
  methods: {
    createCard() {alert('plop')}
  },
  computed: {
    createCardSequence: {
      get() {
        return this.$store.state.createCardSequence
      },
      set(value) {
        this.$store.commit('setCreateCardSequence', value)
      },
    },
  },
}
</script>