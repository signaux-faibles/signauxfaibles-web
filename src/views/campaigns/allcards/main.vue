<template>
  <v-container>

    <v-layout wrap width="100%">
        <v-flex xs12 md12 class="mb-6" style="text-align: center">
            <v-btn
                   class="mr-4" color="indigo"
                   outlined >
                <v-icon class="mr-2" small>fa-file-excel</v-icon>
                Exporter en XLSX (Excel)
            </v-btn>
        </v-flex>

        <v-flex md6 xs12 class="pa-2">
          <v-toolbar dark color='indigo'>
              <v-toolbar-title class="localtoolbar">Prises en charge en cours</v-toolbar-title>
          </v-toolbar>
          <v-data-table
            :headers="wipHeaders"
            :items="wipCards"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
      </v-flex>
      <v-flex md6 xs12 class="pa-2">
          <v-toolbar dark color='grey darken-1'>
              <v-toolbar-title class="localtoolbar">Entreprises en attente</v-toolbar-title>
          </v-toolbar>
          <v-data-table
            :headers="pendingHeaders"
            :items="pendingCards"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
      </v-flex>
      <v-flex md6 xs12 class="pa-2">
          <v-toolbar dark color='red accent-2'>
              <v-toolbar-title class="localtoolbar">Prises en charge annulées</v-toolbar-title>
          </v-toolbar>
          <v-data-table
            :headers="canceledHeaders"
            :items="canceledCards"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
      </v-flex>
      <v-flex md6 xs12 class="pa-2">
          <v-toolbar dark color='green'>
            <v-toolbar-title class="localtoolbar">Prises en charge terminées</v-toolbar-title>
          </v-toolbar>
          <v-data-table
            :headers="doneHeaders"
            :items="doneCards"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css"*/>