<template>
    <v-layout column fill-height style="font-weight: normal">
        <v-flex pt-3 shrink text-center>
            <v-btn-toggle v-model="campaigns.menu" mandatory>
                <v-btn text value="pendingActions">À contacter ({{ campaigns.campaign.nbPending }})</v-btn>
                <v-btn text value="takenActions">Contacts en cours ({{ campaigns.campaign.nbTake }})</v-btn>
                <v-btn text value="myActions">Mes prises de contact ({{ campaigns.campaign.nbMyActions }})</v-btn>
            </v-btn-toggle>
        </v-flex>
    </v-layout>
</template>
<script lang="js" src="./script.js"/>
<style scope src="./style.css"/>