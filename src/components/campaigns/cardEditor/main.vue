<template>
  <div style="background-color: #fff;">
    <Editor
      v-if="dialogs.campaignCardEditor"
      ref="editor"
      :options="options"
      :initialValue="dialogs.campaignCardEditorDescription"
      initialEditType="wysiwyg"
      style="height: 70vh; width: 100%"/>
    <v-card class="elevation-3" style="display: flex; justify-content: right; width: 100%">
      <v-btn outlined color="indigo" class="mt-3 mb-3" @click="dialogs.hideCampaignCardEditor()">ANNULER</v-btn>
      <v-btn dark color="indigo" class="ma-3" @click="saveCard">ENREGISTRER</v-btn>
    </v-card>
  </div>
</template>

<script src="./script.js"/>
<style scoped src="./style.css"/>