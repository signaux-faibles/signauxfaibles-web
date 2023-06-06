<template>
  <div style="width: 100%" class="mt-8">
    <v-container>
      <v-layout wrap>
        <v-flex md6>
    <!--      <span style="color: #aaa">{{boards}}</span>-->
          <h2>{{ campaign.libelle}}</h2>
          <hr>
        </v-flex>
        <v-flex md6>
          <!--      <span style="color: #aaa">{{boards}}</span>-->
          <h2 style="text-align: right">{{ boards.length }} tableaux concernés</h2>
          <hr>
        </v-flex>
        <v-flex md3 xs12>
          <ul>
            <li>{{ remainingDays }} jours restants</li>
            <li>{{ campaign.nbPerimetre }} établissements</li>
          </ul>
        </v-flex>
        <v-flex md7 xs12>
          <v-chip color="indigo" dark class="ma-2 pa-5" >
            12 en cours
          </v-chip>
          <v-chip color="grey darken-1" dark class="ma-2 pa-5" >
            5 en attente
          </v-chip>
          <v-chip color="red accent-2" dark class="ma-2 pa-5" >
            38 annulés
          </v-chip>
          <v-chip color="green" dark class="ma-2 pa-5" >
            5 effectués
          </v-chip>
        </v-flex>
        <v-flex style="text-align: right" md2 xs12>
          <v-btn class="mt-2 mr-3" dark color="indigo" :to="'/campaigns/'+campaign.id">Entrer</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script src="./script.js"/>
<style src="./style.css"/>