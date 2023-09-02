<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <h1>Signalements — Septembre 2023</h1>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text class="text">
          La liste de septembre 2023 est désormais accessible dans l'onglet détection :
          <ul>
            <li>Le modèle est identique à celui de juin 2023 avec actualisation des données.</li>
            <li>La couverture des données de retard de paiement est augmentée.</li>
          </ul>
          <p/>
          <h2>Statistiques de la nouvelle liste</h2>
          <v-row>
            <v-col>
              <ul>
                <li>nombre total de signalements : 42165</li>
                <li>nombre de premières alertes : 10456</li>
                <ul>
                  <li>Les redressements financiers jouent un rôle dans 5737 d'entre elles.</li>
                </ul>
              </ul>
              <p/>
            </v-col>
            <v-col>
              <apexchart
                  height="300px"
                  type="donut"
                  :options="options"
                  :series="series"
              ></apexchart>
            </v-col>
          </v-row>

          <h2>Attitude de paiement fournisseurs</h2>
          L'indice de fréquence de paiement (FPI) vient désormais compléter l'indicateur
          Paydex dans la fiche entreprise. Ces données sont disponibles pour 70% des entreprises
          de plus de 10 salariés et vous permettent de consulter :
          <ul>
            <li>le nombre moyen de jours retards constatés sur les paiements fournisseurs (paydex)</li>
            <li>la répartition de ces retards, en terme de nombre de jours (FPI)</li>
          </ul>
          <Gitbook class="mt-2" :target="gitbookPath('PAYDEX')"/>
          <p/>
          <h2>Mise à jour des données</h2>
          Les données ont été actualisées en août 2023 et mises en ligne dans l'applicatif. <br/>
          Voici leur état de fraicheur :
          <ul>
            <li>Données fiscales (DGFiP) : données à juin 2023, non consultables directement dans l'applicatif.</li>
            <li>Dettes, cotisations, procédures collectives (URSSAF) : données à juillet 2023.</li>
            <li>Activité partielle (DGEFP) : données à juillet 2023.</li>
            <li>Attitude de paiement (Paydex + FPI) : données à juillet 2023.</li>
            <li>Référentiel des entreprises (Sirene) : données à août 2023.</li>
            <li>Données financières publiques : mises à jour hebdomadaire depuis l'open data INPI.</li>
          </ul>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="js">
import Gitbook from '@/components/Gitbook.vue'

export default {
  components: {Gitbook},
  props: ['activePanel'],
  data() {
    return {
      series: [
        5737,
        4719,
        31709,
      ],
      options: {
        labels: [
          "premières alertes financières",
          "premières alertes",
          "alertes renouvelées",
        ],
        colors: [
          '#89D685',
          '#1976d2',
          '#ff5252',
        ],
        dataLabels: {
          enabled: false
        }
      },
    }
  }
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
