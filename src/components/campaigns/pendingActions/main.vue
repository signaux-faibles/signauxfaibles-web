<template>
  <div style="min-heigh: 100%">
    <div id="empty" v-if="pending.etablissements.length == 0">
      Il n'y a plus d'entreprise en attente dans cette campagne de prise de contact.
    </div>
    <CampaignsPendingActionsEtablissement v-for="etablissement in etablissements()" :key="etablissement.siret" :etablissement="etablissement"/>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css" scoped/>