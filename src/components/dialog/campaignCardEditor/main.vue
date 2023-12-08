<template>
  <v-dialog
    persistent
    v-model="dialogs.campaignCardEditor"
  >
    <v-toolbar
      dark
      color='indigo'>
      <v-toolbar-title class="localtoolbar">
        Note d'accompagnement – {{ dialogs.capmaignCardEditorDenomination }}
        ({{ dialogs.campaignCardEditorSiret }})
      </v-toolbar-title>
      <v-spacer/>
      <Help titre="Fiches de synthèse">
        <template>
          Les fiches de synthèse vous permettent de partager des informations.<br/>
          Leur visibilité est conditionnée par les permissions de l'application.<br/>
        </template>
      </Help>
    </v-toolbar>
    <CampaignCardEditor/>
  </v-dialog>
</template>

<script src="./script.js"/>
<style src="./style.css"/>