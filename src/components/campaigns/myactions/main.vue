<template>
  <div>
    <div id="empty" v-if="myActions.etablissements.length == 0 && !loading">
      <v-icon size="70px" color="grey" class="mb-10">fa-snowman</v-icon><br/>
      Vous n'avez aucune prise de contact à réaliser.<br/>
      <div v-if="campaigns.campaign.nbPending > 0">
        Vous pouvez en ajouter en cliquant sur <span class="emph">Je prends contact</span> dans l'onglet <span class="emph">À contacter</span>.
      </div>
    </div>
    <Spinner style="min-height: 60vh" v-if="loading"/>
    <CampaignsEtablissement
      v-for="etablissement in myActions.etablissements"
      :key="etablissement.siret"
      :etablissement="etablissement"
    />
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css" scoped/>