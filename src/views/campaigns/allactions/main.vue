<template>
  <v-container v-if="allActionsPayload">
    <v-layout wrap width="100%">
<!--        <v-flex xs12 md12 class="mb-6" style="text-align: center">-->
<!--            <v-btn-->
<!--                   class="mr-4" color="indigo"-->
<!--                   outlined >-->
<!--                <v-icon class="mr-2" small>fa-file-excel</v-icon>-->
<!--                Exporter en XLSX (Excel)-->
<!--            </v-btn>-->
<!--        </v-flex>-->
<!--        {{ kanbanConfig.boards }}-->
        <v-flex md6 xs12 class="pa-2">
          <v-toolbar dark color='indigo'>
              <v-toolbar-title class="localtoolbar">Prises en charge en cours</v-toolbar-title>
          </v-toolbar>
          <v-data-table
            :headers="takeHeaders"
            :items="allActions.take"
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
            :items="allActions.pending"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
      </v-flex>
      <v-flex md6 xs12 class="pa-2">
          <v-toolbar dark color='red accent-2'>
              <v-toolbar-title class="localtoolbar">Prises en charge annulées</v-toolbar-title>
          </v-toolbar>
          <v-data-table
            :headers="cancelHeaders"
            :items="allActions.cancel"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
      </v-flex>
      <v-flex md6 xs12 class="pa-2">
          <v-toolbar dark color='green'>
            <v-toolbar-title class="localtoolbar">Prises en charge terminées</v-toolbar-title>
          </v-toolbar>
          <v-data-table
            :headers="successHeaders"
            :items="allActions.success"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
      </v-flex>
    </v-layout>
<!--    {{ allActions }}-->
  </v-container>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css"*/>