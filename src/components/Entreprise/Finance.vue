<template>
  <div>
    <v-toolbar
      dark
      color='indigo'>
      <v-toolbar-title class="localtoolbar">Informations financières</v-toolbar-title>
      <v-spacer/>
      <Gitbook icon :target="gitbookPath('LISTES')"/>
    </v-toolbar>
    <div>
      <Finoscope :siren="siren" :naf="naf"/>
    </div>
  </div>
</template>

<script>
import Finoscope from '@/components/Finoscope/Finoscope.vue'
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