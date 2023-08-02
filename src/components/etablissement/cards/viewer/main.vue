<template>
  <v-card v-if="this.card" class="scroll" flat height="350px">
    <div v-if="card.userIsBoardMember">
      <v-card-title>
        <div>
          Étiquettes
          <hr/>
        </div>
        <v-spacer/>
        <v-btn class="px-2 ma-1" color="indigo" outlined
               style="text-transform: none; margin-left: auto; margin-right: auto"
               @click="dialogs.showEtablissementCardEditor(siret, codeDepartement, denomination, card.id, card.description)"
        >
          <v-icon class="mr-2" small>fa-pen-to-square</v-icon>
          Modifier cette fiche
        </v-btn>
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
        <Viewer
          ref="viewer"
          :initialValue="card.description"
          :options="editorOptions"
          initialEditType="wysiwyg"
        />
<!--        <div v-html="mdDescription"/>-->
      </v-card-text>
    </div>
    <div v-else style="text-align: center">
      <v-icon class="ma-8" color="grey lighten-1" size="100px">
        fa-lock
      </v-icon>
      <br/>
      L'accès à cette fiche ne vous est pas permis.<br/>
      Nous vous invitons à vous rapprocher de son rédacteur.

    </div>
    <v-card-actions>
      <div style="margin-left: auto; margin-right: auto;">
        <v-btn
          :href="'mailto:' + card.creator + '?subject=Suivi Signaux Faibles - demande d\'informations sur ' + denomination"
          v-if="!card.userIsBoardMember"
          color="indigo"
          dark
          outlined
          style="text-transform: none; margin-left: auto; margin-right: auto"
          target="_blank"
          @click="trackMatomoEvent('follow', 'contacter_createur', card.creator)"
        >
          <v-icon class="mr-2" small>
            fa-envelope
          </v-icon>
          Contacter le rédacteur de cette fiche
        </v-btn>
        <v-btn v-if="!card.archived && kanban.visibleWekan && card.userIsBoardMember" :href="card.url" class="px-2 ma-1"
               style="text-transform: none; margin-left: auto; margin-right: auto"
               color="indigo" outlined target="blank"
               @click="trackMatomoEvent('general', 'visite_carte', card.title)">
          <v-icon class="mr-2" small>fab fa-trello</v-icon>
          Ouvrir la carte Wekan
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script src="./script.js"/>
<style src="./style.css"/>
