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

    </v-navigation-drawer>
</template>

<script lang="js" src="./script.js"/>