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
            <v-select :items="campaignsSelectItems" v-model="campaignsSelectedID" label="Campagne"></v-select>
        </div>

        <div class="ma-3" v-if="campaignsSelectedID">
            <h3>En bref</h3>
            <ul>
                <li>{{ campaignsSelectedStats.total }} entreprises au total</li>
                <li>{{ campaignsSelectedStats.done }} entreprises déjà traitées</li>
                <li>{{ campaignsSelectedStats.mine }} à votre charge</li>
                <li>{{ campaignsSelectedStats.pending }} en attente</li>
            </ul>
        </div>
        <div class="ma-2" v-if="campaignsSelectedID">
            <Markdown :text="campaignsSelectedManifest"/>
        </div>
    </v-navigation-drawer>
</template>

<script lang="js" src="./script.js"/>