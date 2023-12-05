<template>
  <v-dialog
    persistent
    v-model="dialogs.etablissementCardEditor"
  >
    <v-toolbar
      dark
      color='indigo'>
      <v-toolbar-title class="localtoolbar">
        Note d'accompagnement – {{ dialogs.etablissementCardEditorDenomination }}
        ({{ dialogs.etablissementCardEditorSiret }})
      </v-toolbar-title>
      <v-spacer/>
      <Help titre="Fiches de synthèse">
        <template>
          Les notes d'accompagnement vous permettent de partager des informations.<br/>
          Leur visibilité est conditionnée par les permissions de l'application.<br/>
        </template>
      </Help>
    </v-toolbar>
    <EtablissementCardEditor/>
  </v-dialog>
</template>

<script src="./script.js"/>
<style src="./style.css"/>