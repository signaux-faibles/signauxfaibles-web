<template>
  <v-menu v-if="info" max-width="600px" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          icon
          v-bind="attrs"
          v-on="on"
          ref="btn"
          @click="trackMatomoEvent('general', 'info_finoscope', info.title)"
          x-small
          style="position: relative; top: -2px;"
          color="#999"
      >
        <v-icon>fa-circle-info</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ info.title }}
      </v-card-title>
      <v-card-text>
        {{ info.definition }}<br/>
        Pour en savoir plus, consultez <a target="_blank" :href="info.link">la définition complète</a>.
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text color="primary">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import definitions from '@/assets/finoscope-info.json'

export default {

  props: ['id'],
  name: 'Info',
  data() {
    return {
      definitions
    }
  },
  methods: {
    clickButton() {
      this.$refs.btn.$el.click()
    },
  },
  computed: {
    info() {
      return definitions.filter(d => d.id == this.id)[0]
    },
    definition() {
      return (this.info)?this.info.definition:""
      
    }
  }
}
</script>