<template>
  <div>
    <div id="empty" v-if="myActions.etablissements.length == 0 && !loading">
      Vous n'avez aucune prise de contact en cours dans cette campagne.
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