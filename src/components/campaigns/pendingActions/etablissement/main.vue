<template>
  <Card>
    <template v-slot:entete>
      <div>
        <div v-if="etablissement.followed" class="corner-ribbon"><v-icon style="top: -4px;left: 2px" dark x-small>fa-star</v-icon></div>
        <ScoreWidget :prediction="etablissement" :key="etablissement.id" :tooltip="true"/>
      </div>
    </template>
    <template v-slot:corps>
      <div class="ml-2" id="buttons">
        <v-btn color="indigo" dark block small style="text-transform: none" class="mb-2" @click="dialogs.showEtablissement(etablissement.siret)">Fiche Établissement</v-btn>
        <v-btn color="indigo" dark block small style="text-transform: none" @click="dialogs.showEntreprise(etablissement.siret.slice(0,9))">Fiche Entreprise</v-btn>
      </div>
      <div class="ml-2" style="width: 100%">
          <span class="raison-sociale">
            {{ etablissement.raisonSociale }}
          </span><br/>
        <span>
            {{ etablissement.siret }}
          </span>
      </div>
      <div class="ml-2" id="contact">
        <v-btn
          @click="dialogs.showCardEditor(etablissement.cardID)"
          outlined
        color="indigo"
        class="mr-4">
          <v-icon small color="indigo" class="mr-2">fa-pen</v-icon>
          Je partage des informations
        </v-btn>
      </div>
      <div class="mr-4">
        <v-btn @click="take(etablissement.campaignID, etablissement.id)" dark color="indigo">
          Je prends contact
        </v-btn>
      </div>
    </template>
  </Card>
</template>

<script src="./script.js"/>
<style scoped src="./style.css"/>