<template>
  <div>
    <div id="empty" v-if="etablissements.length == 0 && !loading">
      <v-icon size="70px" color="grey" class="mb-10">fa-snowman</v-icon><br/>
      Vous n'avez aucune prise de contact à réaliser.<br/>
      <div v-if="campaigns.campaign.nbPending > 0">
        Vous pouvez en ajouter en cliquant sur <span class="emph">Je prends contact</span> dans l'onglet <span class="emph">À contacter</span>.
      </div>
    </div>
    <Spinner style="min-height: 60vh" v-if="loading"/>
    <CampaignsDepartementFilter v-if="!loading" :etablissements="etablissements"/>
    <CampaignsEtablissement
      v-for="etablissement in selectedEtablissements"
      :key="etablissement.siret"
      :etablissement="etablissement"
    />
    <v-dialog v-model="withdrawDialog" height=50% width=50%>
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
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css" scoped/>