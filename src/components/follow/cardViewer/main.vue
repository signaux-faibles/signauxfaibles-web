<template>
  <v-card v-if="this.card" class="scroll" flat height="350px">
    <v-card-title>
      <v-btn
          :href="'mailto:' + card.creator + '?subject=Suivi Signaux Faibles - demande d\'informations sur ' + denomination"
          color="indigo"
          dark
          outlined
          style="text-transform: none; margin-left: auto; margin-right: auto"
          target="_blank"
          @click="trackMatomoEvent('follow', 'contacter_createur', card.creator)"
      >
        <v-icon small class="mr-2">
          email
        </v-icon>
        Contacter le rédacteur de cette fiche
      </v-btn>
    </v-card-title>
    <div v-if="card.userIsBoardMember">
      <v-card-title>
        <div>
          Étiquettes
          <hr/>
        </div>
        <div style="margin-left: auto; margin-right: 0;" text-align="right">
          <v-btn v-if="card.url && !card.archived" :href="card.url" class="px-2 ma-1"
                 color="indigo" dark target="blank"
                 @click="trackMatomoEvent('general', 'visite_carte', card.title)">
            <v-icon class="mr-2" small>mdi-trello</v-icon>
            carte Kanban
          </v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <FollowLabel v-for="label in labels" :key="label.name" :label="label"/>
        <span v-if="labels.length == 0">
          Cette fiche de suivi ne comporte aucune étiquette
        </span>
      </v-card-text>
      <v-card-title>
        <div>
          Description
          <hr/>
        </div>
      </v-card-title>
      <v-card-text>
        <div v-html="mdDescription"/>
      </v-card-text>
    </div>
    <div v-else style="text-align: center">
      <v-icon color="grey lighten-2" size="100px">
        lock
      </v-icon>
      <br/>
      Vous n'avez pas les permissions adéquates pour accéder au contenu de cette fiche.<br/>
      Pour en savoir plus, nous vous invitons à vous rapprocher de son rédacteur.
    </div>
  </v-card>
</template>

<script src="./script.js"/>
<style src="./style.css"/>