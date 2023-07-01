<template>
  <div class="ma-8 mt-0">
    <CampaignsHeader v-for="campaign in campaigns.campaigns" :key="campaign.id" :campaign="campaign"/>
  </div>
</template>
<script src="./script.js"/>
<style src="./style.css"/>