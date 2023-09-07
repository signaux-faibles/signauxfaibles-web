<template>
  <div style="min-heigh: 100%">
    <div id="empty" v-if="pending.etablissements.length == 0 && !loading">
      Il n'y a aucune entreprise en attente de prise de contact.
    </div>
    <Spinner style="min-height: 60vh"  v-if="loading"/>
    <CampaignsDepartementFilter v-if="!loading" :etablissements="etablissements"/>
    <CampaignsPendingActionsEtablissement v-for="etablissement in selectedEtablissements" :key="etablissement.siret" :etablissement="etablissement"/>
    <div class="mt-12 ecart" v-if="selectedWithdrawEtablissements.length > 0">Établissements mis à l'écart</div>
    <CampaignsPendingActionsWithdrawEtablissement v-for="etablissement in selectedWithdrawEtablissements" :key="etablissement.siret" :etablissement="etablissement"/>
    <CampaignsPendingActionsWithdrawDialog />
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css" scoped/>