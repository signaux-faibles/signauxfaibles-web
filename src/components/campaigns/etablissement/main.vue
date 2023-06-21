<template>
  <Card>
    <template v-slot:entete>
      <div>
        <ScoreWidget :prediction="etablissement" :tooltip="true"/>
      </div>
    </template>
    <template v-slot:corps>
      <div class="ml-4">
          <span class="raison-sociale">
            {{ etablissement.raisonSociale }}
          </span><br/>
        <span>
            {{ etablissement.siret }}
          </span>
      </div>
      <div @mouseout="showRaccourci = false" @mouseover="showRaccourci = true">
        <div class="mr-4" style="text-align: center">
          <v-btn text
                 @click="showFollowCardsDialog(etablissement.siret, etablissement.raisonSociale, etablissement.codeDepartement)">
            <v-icon color="indigo" size="40px">fa-handshake</v-icon>
          </v-btn>
        </div>
        <div class="mr-4" style="text-align: right">
          <v-btn block class="mb-2" color="indigo lighten-1" dark small style="text-transform: none"
                 @click="showEtablissement(etablissement.siret)">Fiche Établissement
          </v-btn>
          <v-btn block color="indigo lighten-1" dark small style="text-transform: none"
                 @click="showEntreprise(etablissement.siret)">Fiche Entreprise
          </v-btn>
        </div>
      </div>
      <div class="mr-4">
        <v-btn color="red accent-2" dark rounded @click="showCancel(etablissement.id)">
          Annuler
        </v-btn>
      </div>
      <div class="mr-4">
        <v-btn color="green" dark rounded @click="showSuccess(etablissement.id)">
          J'ai fini
        </v-btn>
      </div>
    </template>
  </Card>
</template>

<script src="./script.js"/>
<style src="./style.css"/>