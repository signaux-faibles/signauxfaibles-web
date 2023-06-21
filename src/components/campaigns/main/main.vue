<template>
  <div>
    <CampaignsAppBar :welcome="welcome"/>
    <br/>
    <CampaignsWelcome v-if="welcome"/>
    <div v-if="!welcome">
      <CampaignsMenu/>
      <br/>
      <CampaignsPendingCards v-if="campaignsMenu == 'pending-cards'"/>
      <CampaignsMyCards v-if="campaignsMenu == 'my-cards'"/>
      <CampaignsAllCards v-if="campaignsMenu == 'all-cards'"/>
    </div>

    <v-dialog v-model="entrepriseDialog" fullscreen>
      <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
        <v-toolbar class="toolbar" fixed height="35px" style="color: #fff; font-size: 22px; z-index: 50;">
          <v-spacer/>
          FICHE ENTREPRISE
          <v-spacer/>
          <v-icon style="color: #fff" @click="hideEntreprise()">mdi-close</v-icon>
        </v-toolbar>
        <Entreprise v-if="entrepriseDialog" :siren="this.siren"/>
      </div>
    </v-dialog>
  </div>
</template>

<script lang="js" src="./script.js"/>
<style scoped src="./style.css"/>