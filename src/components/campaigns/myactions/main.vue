<template>
  <div>
    <div id="empty" v-if="etablissements.length == 0 && !loading">
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
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css" scoped/>