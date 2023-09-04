<template>
  <v-container>
    <v-layout column fill-height style="font-weight: normal" wrap>
      <v-flex pt-3 shrink text-center xl12>
        <v-btn-toggle v-model="campaigns.menu" mandatory>
          <v-btn text value="pendingActions">À contacter ({{ campaigns.campaign.nbPending }})</v-btn>
          <v-btn text value="takenActions">Nos prises de contact
            ({{ campaigns.campaign.nbTake + campaigns.campaign.nbDone }})
          </v-btn>
          <v-btn text value="myActions">Mes prises de contact ({{ campaigns.campaign.nbMyActions }})</v-btn>
        </v-btn-toggle>
      </v-flex>
    </v-layout>

  </v-container>
</template>
<script lang="js" src="./script.js"/>
<style scope src="./style.css"/>