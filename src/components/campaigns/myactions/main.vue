<template>
  <div v-if="myActions">
      <Card v-for="etablissement in myActions.etablissements" :key="etablissement.siret">
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
          <div class="mr-4" style="text-align: center">
            <v-btn text>
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
    <v-dialog v-model="etablissementDialog" fullscreen>
      <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
        <v-toolbar class="toolbar" fixed height="35px" style="color: #fff; font-size: 22px; z-index: 50;">
          <v-spacer/>
          FICHE ETABLISSEMENT
          <v-spacer/>
          <v-icon style="color: #fff" @click="hideEtablissement()">mdi-close</v-icon>
        </v-toolbar>
        <Etablissement v-if="etablissementDialog" :siret="this.siret"></Etablissement>
      </div>
    </v-dialog>
    <v-dialog v-model="entrepriseDialog" fullscreen>
      <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
        <v-toolbar class="toolbar" fixed height="35px" style="color: #fff; font-size: 22px; z-index: 50;">
          <v-spacer/>
          FICHE ENTREPRISE
          <v-spacer/>
          <v-icon style="color: #fff" @click="hideEntreprise()">mdi-close</v-icon>
        </v-toolbar>
        <Entreprise v-if="entrepriseDialog" :siren="this.siren"/>
      </div>
    </v-dialog>
    <v-dialog v-model="successDialog" height=50% width=50%>
      <div style="width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
        <v-toolbar color="indigo" dark>
          <v-toolbar-title class="localtoolbar">Terminer la prise en charge</v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-card-text>
            Vous avez réussi à contacter cette entreprise, pouvez vous indiquer les conclusions de cet entretien ?
            <v-radio-group v-model="successRadio">
              <v-radio v-for="(label, value) in successLabels" :key="value" :label="label" :value="value"/>
            </v-radio-group>
            <div style="text-align: right">
              <v-btn class="mr-4" color="red accent-2" dark @click="hideSuccess">
                RETOUR
              </v-btn>
              <v-btn :color="(successRadio != null)?'indigo':null" :dark="successRadio != null"
                     :disabled="!successRadio" @click="success">
                VALIDER
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-dialog>
    <v-dialog v-model="cancelDialog" height=50% width=50%>
      <div style="width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
        <v-toolbar color="indigo" dark>
          <v-toolbar-title class="localtoolbar">Je me désengage</v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-card-text>
            Vous ne pensez plus pouvoir contacter cette entreprise, pouvez vous en expliquer la raison ?
            <v-radio-group v-model="cancelRadio">
              <v-radio v-for="(label, value) in cancelLabels" :key="value" :label="label" :value="value"/>
            </v-radio-group>
            <div style="text-align: right">
              <v-btn class="mr-4" color="red accent-2" dark @click="hideCancel">
                RETOUR
              </v-btn>
              <v-btn :color="(cancelRadio != null)?'indigo':null" :dark="cancelRadio != null" :disabled="!cancelRadio"
                     @click="cancel">
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
<style * src="./style.css"/>