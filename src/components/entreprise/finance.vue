<template>
  <div>
    <v-toolbar
      dark
      color='indigo'>
      <v-toolbar-title class="localtoolbar">Informations financières</v-toolbar-title>
      <v-spacer/>
      <Gitbook icon :target="gitbookPath('INTERPRETATION_FINANCE')"/>
    </v-toolbar>
    <div>
      <Finoscope :siren="siren" :naf="naf"/>
    </div>
  </div>
</template>

<script>
import Finoscope from '@/components/finoscope/Finoscope.vue'
import Gitbook from "@/components/Gitbook.vue";

export default {
  name: 'EntrepriseFinoscope',
  props: ['siren', 'naf'],
  components: {Gitbook, Finoscope },
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
