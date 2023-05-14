<template>
  <div>
    <Card v-for="card in pendingCards" :key="card.siret">
        <template v-slot:entete>
          <div>
            <ScoreWidget :prediction="prediction(card.siret)" :tooltip="true"/>
          </div>
        </template>
        <template v-slot:corps>
            <div class="ml-4">
                <span class="raison-sociale">
                    {{ card.raison_sociale }}
                </span><br/>
                <span>
                    {{ card.siret }}
                </span>
            </div>
            <div style="text-align: right" class="mr-2">
                <v-btn color="indigo" dark block small style="text-transform: none" class="mb-2" @click="showEtablissement(card.siret)">Fiche Établissement</v-btn>
                <v-btn color="indigo" dark block small  style="text-transform: none" @click="showEntreprise(card.siret)">Fiche Entreprise</v-btn>
            </div>
        </template>
    </Card>
    <v-dialog fullscreen v-model="dialogEtablissement">
        <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
            <v-toolbar fixed class="toolbar" height="35px" style="color: #fff; font-size: 22px; z-index: 50;">
                <v-spacer/>FICHE ETABLISSEMENT<v-spacer/>
                <v-icon @click="hideEtablissement()" style="color: #fff">mdi-close</v-icon>
            </v-toolbar>
            <Etablissement v-if="dialogEtablissement" :siret="this.siret"></Etablissement>
        </div>
    </v-dialog>
    <v-dialog fullscreen v-model="dialogEntreprise">
        <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
            <v-toolbar fixed class="toolbar" height="35px" style="color: #fff; font-size: 22px; z-index: 50;">
                <v-spacer />FICHE ENTREPRISE
                <v-spacer />
                <v-icon @click="hideEntreprise()" style="color: #fff">mdi-close</v-icon>
            </v-toolbar>
            <Entreprise v-if="dialogEntreprise" :siren="this.siren"/>
        </div>
    </v-dialog>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css"/>