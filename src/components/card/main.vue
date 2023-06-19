<template>
  <div>
    <v-expand-transition>
      <v-card class="etablissement-card elevation-2 ma-2 pointer">
        <div class="entete">
          <slot name="entete"/>
        </div>
        <div class="corps">
          <slot name="corps"/>
        </div>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css"/>