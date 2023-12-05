<template>
  <div style="background-color: #fff;">
    <Editor
      v-if="dialogs.etablissementCardEditor"
      ref="editor"
      :options="options"
      :initialValue="dialogs.etablissementCardEditorDescription"
      initialEditType="wysiwyg"
      style="height: 70vh; width: 100%"/>
    <v-card class="elevation-3" style="display: flex; justify-content: right; width: 100%">
      <v-btn style="text-transform: none" text color="indigo" class="mt-3 mb-3" @click="dialogs.hideEtablissementCardEditor()">Annuler</v-btn>
      <v-btn style="text-transform: none" dark color="indigo" class="ma-3" @click="saveCard">Enregistrer</v-btn>
    </v-card>
  </div>
</template>

<script src="./script.js"/>
<style scoped src="./style.css"/>