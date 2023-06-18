<template>
  <v-card flat  height="400px" class="scroll" v-if="this.card">
    <v-card-title>
      <div>
        Catégories
      </div>
      <div style="margin-left: auto; margin-right: 0;" text-align="right">
        <v-btn v-if="card.url && !card.archived" :href="card.url" class="px-2 ma-1"
               color="indigo" dark target="blank"
               @click="trackMatomoEvent('general', 'visite_carte', card.title)">
          <v-icon class="mr-2" small>mdi-trello</v-icon>
          Kanban de suivi
        </v-btn>
      </div>
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