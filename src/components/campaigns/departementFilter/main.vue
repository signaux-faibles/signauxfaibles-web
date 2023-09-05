<template>
  <div>
    <v-layout column align-center>
      <v-flex xs4 pr-6 shrink text-center>
        <v-select
          v-if="etablissements.length > 0"
          style="width: 400px"
          :items="departements"
          label="département"
          v-model="campaigns.selectedDepartement"
          clearable
          persistent-hint
          dense
          small
          solo
        >
        </v-select>
      </v-flex>
    </v-layout>
  </div>
</template>
<script src="./script.js"/>