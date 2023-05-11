<template>
  <div>
    <CampaignsAppBar/>
    <CampaignsRightDrawer :campaigns="campaigns"/>
    <br/>
    <CampaignsWelcome v-if="welcome"/>
    <div v-if="!welcome">
      <CampaignsMenu/>
      <br/>
      <CampaignsPendingCards v-if="campaignsMenu == 'pending-cards'"/>
      <CampaignsMyCards v-if="campaignsMenu == 'my-cards'"/>
      <CampaignsAllCards v-if="campaignsMenu == 'all-cards'"/>
    </div>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style scoped src="./style.css"/>