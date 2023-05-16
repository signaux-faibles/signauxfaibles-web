<template>
  <div>
    <!--    <v-container>-->
    <!--      <v-layout>-->
    <!--        <v-flex xs12 md12 style="text-align: center">-->
    <!--          <v-btn-->
    <!--            class="mr-4" color="indigo"-->
    <!--            outlined >-->
    <!--            <v-icon class="mr-2" small>fa-file-excel</v-icon>-->
    <!--            Exporter en XLSX (Excel)-->
    <!--          </v-btn>-->
    <!--        </v-flex>-->
    <!--      </v-layout>-->
    <!--    </v-container>-->
    <Card v-for="card in myCards" @key="card.siret">
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
        <div style="text-align: right" class="mr-4">
          <v-btn color="indigo lighten-1" dark block small style="text-transform: none" class="mb-2" @click="showEtablissement(card.siret)">Fiche Établissement</v-btn>
          <v-btn color="indigo lighten-1" dark block small  style="text-transform: none" @click="showEntreprise(card.siret)">Fiche Entreprise</v-btn>
        </div>
        <div class="mr-4">
          <v-btn rounded @click="showFailed()" dark color="red accent-2">
            Annuler
          </v-btn>
        </div>
        <div class="mr-4">
          <v-btn rounded @click="showSuccess()" dark  color="green">
            J'ai fini
          </v-btn>
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
    <v-dialog width=50% height=50% v-model="dialogSuccess">
      <div style="width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
        <v-toolbar dark color="indigo">
            <v-toolbar-title class="localtoolbar">Terminer la prise en charge</v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-card-text>
              Vous avez réussi à contacter cette entreprise, pouvez vous indiquer les conclusions de cet entretien ?
            <v-radio-group v-model="successRadio">
              <v-radio v-for="option in successLabels"  :label="option.label" :value="option.value"/>
            </v-radio-group>
          </v-card-text>
        </v-card>
      </div>
    </v-dialog>
    <v-dialog width=50% height=50% v-model="dialogFailed">
        <div style="width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
            <v-toolbar dark color="indigo">
                <v-toolbar-title class="localtoolbar">Annuler la prise en charge</v-toolbar-title>
            </v-toolbar>
            <v-card>
                <v-card-text>
                    Vous avez réussi à contacter cette entreprise, pouvez vous indiquer les conclusions de cet entretien ?
                    <v-radio-group v-model="failedRadio">
                        <v-radio v-for="option in failedLabels"  :label="option.label" :value="option.value"/>
                    </v-radio-group>
                </v-card-text>
            </v-card>
        </div>
    </v-dialog>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css"*/>