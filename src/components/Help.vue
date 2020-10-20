<template>
  <v-menu :max-width="big ? '600px' : '400px'" offset-y>                 
    <v-btn ref="btn" slot="activator" icon :dark="dark" @click="trackMatomoEvent('general', 'ouvrir_aide', titre)"><v-icon>help</v-icon></v-btn>
    <v-card>
      <v-card-title class="headline">
        {{ titre }}
      </v-card-title>
      <v-card-text>
        <slot/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn flat color="primary">OK</v-btn>
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