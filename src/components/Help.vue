<template>
  <v-menu max-width="400px" offset-y>                 
    <v-btn slot="activator" icon @click="$matomo.trackEvent('general', 'ouvrir_aide', titre)"><v-icon>help</v-icon></v-btn>
    <v-card>
      <v-card-title class="headline">
        {{ titre }}
      </v-card-title>
      <v-card-text>
        <slot/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn flat color="success">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: ['titre'],
  name: 'Help',
}
</script>