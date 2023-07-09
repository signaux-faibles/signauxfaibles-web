<template>
  <div style="min-heigh: 100%">
    <div id="empty" v-if="pending.etablissements.length == 0 && !loading">
      Il n'y a aucune entreprise en attente de prise de contact.
    </div>
    <Spinner style="min-height: 60vh"  v-if="loading"/>
    <CampaignsPendingActionsEtablissement v-for="etablissement in etablissements()" :key="etablissement.siret" :etablissement="etablissement"/>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css" scoped/>