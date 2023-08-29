<template>
  <div>
    <v-toolbar color="indigo" dark>
      <v-toolbar-title class="localtoolbar">Attitude de paiement</v-toolbar-title>
      <v-spacer/>
      <Gitbook :target="gitbookPath('PAYDEX')" icon/>
    </v-toolbar>
    <div>
      <v-layout mt-4 style="font-size: 17px" fill-height wrap>
        <v-flex md8 xs12>
          <div style="position: relative; text-align: center; top: 20px;">
            PAYDEX
          </div>
          <apexchart height="300" :options="optionsJoursRetard" :series="seriesJoursRetard" type="line"/>
        </v-flex>
        <v-flex class="align-self-center paydexNote pa-6"
                md4
                xs12
        >
            Les jours de retards sont calculés à partir des dates d'échéance des factures fournisseur.
        </v-flex>
        <v-flex md8 xs12>
          <div style="position: relative; text-align: center; top: 20px;">
            FPI
          </div>
          <apexchart height="300" :options="optionsFPI" :series="seriesFPI" type="bar" width="100%"/>
        </v-flex>
        <v-flex  class="align-self-center paydexNote pa-6" md4 xs12>
          <p>Les indicateurs de fréquence de paiement (FPI, Frequency Paiement Index) vous indiquent la répartition en % des paiements selon le niveau de retard constaté.<br/>
            3 parts sont détaillées:<br/>
            <ul>
              <li>moins de 30 jours de retard (en vert)</li>
              <li>entre 30 et 90 jours (en orange)</li>
              <li>au delà de 90 jours (en rouge)</li>
            </ul>
          </p>
        </v-flex>
      </v-layout>
    </div>
    Source: <a href="https://www.altares.com/fr/nos-data/attitude-de-paiement/">données Paydex et FPI (Altarès)</a>
  </div>
</template>

<script src="./script.js"/>
<style src="./style.css"/>