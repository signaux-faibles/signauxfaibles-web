<template>
  <div>
    <Spinner style="min-height: 60vh" v-if="loading"/>

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