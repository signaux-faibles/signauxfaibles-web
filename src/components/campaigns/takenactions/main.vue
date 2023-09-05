<template>
  <div>
    <Spinner style="min-height: 60vh" v-if="loading"/>
    <div id="empty" v-if="allActionsPayload.etablissements.length == 0 && !loading">
      <v-icon size="70px" color="grey" class="mb-10">fa-snowman</v-icon><br/>
      Personne n'a encore engagé de prise de contact dans cette campagne.<br/>
      <div v-if="campaigns.campaign.nbPending > 0">
        Pour prendre à votre charge des prises de contact, cliquez sur <span class="emph">Je prends contact</span> dans l'onglet <span class="emph">À contacter</span>.
      </div>
    </div>
    <CampaignsDepartementFilter v-if="!loading" :etablissements="etablissements"/>
    <div v-for="(etablissements, agent) in allActions" :key="agent" >
      <div class="agent">{{ etablissements.length }} prise{{ pluriel(etablissements.length) }} de contact traitée{{ pluriel(etablissements.length) }} par {{ kanban.fullname(agent) }}</div>
      <div v-for="etablissement in etablissements">
        <CampaignsTakenActionsEtablissement :etablissement="etablissement"/>
      </div>
    </div>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style scoped src="./style.css"/>