<template>
    <v-app-bar app
               class="toolbar elevation-12"
               color="#ffffff"
               extension-height="48px"
               height="35px"
    >
        <v-icon
                v-if="!leftDrawer"
                key="toolbar"
                class="fa-rotate-180"
                color="#ffffff"
                @click="openLeftDrawer()"
        >mdi-backburger
        </v-icon>
        <div
                class="toolbar_titre"
                style="width: 100%; text-align: center;"
        >
            Campagne de ciblage des entreprises
        </div>
        <v-spacer></v-spacer>
        <v-icon
                color="#ffffff"
        >mdi-briefcase-outline
        </v-icon>
    </v-app-bar>
</template>
<script lang="js" src="./script.js"/>