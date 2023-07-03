<template>
  <div>
    <CampaignsAppBar :welcome="welcome"/>
    <br/>
    <CampaignsWelcome v-if="welcome"/>
    <div v-if="!welcome">
      <CampaignsMenu/>
      <br/>
      <CampaignsPendingActions v-if="campaigns.menu == 'pendingActions'"/>
      <CampaignsMyActions v-if="campaigns.menu == 'myActions'"/>
      <CampaignsTakenActions v-if="campaigns.menu == 'takenActions'"/>
    </div>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style scoped src="./style.css"/>