<template>
  <v-dialog v-model="etablissementDialog" fullscreen>
    <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
      <v-toolbar class="toolbar" fixed height="35px" style="color: #fff; font-size: 22px; z-index: 50;">
        <v-spacer/>
        FICHE ETABLISSEMENT
        <v-spacer/>
        <v-icon style="color: #fff" @click="hideEtablissement()">mdi-close</v-icon>
      </v-toolbar>
      <Etablissement v-if="etablissementDialog" :siret="this.siret"></Etablissement>
    </div>
  </v-dialog>
</template>

<script src="./script.js"/>