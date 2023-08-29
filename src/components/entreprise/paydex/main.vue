<template>
  <div>
    <v-toolbar color="indigo" dark>
      <v-toolbar-title class="localtoolbar">Attitude de paiement</v-toolbar-title>
      <v-spacer/>
      <Gitbook :target="gitbookPath('PAYDEX')" icon/>
    </v-toolbar>
    <div v-if="paydex">
      <v-layout fill-height mt-4 style="font-size: 17px" wrap>
        <v-flex md9 xs12>
          <div style="position: relative; text-align: center; top: 20px;">
            PAYDEX
          </div>
          <apexchart v-if="paydex" :options="optionsJoursRetard" :series="seriesJoursRetard" height="300" type="line"/>
        </V-FLEX>
        <v-flex class="align-self-center paydexNote pa-6"
                md3
                xs12
        >
          Les jours de retards sont calculés à partir des dates d'échéance des factures fournisseur.
        </v-flex>
        <v-flex md9 xs12>
          <div style="position: relative; text-align: center; top: 20px;">
            FPI
          </div>
          <apexchart v-if="paydex" :options="optionsFPI" :series="seriesFPI" height="300" type="bar" width="100%"/>
          <div class="ml-3">
            Source: <a href="https://www.altares.com/fr/nos-data/attitude-de-paiement/">données Paydex et FPI
            (Altarès)</a>
          </div>
        </v-flex>
        <v-flex class="align-self-center paydexNote pa-6" md3 xs12>
          <p>L'indice de fréquence de paiement (Frequency Payment Index, FPI) décrit la répartition
            de l'ensemble des paiements aux fournisseurs selon le niveau de retard constaté.<br/>
            Les 3 classes suivantes sont définies :<br/>
            <ul>
              <li>Paiements ayant moins de 30 jours de retard (en vert).</li>
              <li>Paiements ayant entre 30 et 90 jours de retard (en orange).</li>
              <li>Paiements ayant plus de 90 jours de retard (en rouge).</li>
            </ul>
          </p>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script src="./script.js"/>
<style src="./style.css"/>