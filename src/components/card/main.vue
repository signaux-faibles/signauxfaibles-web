<template>
  <div>
    <v-slide-y-transition>
      <v-card v-show="show" class="etablissement-card elevation-2 ma-2 pointer">
        <div class="entete">
          <slot name="entete"/>
        </div>
        <div class="corps">
          <slot name="corps"/>
        </div>
      </v-card>
    </v-slide-y-transition>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css"/>