<template>
  <div>
    <v-toolbar
      dark
      color='indigo'>
      <v-toolbar-title class="localtoolbar">Informations financières & comportement de paiement</v-toolbar-title>
      <v-spacer/>
    </v-toolbar>
    <v-layout align-center class="pt-3 pl-3">
      <v-flex shrink style="font-size: 17px">Retrouvez les informations financières et le comportement de paiement de cet établissement sur sa fiche Entreprise.</v-flex>
      <v-flex><v-btn v-if="siren" dark color="indigo" @click="$parent.showEntreprise" class="ml-4">Voir Fiche Entreprise</v-btn></v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'Finance',
  props: ['siren'],
}
</script>