<template>
  <div v-if="myActions">
    <CampaignsEtablissement
      v-for="etablissement in myActions.etablissements"
      :key="etablissement.siret"
      :etablissement="etablissement"
    />
    <FollowCardsDialog
      :codeDepartement="codeDepartement"
      :denomination="denomination"
      :followCardDialog="followCardsDialog"
      :siret="siret"
    />
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
<style src="./style.css"/>