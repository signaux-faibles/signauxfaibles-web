<template>
  <v-menu :max-width="big ? '600px' : '400px'" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" icon v-on="on" ref="btn" :dark="dark" @click="trackMatomoEvent('general', 'ouvrir_aide', titre)"><v-icon>help</v-icon></v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ titre }}
      </v-card-title>
      <v-card-text>
        <slot/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text color="primary">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: ['titre', 'dark', 'big'],
  name: 'Help',
  methods: {
    clickButton() {
      this.$refs.btn.$el.click()
    },
  },
}
</script>