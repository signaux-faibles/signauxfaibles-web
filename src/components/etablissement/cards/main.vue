<template>
  <div v-if="etatAdministratif === 'A'">
    <div>
      <v-toolbar class="mr-1"
                 color='indigo'
                 dark>
        <v-toolbar-title class="localtoolbar">
          Accompagnements
        </v-toolbar-title>
      </v-toolbar>
      <spinner style="height: 374px" v-if="loading"/>
      <v-container fluid v-if="!loading">
        <v-layout wrap>
          <v-flex :md12="true">
            <div v-if="canCreateCard && followed" style="margin-right: auto; margin-left: auto; text-align: center">
              <v-btn v-if="followed && canCreateCard" dark class="pa-2 mt-5 mb-4" color="indigo"
                     style="text-transform: none; margin-left: auto; margin-right: auto"
                     @click="redirectToRailsNewTracking">
                <v-icon small class="mr-2">fa-people-pulling</v-icon>
                Gérer les accompagnements<br/>
              </v-btn>
            </div>
            <div v-if="canCreateCard && !followed">
              Pour créer une fiche, veuillez d'abord placer cet établissement dans vos favoris.
            </div>
            <div v-if="!canCreateCard">
              Il ne vous est pas permis de créer une carte pour cet établissement au regard de vos autorisations.
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
  table {
    border-spacing: 0;
    border-style: hidden;
    width: 100%;
  }
  td {
    padding : 10px;
  }
</style>
<script src="./script.js"/>