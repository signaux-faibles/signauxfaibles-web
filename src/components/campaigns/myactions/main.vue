<template>
  <div v-if="myActions">
    <CampaignsEtablissement
      v-for="etablissement in myActions.etablissements"
      :key="etablissement.siret"
      :etablissement="etablissement"
    />
  </div>
</template>

<script lang="js" src="./script.js"/>
<style src="./style.css" scoped/>