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
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css"/>