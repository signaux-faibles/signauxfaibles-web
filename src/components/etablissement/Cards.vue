<template>
  <div>
    <v-toolbar class="mr-1"
               color='indigo'
               dark>
      <v-toolbar-title class="localtoolbar">
        Fiches de synthèse
      </v-toolbar-title>
    </v-toolbar>
    <FollowCards :siret="siret" :codeDepartement="codeDepartement" :denomination="denomination"/>
  </div>
</template>

<script>
import FollowCards from '@/components/etablissement/cards/main.vue'

export default {
  name: 'Cards',
  props: ['siret', 'denomination', 'codeDepartement'],
  components: { FollowCards },
}
</script>

<style>
thead tr {
  text-align: center;
}

thead td {
  font-size: 17px !important;
}
</style>