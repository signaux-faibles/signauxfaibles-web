<template>
  <div>
    <v-toolbar color="indigo" dark>
      <v-toolbar-title class="localtoolbar">Attitude de paiement fournisseurs</v-toolbar-title>
      <v-spacer/>
      <Gitbook :target="gitbookPath('PAYDEX')" icon/>
    </v-toolbar>
    <div v-if="!paydex" class="px-12 ma-12" style="text-align: center; font-size: 17px;">
      Les données Paydex et FPI sont indisponibles pour cette entreprise<br/>

      <v-icon size="100" color="#ccc" class="ma-12">fa-low-vision</v-icon><br/>
    </div>
    <div v-if="paydex">
      <v-layout fill-height mt-4 style="font-size: 17px" wrap>
        <v-flex md8 xl9 xs12>
          <div style="position: relative; text-align: center; top: 20px;">
            PAYDEX
          </div>
          <apexchart v-if="paydex" :options="optionsJoursRetard" :series="seriesJoursRetard" height="300" type="line"/>
        </V-FLEX>
        <v-flex class="align-self-center paydexNote pa-6"
                md4
                xl3
                xs12
        >
          Le Paydex mesure le respect des échéances de paiement par pondération de l’encours. Les retards sont calculés
          à partir des dates d'échéance des factures fournisseur.
        </v-flex>
        <v-flex md8 xl9 xs12>
          <div style="position: relative; text-align: center; top: 20px;">
            FPI
          </div>
          <apexchart v-if="paydex" :options="optionsFPI" :series="seriesFPI" height="300" type="bar" width="100%"/>
        </v-flex>
        <v-flex class="align-self-center paydexNote pa-6" md4 xl3 xs12>
          L'indice FPI (Frequency Payment Index) décrit la répartition de l'ensemble des paiements aux fournisseurs,
          selon le niveau de retard constaté.
        </v-flex>
      </v-layout>
          <div class="ml-3" style="font-size: 17px;">
            Les données sont collectées auprès des adhérents du programme
            <a href="https://www.altares.com/fr/nos-data/duntrade/">Duntrade</a> (70% des entreprises de plus de
            10 salariés)<br/>
            Source: <a href="https://www.altares.com/fr/nos-data/attitude-de-paiement/">données Paydex et FPI
            (Altarès)</a>
          </div>
    </div>
  </div>
</template>

<script src="./script.js"/>
<style src="./style.css"/>