<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <h1>Signalements — Juin 2024</h1>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text class="text">
          La liste de juin 2024 est désormais accessible dans l'onglet détection :
          <br />
          <br />
          <ul>
            <li>Les détections disponibles dans « Signaux Faibles » sont issues d’un modèle d’apprentissage statistique.</li>
            <li>Le modèle a intégré l’ensemble des données des entreprises depuis mars 2020.</li>
            <li>Il est désormais possible de filtrer les listes pour exclure les entreprises ayant été créées il y a moins de 2 ans. Filtre nommé  « Sans entreprises récentes ».</li>
          </ul>
          <p></p>
          <h2>Statistiques de la nouvelle liste</h2>
          <v-row>
            <v-col>
              <ul>
                <li>nombre total de signalements : 43629</li>
                <li>nombre de premières alertes : 29024</li>
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
          <br />
          <br />
          <h2>Mise à jour des données</h2>
          Les données actualisées jusqu’en avril 2024 sont mobilisées pour cette prédiction.<br/>
          Voici leur état de fraicheur :
          <ul>
            <li>Données fiscales (DGFiP) : données à avril 2024, non consultables directement dans l'applicatif</li>
            <li>Dettes, délais de paiement, cotisations, procédures collectives (URSSAF) : données à avril 2024.</li>
            <li>Activité partielle (DGEFP) : données à avril 2024.</li>
            <li>Attitude de paiement fournisseurs (Paydex + FPI) : données à avril 2024.</li>
            <li>Référentiel des entreprises (Sirene) : données à avril 2024.</li>
            <li>Données financières publiques : mises à jour hebdomadaire depuis l'open data INPI.</li>
          </ul>
          <br />
          <br />
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
        29024,
        14245,
      ],
      options: {
        labels: [
          "premières alertes",
          "alertes renouvelées",
        ],
        colors: [
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
