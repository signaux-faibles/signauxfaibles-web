<template>
  <div>
    <CampaignsAppBar :welcome="welcome"/>
    <CampaignsRightDrawer/>
    <br/>
    <CampaignsWelcome v-if="welcome"/>
    <div v-if="!welcome">
      <CampaignsMenu/>
      <br/>
      <CampaignsPendingCards v-if="campaignsMenu == 'pending-cards'"/>
      <CampaignsMyCards v-if="campaignsMenu == 'my-cards'"/>
      <CampaignsAllCards v-if="campaignsMenu == 'all-cards'" :cards="cards"/>
    </div>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style scoped src="./style.css"/>