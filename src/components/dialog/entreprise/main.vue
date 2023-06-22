<template>
  <v-dialog transition="slide-y-transition" v-model="dialogs.entreprise" fullscreen>
    <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
      <v-toolbar
        class="toolbar"
        fixed
        height="35px"
        style="color: #fff; font-size: 22px; z-index: 50;"
      >
        <v-spacer/>
        FICHE ENTREPRISE
        <v-spacer/>
        <v-icon style="color: #fff" @click="dialogs.hideEntreprise()">mdi-close</v-icon>
      </v-toolbar>
      <Entreprise v-if="dialogs.entreprise" :siren="dialogs.entrepriseSiren" v-on="$listeners"/>
    </div>
  </v-dialog>
</template>

<script src="./script.js"/>