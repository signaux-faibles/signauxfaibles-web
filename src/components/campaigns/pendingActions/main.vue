<template>
  <div style="min-heigh: 100%">
    <div id="empty" v-if="pending.etablissements.length == 0">
      Il n'y a plus d'entreprise en attente dans cette campagne de prise de contact.
    </div>
    <Card v-for="etablissement in pending.etablissements" :key="etablissement.siret">
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
            icon x-large>
            <v-icon color="indigo">fas fa-pen</v-icon>
          </v-btn>
        </div>
        <div class="mr-4" id="contact">
          <v-btn
              @click="dialogs.showCards(etablissement.siret, etablissement.codeDepartement, etablissement.raisonSociale)"
              icon x-large>
            <v-icon x-large color="indigo">far fa-clipboard</v-icon>
          </v-btn>
        </div>
        <div class="mr-4">
          <v-btn @click="take(etablissement.campaignID, etablissement.id)" dark color="indigo">
            Je prends contact
          </v-btn>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css" scoped/>