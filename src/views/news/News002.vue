<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <h1>Publication de signalements — Septembre 2022</h1>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
          <v-card-text class="text">


              <h2>Mise à jour des redressements experts</h2>
              <ul>
                  <li>Les 3 redressements experts de la liste précédente ont été maintenus et actualisés avec les dernières données disponibles.</li>
                  <li>Le redressement activité partielle a été adapté : les entreprises ayant demandé plus de 8 mois d'activité partielle (hors longue durée) portant sur au moins 50% de leurs effectifs voient leur niveau de risque augmenter.</li>
              </ul>

              <h2>Prise en compte des aggravations via <v-chip class="mb-1 ma-0 mr-1 chip" small color="primary" text-color="white">1re alerte</v-chip></h2>
                  <ul>
                      <li>Désormais ce sigle marque également les entreprises dont l'alerte passe de l'orange au rouge pour la première fois, évoquant une aggravation.</li>
                      <li>Le filtre a été adapté en conséquence.</li>
                  </ul>
              <p/>


              <h2>Mise à jour des données</h2>
                  Les données ont été actualisées en août 2022 et mises en ligne dans l'applicatif. <br/>
                  Voici leur état de fraicheur :
                  <ul>
                      <li>Données fiscales (DGFiP) : données à juin 2022, couverture de 50% des exercices 2021, non consultables directement dans l'applicatif.</li>
                      <li>Dettes, cotisations, procédures collectives (URSSAF) : données à juin 2022.</li>
                      <li>Activité partielle (DGEFP) : données à juillet 2022.</li>
                      <li>Comportement de paiement (Paydex) : données à juillet 2022.</li>
                      <li>Référentiel des entreprises (Sirene) : données à août 2022.</li>
                      <li>Données financières publiques : données jusqu'à l'exercice 2019.</li>
                  </ul>
          </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="js">
export default {
  props: ['activePanel']
}
</script>

<style scoped>
    .text {
        line-height: 1.7;
    }
    .red-darken-4 {
        color: #B71C1C;
    }
    h1 {
        color: #333;
    }
</style>
