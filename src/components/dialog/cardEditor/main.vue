<template>
  <v-dialog
    v-model="dialogs.cardEditor"
  >
    <v-toolbar
      dark
      color='indigo'>
      <v-toolbar-title class="localtoolbar">
        Fiche de synthèse – {{dialogs.cardsDenomination}} ({{dialogs.cardsSiret}})
      </v-toolbar-title>
      <v-spacer/>
      <Help titre="Fiches de synthèse">
        <template>
          Les fiches de synthèse vous permettent de partager des informations.<br/>
          Leur visibilité est conditionnée par les permissions de l'application.<br/>
        </template>
      </Help>
    </v-toolbar>
    <FollowCardEditor/>
  </v-dialog>
</template>

<script src="./script.js"/>
<style src="./style.css"/>