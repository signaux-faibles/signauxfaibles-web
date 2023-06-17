<template>
  <div>
    <div v-if="!edit" @click="showEditor">
      <viewer
        ref="viewer"
        :initialValue="card.description"
        :options="editorOptions()"
        class="viewer pa-5"
      />
      <v-btn>éditer</v-btn>
    </div>
    <div v-if="edit">
      <editor
        v-if="edit"
        :initialValue="card.description"
        :options="editorOptions()"
        class="textblock"
        height="400px"
        initialEditType="wysiwyg"
      />
      <v-btn @click="this.hideEditor">annuler</v-btn>
      <v-btn>enregistrer</v-btn>
    </div>
    <br/>

  </div>
</template>

<script src="./script.js"/>
<style src="./style.css"/>