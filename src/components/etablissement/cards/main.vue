<template>
  <div>
    <v-toolbar class="mr-1"
               color='indigo'
               dark>
      <v-toolbar-title class="localtoolbar">
        Accompagnements
      </v-toolbar-title>
    </v-toolbar>
    <FollowCreateCard v-if="codeDepartement" :cards="cards" :codeDepartement="codeDepartement" :siret="siret"/>
    <spinner style="height: 374px" v-if="loading"/>
    <v-container fluid v-if="!loading">
      <v-layout wrap>
        <v-flex md12 v-if="cards.length==0">
          <div v-if="cards.length==0" class="mt-5" style="width: 100%; text-align: center; font-size: 24px">
            À ce jour, aucun accompagnement n'a été entrepris pour cet établissement.
          </div>
        </v-flex>

        <v-flex :md6="cards.length>0" :md12="cards.length==0">
          <table v-if="cards.length>0" class="pr-4">
            <thead>
            <tr>
              <td></td>
              <td>Statut</td>
              <td>Création</td>
              <td>Actualisation</td>
            </tr>
            </thead>
            <tbody>
            <EtablissementCardsSummary
              onMouseOver="this.style.cursor='pointer'"
              v-for="card in cards" :key="card.id"
              :card="card"
              :denomination="denomination"
              :siret="siret"
              :codeDepartement="codeDepartement"
              :currentCardID="currentCard.id"
            />
            </tbody>
          </table>


          <div v-if="canCreateCard && followed" style="margin-right: auto; margin-left: auto; text-align: center">
            <v-btn v-if="followed && canCreateCard" dark class="pa-2 mt-5 mb-4" color="indigo"
                   style="text-transform: none; margin-left: auto; margin-right: auto"
                   @click="dialogs.showCreateCardDialog()">
              <v-icon small class="mr-2">fa-people-pulling</v-icon>
              Accompagner<br/>
            </v-btn>
          </div>
          <div v-if="canCreateCard && !followed">
            Pour créer une fiche, veuillez d'abord placer cet établissement dans vos favoris.
          </div>
          <div v-if="!canCreateCard">
            Il ne vous est pas permis de créer une carte pour cet établissement au regard de vos autorisations.
          </div>
        </v-flex>
        <v-flex md6 xs12 v-if="cards.length>0">
          <EtablissementCardsViewer
            v-if="currentCard"
            :card="currentCard"
            :siret="siret"
            :codeDepartement="codeDepartement"
            :denomination="denomination"/>
        </v-flex>

      </v-layout>
    </v-container>
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