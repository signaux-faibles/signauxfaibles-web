<template>
  <div style="min-heigh: 100%">
    <Spinner style="min-height: 60vh"  v-if="loading"/>
    <CampaignsDepartementFilter v-if="!loading" :etablissements="etablissements" :extras="withdrawEtablissements"/>
    <div id="empty" v-if="selectedEtablissements.length == 0 && !loading">
      Il n'y a aucune entreprise en attente de prise de contact.
    </div>
    <CampaignsPendingActionsEtablissement v-for="etablissement in selectedEtablissements" :key="etablissement.siret" :etablissement="etablissement"/>
    <div class="mt-12 ecart" v-if="selectedWithdrawEtablissements.length > 0">Prises de contact mises à l'écart</div>
    <CampaignsPendingActionsWithdrawEtablissement v-for="etablissement in selectedWithdrawEtablissements" :key="etablissement.siret" :etablissement="etablissement"/>
    <CampaignsPendingActionsWithdrawDialog />
<!--    <v-btn bottom class="mr-2" color="green darken-2" dark fab fixed right-->
<!--           @click="addPendingDialog">-->
<!--      <v-icon style="top:-1px">far fa-plus</v-icon>-->
<!--    </v-btn>-->
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css" scoped/>