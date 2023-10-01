<template>
  <div style="width: 100%" class="mt-8">
    <v-container>
      <v-layout wrap>
        <v-flex md12>
    <!--      <span style="color: #aaa">{{boards}}</span>-->
          <h2>{{ campaign.libelle}}</h2>
          <hr>
        </v-flex>

        <v-flex style="vertical-align: center" md4 xs12>
          <ul>
            <li v-if="remainingDays>=0">Se termine le {{dateFin.toISOString().slice(0,10)}} ({{ remainingDays }} jours restants)</li>
            <li v-if="remainingDays<0">Terminée le {{dateFin.toISOString().slice(0,10)}}</li>
            <li>{{ campaign.nbPerimetre }} établissements</li>
          </ul>
        </v-flex>
        <v-flex class="pt-2" md4 xs12>
          <v-chip color="grey darken-3" class="mr-2" outlined>
            {{ campaign.nbPending }} à contacter
          </v-chip>
          <v-chip color="indigo darken-2" class="mr-2" outlined>
            {{ campaign.nbTake }} en cours
          </v-chip>
          <v-chip color="green darken-3" class="mr-2" outlined>
            {{ campaign.nbDone }} contactées
          </v-chip>
        </v-flex>
        <v-flex style="text-align: right; vertical-align: center" md4 xs12>
          <v-btn class="mt-2 mr-3" dark color="indigo" :to="'/campaigns/'+campaign.id">Afficher</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script src="./script.js"/>
<style src="./style.css"/>