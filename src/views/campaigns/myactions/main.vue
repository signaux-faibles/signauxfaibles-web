<template>
  <div v-if="myActions">
    <Card  v-for="etablissement in myActions.etablissements" @key="etablissement.siret">
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
        <div style="text-align: right" class="mr-4">
          <v-btn color="indigo lighten-1" dark block small style="text-transform: none" class="mb-2" @click="showEtablissement(etablissement.siret)">Fiche Établissement</v-btn>
          <v-btn color="indigo lighten-1" dark block small  style="text-transform: none" @click="showEntreprise(etablissement.siret)">Fiche Entreprise</v-btn>
        </div>
        <div class="mr-4">
          <v-btn rounded @click="showCancel(etablissement.id)" dark color="red accent-2">
            Annuler
          </v-btn>
        </div>
        <div class="mr-4">
          <v-btn rounded @click="showSuccess(etablissement.id)" dark  color="green">
            J'ai fini
          </v-btn>
        </div>
      </template>
    </Card>
    <v-dialog fullscreen v-model="etablissementDialog">
        <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
            <v-toolbar fixed class="toolbar" height="35px" style="color: #fff; font-size: 22px; z-index: 50;">
                <v-spacer/>FICHE ETABLISSEMENT<v-spacer/>
                <v-icon @click="hideEtablissement()" style="color: #fff">mdi-close</v-icon>
            </v-toolbar>
            <Etablissement v-if="etablissementDialog" :siret="this.siret"></Etablissement>
        </div>
    </v-dialog>
    <v-dialog fullscreen v-model="entrepriseDialog">
        <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
            <v-toolbar fixed class="toolbar" height="35px" style="color: #fff; font-size: 22px; z-index: 50;">
                <v-spacer />FICHE ENTREPRISE
                <v-spacer />
                <v-icon @click="hideEntreprise()" style="color: #fff">mdi-close</v-icon>
            </v-toolbar>
            <Entreprise v-if="entrepriseDialog" :siren="this.siren"/>
        </div>
    </v-dialog>
    <v-dialog width=50% height=50% v-model="successDialog">
      <div style="width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
        <v-toolbar dark color="indigo">
            <v-toolbar-title class="localtoolbar">Terminer la prise en charge</v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-card-text>
            Vous avez réussi à contacter cette entreprise, pouvez vous indiquer les conclusions de cet entretien ?
            <v-radio-group v-model="successRadio">
              <v-radio v-for="(label, value) in successLabels" :label="label" :value="value"/>
            </v-radio-group>
            <div style="text-align: right">
              <v-btn @click="hideSuccess" color="red accent-2" dark class="mr-4">
                RETOUR
              </v-btn>
              <v-btn @click="success" :color="(successRadio != null)?'indigo':null"
                     :dark="successRadio != null" :disabled="!successRadio">
                VALIDER
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-dialog>
    <v-dialog width=50% height=50% v-model="cancelDialog">
        <div style="width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
            <v-toolbar dark color="indigo">
                <v-toolbar-title class="localtoolbar">Je me désengage</v-toolbar-title>
            </v-toolbar>
            <v-card>
                <v-card-text>
                  Vous ne pensez plus pouvoir contacter cette entreprise, pouvez vous en expliquer la raison ?
                  <v-radio-group v-model="cancelRadio">
                    <v-radio v-for="(label, value) in cancelLabels" :label="label" :value="value"/>
                  </v-radio-group>
                  <div style="text-align: right">
                    <v-btn @click="hideCancel" color="red accent-2" dark class="mr-4">
                      RETOUR
                    </v-btn>
                    <v-btn @click="cancel" :color="(cancelRadio != null)?'indigo':null" :dark="cancelRadio != null" :disabled="!cancelRadio">
                      VALIDER
                    </v-btn>
                  </div>
                </v-card-text>
            </v-card>
        </div>
    </v-dialog>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css"*/>