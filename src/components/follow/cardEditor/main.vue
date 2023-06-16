<template>
  <v-card flat  height="400px" class="scroll">
    <v-card-title>
      Catégories
    </v-card-title>
    <v-card-text>
      <FollowLabel v-for="label in labels" :key="label.name" :label="label"/>
    </v-card-text>
    <v-card-title>
      Description
    </v-card-title>
    <v-card-text>
      <div v-html="mdDescription"/>
    </v-card-text>

  </v-card>

</template>

<script src="./script.js"/>
<style src="./style.css"/>