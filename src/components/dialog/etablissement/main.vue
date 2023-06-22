<template>
  <div>
      <v-dialog transition="slide-y-transition" v-model="dialogs.etablissement" fullscreen>
        <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
          <v-toolbar class="toolbar" fixed height="35px" style="color: #fff; font-size: 22px; z-index: 50;">
            <v-spacer/>
            FICHE ETABLISSEMENT
            <v-spacer/>
            <v-icon style="color: #fff" @click="dialogs.hideEtablissement()">mdi-close</v-icon>
          </v-toolbar>
          <Etablissement v-if="dialogs.etablissement" :siret="dialogs.etablissementSiret"></Etablissement>
        </div>
      </v-dialog>
  </div>
</template>

<script src="./script.js"/>