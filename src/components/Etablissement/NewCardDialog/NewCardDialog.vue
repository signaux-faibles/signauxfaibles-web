<template>
    <v-dialog v-if="kanbanConfig" v-model="createCardDialog" max-width="600px" persistent
              @input="closeCreateCardDialog()">
        <v-toolbar
                color="indigo"
                dark
        >
            <v-btn
                    dark
                    icon
                    @click="closeCreateCardDialog"
            >
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Nouvelle prise en charge</v-toolbar-title>
        </v-toolbar>
        <Step1 v-if="createCardSequence===1" :cards="cards" :codeDepartement="codeDepartement"/>
        <Step2 v-if="createCardSequence===2"/>
        <Step3 v-if="createCardSequence===3"/>
        <Step4 v-if="createCardSequence===4"/>
        <Step5 v-if="createCardSequence===5" :siret="siret"/>
    </v-dialog>
</template>

<script src="./script.js"/>