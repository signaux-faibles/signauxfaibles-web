<template>
    <v-app-bar app
               class="toolbar elevation-12"
               color="#ffffff"
               extension-height="48px"
               height="35px"
    >
        <v-icon
                v-if="!drawers.left"
                key="toolbar"
                class="fa-rotate-180"
                color="#ffffff"
                @click="drawers.showLeft()"
        >fa-bars
        </v-icon>
        <div
                class="toolbar_titre"
                style="width: 100%; text-align: center;"
        >
            Campagne de contact des entreprises
        </div>
        <v-spacer></v-spacer>
<!--        <v-icon-->
<!--                color="#ffffff"-->
<!--        >fa-person-hiking-->
<!--        </v-icon>-->
    </v-app-bar>
</template>
<script lang="js" src="./script.js"/>