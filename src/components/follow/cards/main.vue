<template>
  <div>
    <FollowCreateCard v-if="codeDepartement" :cards="cards" :codeDepartement="codeDepartement" :siret="siret"/>
    <v-container>
      <v-layout>
        <v-flex md6>
          <v-simple-table v-if="cards.length>0" class="pr-4">
            <thead>
            <tr>
              <td></td>
              <td>Statut</td>
              <td>Création</td>
              <td>Actualisation</td>
            </tr>
            </thead>
            <tbody>
            <follow-summary v-for="card in cards" :key="card.id" :card="card" :denomination="denomination"/>
            </tbody>
          </v-simple-table>

          <span v-if="cards.length==0">
            À ce jour, aucune fiche d'accompagnement n'a été renseignée pour cet établissement.
          </span>
          <div v-if="canCreateCard && followed" style="margin-right: auto; margin-left: auto; text-align: center">
            <v-btn v-if="followed && canCreateCard" class="pa-2 mt-5" color="indigo" outlined
                   @click="showCreateCardDialog()">
              ajouter une fiche d'accompagnement<br/>
            </v-btn>
          </div>
          <div v-if="canCreateCard && !followed">
            Pour créer une fiche, veuillez d'abord suivre cet établissement.
          </div>
          <div v-if="!canCreateCard">
            Vous avez la possibilité de déclarer une prise en charge.
          </div>
        </v-flex>
        <v-flex md6 xs12>
          <FollowCardViewer v-if="currentCard" :card="currentCard" :denomination="denomination"/>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script src="./script.js"/>
<style src="./style.css"/>