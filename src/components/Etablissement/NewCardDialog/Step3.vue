<template>
  <div>
    <v-card>
      <v-card-title>
        Étape 3: Actions à entreprendre
      </v-card-title>
      <v-card-text>
        <h3>
          Quelles actions ont déjà été menées ou sont envisagées ?
          <Help titre="Actions menées ou envisagées" :big="true">
            <div v-html="newCardConfig.actionHelpContent" />
          </Help>
        </h3>
        <v-select
            ref="actions"
            v-model="createCardActions"
            :items="newCardConfig.actionItems"
            :menu-props="{ maxHeight: 400 }"
            multiple
            chips
        >
          <template v-slot:append-item>
            <div class="text-center my-2">
              <v-btn @click="$refs.actions.isMenuActive = false" color="primary">OK</v-btn>
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
          Suivant
          <v-icon class="ml-3" left>mdi-page-next</v-icon>
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
  components: { Help },
  computed: {
    newCardConfig() {
      return this.newCardConfigBase['tableau-crp']
    },
    newCardConfigBase() {
      return newCardConfigBase
    },
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