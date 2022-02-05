<template>
  <v-menu max-width="40%" max-height="60%" offset-y>                 
    <v-btn  dark color="indigo"  ref="btn" slot="activator" @click="trackMatomoEvent('general', 'ouvrir_aide', titre)">{{ handle }}</v-btn>
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
  props: ['titre', 'dark', 'big', 'handle'],
  name: 'Popup',
  methods: {
    clickButton() {
      this.$refs.btn.$el.click()
    },
  },
}
</script>