<template>
  <Card>
    <template v-slot:entete>
      <div>
        <div v-if="etablissement.followed" class="corner-ribbon">
          <v-icon dark style="top: -4px;left: 2px" x-small>fa-star</v-icon>
        </div>
        <ScoreWidget :key="etablissement.id" :prediction="etablissement" :tooltip="true"/>
      </div>
    </template>
    <template v-slot:corps>
      <div id="buttons" class="ml-2">
        <v-btn block class="mb-2" color="indigo" dark small style="text-transform: none"
               @click="dialogs.showEtablissement(etablissement.siret)">Fiche Établissement
        </v-btn>
        <v-btn block color="indigo" dark small style="text-transform: none"
               @click="dialogs.showEntreprise(etablissement.siret.slice(0,9))">Fiche Entreprise
        </v-btn>
      </div>
      <div class="ml-2" style="width: 100%">
          <span class="raison-sociale">
            {{ etablissement.raisonSociale }}
          </span><br/>
        <span>
            {{ etablissement.siret }}
          </span>
      </div>
      <div class="mr-4">
        <v-chip v-if="etablissement.action=='success'" dark color="indigo">
          {{ successLabels()[etablissement.detail] }}
        </v-chip>
        <v-chip v-if="etablissement.action=='take'" dark color="indigo accent-2">
          en cours
        </v-chip>
      </div>
      <div id="contact" class="ml-2">
        <v-btn
          class="mr-4"
          color="indigo"
          outlined
          style="text-transform: none"
          @click="showCampaignCardEditor">
          <v-icon class="mr-2" color="indigo" small>fa-pen</v-icon>
          <span v-if="etablissement.cardID">
            {{ etablissement.list }}
          </span>
          <span v-else>
            Je partage mes informations
          </span>
        </v-btn>
      </div>
    </template>
  </Card>
</template>

<script src="./script.js"/>
<style scoped src="./style.css"/>