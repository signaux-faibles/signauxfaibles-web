<template>
  <div>
    <v-toolbar
      dark
      color='indigo'>
      <v-toolbar-title class="localtoolbar">Informations financières</v-toolbar-title>
      <v-spacer/>
      <v-btn
          icon
          dark
          target="_blank"
          href="https://signaux-faibles.gitbook.io/guide-dutilisation-et-faq/ratios-financiers"
          text
          style="position: relative; top: -2px;"
      >
        <v-icon dark>
          mdi-library-books
        </v-icon>
      </v-btn>
    </v-toolbar>
    <div>
      <Finoscope :siren="siren"/>
    </div>
  </div>
</template>

<script>
import Finoscope from '@/components/Finoscope/Finoscope.vue'

export default {
  name: 'EntrepriseFinoscope',
  props: ['siren'],
  components: { Finoscope },
  created() {
    if (process.env.VUE_APP_BILANS_ENABLED && !!JSON.parse(process.env.VUE_APP_BILANS_ENABLED)) {
      this.getBilansExercices()
    }
  },
  methods: {
  },
  computed: {
  },
}
</script>

<style scoped>
::v-deep .fraction {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
}

div.valeur {
  text-align: right;
  width: 100%;
}

.subheader {
  width: 100%;
}

v-table tr td, v-table tr th {
  padding: 5px;
}
v-table tbody tr:not(:last-child) td {
  border-bottom: 1px solid rgba(0,0,0,0.20);
}
</style>