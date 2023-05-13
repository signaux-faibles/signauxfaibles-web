<template>
  <div>
    <v-card class="etablissement-card elevation-2 ma-2 pointer">
      <div class="entete">
        <slot name="entete"/>
      </div>
      <div class="corps">
        <slot name="corps"/>
      </div>
    </v-card>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css"/>