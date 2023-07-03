<template>
  <div>
    <v-dialog v-model="followCardsDialog">
      <v-card>
          <v-toolbar
            color="indigo"
            dark
          >
            <v-btn
              dark
              icon
              @click="closeFollowCardsDialog"
            >
              <v-icon>fa-xmark</v-icon>
            </v-btn>
            <v-toolbar-title>Fiches d'accompagnement – {{ denomination }}</v-toolbar-title>
          </v-toolbar>
        <v-card-text>
          <FollowCards
            :codeDepartement="this.codeDepartement"
            :denomination="this.denomination"
            :siret="this.siret"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script src="./script.js"/>