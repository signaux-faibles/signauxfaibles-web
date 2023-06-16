<template>
  <div class="ma-8 mt-0">
<!--    <h1 style="text-align: center">Campagnes ouvertes en ce moment</h1>-->
    <CampaignsHeader v-for="campaign in campaigns" :key="campaign.id" :campaign="campaign"/>
    <div style="width: 50%">
    <editor
      width="50%"
      :options="editorOptions"
      language="fr-FR"
      initialEditType="wysiwyg"
    />
    </div>
  </div>
</template>
<script src="./script.js"/>
<style src="./style.css"/>