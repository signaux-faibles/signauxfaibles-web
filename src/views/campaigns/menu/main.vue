<template>
    <v-layout column fill-height style="font-weight: normal">
        <v-flex pt-3 shrink text-center>
            <v-btn-toggle v-model="campaignsMenu" mandatory>
                <v-btn text value="pending-cards">À traiter</v-btn>
                <v-btn text value="my-cards">Mes entreprises</v-btn>
                <v-btn text value="all-cards">Toutes les entreprises</v-btn>
            </v-btn-toggle>
        </v-flex>
    </v-layout>
</template>
<script lang="js" src="./script.js"/>
<style scope src="./style.css"/>