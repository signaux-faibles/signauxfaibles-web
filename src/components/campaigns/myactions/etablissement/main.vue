<template>
  <Card>
    <template v-slot:entete>
      <div>
        <ScoreWidget :prediction="etablissement" :tooltip="true"/>
      </div>
    </template>
    <template v-slot:corps>
      <div style="min-width: 180px; max-width: 180px;">
        <div class="ml-2">
          <v-btn block class="mb-2" color="indigo" dark small style="text-transform: none"
                 @click="dialogs.showEtablissement(etablissement.siret)">Fiche Établissement
          </v-btn>
          <v-btn block color="indigo" dark small style="text-transform: none"
                 @click="dialogs.showEntreprise(etablissement.siret.slice(0,9))">Fiche Entreprise
          </v-btn>
        </div>
      </div>
      <div class="ml-2" style="width:100%">
          <span class="raison-sociale">
            {{ etablissement.raisonSociale }}
          </span><br/>
        <span>
            {{ etablissement.siret }}
          </span>
      </div>
      <div id="contact" class="ml-2">
        <v-btn
          class="mr-4"
          color="indigo"
          outlined
          style="text-transform: none"
          @click="showCardEditor">
          <v-icon class="mr-2" color="indigo" small>fa-pen</v-icon>
          <span v-if="etablissement.cardID">
            Informations partagées
          </span>
          <span v-else>
            Je partage mes informations
          </span>
        </v-btn>
      </div>
      <div class="mr-4">
        <v-btn big color="indigo" style="text-transform: none" dark @click="showCancel(etablissement.id)">
          Je ne contacterai pas
        </v-btn>
      </div>
      <div class="mr-4">
        <v-btn color="green darken-2" style="text-transform: none;" dark @click="showSuccess(etablissement.id)">
          J'ai contacté
        </v-btn>
      </div>
      <v-dialog v-model="successDialog" height=50% width=50%>
        <div style="width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
          <v-toolbar color="indigo" dark>
            <v-toolbar-title class="localtoolbar">Valider la prise de contact</v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-card-text>
              Vous avez réussi à contacter cette entreprise, quelle issue se dessine ?
              <v-radio-group v-model="successRadio">
                <v-radio v-for="(label, value) in successLabels" :key="value" :label="label" :value="value"/>
              </v-radio-group>
              <div style="text-align: right">
                <v-btn class="mr-4" color="indigo" outlined dark @click="hideSuccess">
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
            <v-toolbar-title class="localtoolbar">Je ne contacterai pas</v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-card-text>
              <h3>
                Vous ne souhaitez plus contacter cette entreprise, pouvez vous en expliquer la raison ?
              </h3>
              <v-radio-group v-model="cancelRadio">
                <v-radio v-for="(label, value) in cancelLabels" :key="value" :label="label" :value="value"/>
              </v-radio-group>
              <div style="text-align: right">
                <v-btn class="mr-4" outlined color="indigo" @click="hideCancel">
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
    </template>
  </Card>
</template>

<script src="./script.js"/>
<style scoped src="./style.css"/>