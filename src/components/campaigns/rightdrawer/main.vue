<template>
    <v-navigation-drawer
            v-model="drawers.right"
            :class="((drawers.right)?'elevation-6':'') + ' rightDrawer'"
            app
            right
            transition="no-transition"
    >
        <v-toolbar class="transparent" flat height="40">
            <v-icon :class="loading?'rotate':''" @click="drawers.hideRight()">far fa-briefcase</v-icon>
        </v-toolbar>
    </v-navigation-drawer>
</template>

<script lang="js" src="./script.js"/>