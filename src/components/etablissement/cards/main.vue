<template>
  <div>
    <FollowCreateCard v-if="codeDepartement" :cards="cards" :codeDepartement="codeDepartement" :siret="siret"/>
    <v-container fluid>
      <v-layout wrap>
        <v-flex md12 v-if="cards.length==0">
          <div v-if="cards.length==0" class="mt-5" style="width: 100%; text-align: center; font-size: 24px">
            À ce jour, aucune fiche de synthèse n'a été rédigée pour cet établissement.
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
            <FollowSummary
              onMouseOver="this.style.cursor='pointer'"
              v-for="card in cards" :key="card.id"
              :card="card"
              :denomination="denomination"
              :siret="siret"
              :codeDepartement="codeDepartement"
            />
            </tbody>
          </table>


          <div v-if="canCreateCard && followed" style="margin-right: auto; margin-left: auto; text-align: center">
            <v-btn v-if="followed && canCreateCard" class="pa-2 mt-5" color="indigo" outlined
                   style="text-transform: none; margin-left: auto; margin-right: auto"
                   @click="showCreateCardDialog()">
              Rédiger une nouvelle fiche de synthèse<br/>
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
          <FollowCardViewer
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