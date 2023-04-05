<template>
  <v-dialog v-if="kanbanConfig" v-model="createCardDialog" persistent @input="closeCreateCardDialog()" max-width="600px">
    <v-toolbar
        dark
        color="indigo"
    >
      <v-btn
          icon
          dark
          @click="closeCreateCardDialog"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Créer une carte de suivi</v-toolbar-title>
    </v-toolbar>
    <Step1 v-if="createCardSequence===1" :swimlanes="availableSwimlanes"/>
    <Step2 v-if="createCardSequence===2"/>
    <Step3 v-if="createCardSequence===3"/>
    <Step4 v-if="createCardSequence===4"/>
    <Step5 v-if="createCardSequence===5"/>
  </v-dialog>
</template>

<script src="./script.js"/>