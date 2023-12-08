<template>
  <v-dialog
    v-model="dialogs.cards"
    width="95vw"
  >
    <v-card>
      <v-toolbar
        dark
        color='indigo'>
        <v-toolbar-title class="localtoolbar">
          Note d'accompagnement – {{dialogs.cardsDenomination}} ({{dialogs.cardsSiret}})
        </v-toolbar-title>
        <v-spacer/>
        <Help titre="Fiches de synthèse">
          <template>
            Les fiches de synthèse vous permettent de partager des informations.<br/>
            Leur visibilité est conditionnée par les permissions de l'application.<br/>
          </template>
        </Help>
      </v-toolbar>
      <v-card-text>
        <FollowCards
          :siret="dialogs.cardsSiret"
          :codeDepartement="dialogs.cardsCodeDepartement"
          :denomination="dialogs.cardsDenomination"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script src="./script.js"/>
