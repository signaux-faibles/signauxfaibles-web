<template>
    <v-navigation-drawer
            v-model="rightDrawer"
            :class="((rightDrawer)?'elevation-6':'') + ' rightDrawer'"
            app
            right
            transition="no-transition"
    >
        <v-toolbar class="transparent" flat height="40">
            <v-icon :class="loading?'rotate':''" @click="closeRightDrawer()">mdi-briefcase-outline</v-icon>

        </v-toolbar>
        <div class="ma-3">
            <v-select :items="campaignsSelectItems" v-model="selectedCampaignID" label="Traitement"></v-select>
        </div>

        <div class="ma-3" v-if="selectedCampaignID">
            <h3>En bref</h3>
            <ul>
                <li>{{ selectedCampaignStatus }}</li>
                <li>échéance: {{ selectedCampaignDueDate }}</li>
                <li>nombre d'entreprises total: {{ selectedCampaignStats.total }} </li>
                <li>traitements non affectés: {{ selectedCampaignStats.blank }} </li>
                <li>traitements en cours: {{ selectedCampaignStats.pending }} </li>
                <li>traitements terminés: {{ selectedCampaignStats.done }} </li>
                <li>traitements rejetés: {{ selectedCampaignStats.done }} </li>
            </ul>
        </div>
        <div class="ma-2" v-if="selectedCampaignID">
            <h3>Objectifs</h3>
            <div v-html="selectedCampaignManifest"/>
        </div>
    </v-navigation-drawer>
</template>

<script lang="js" src="./script.js"/>