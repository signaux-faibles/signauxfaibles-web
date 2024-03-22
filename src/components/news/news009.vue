<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <h1>Signalements — Mars 2024</h1>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text class="text">
          La liste de mars 2024 est désormais accessible dans l'onglet détection :
          <h1>Mise à jour des données</h1>
          Les données ont été actualisées en février 2024 et mises en ligne dans l'applicatif.
          <br />
          <br />
          Voici leur état de fraîcheur :
          <ul>
            <li>Données fiscales (DGFiP) : données à décembre 2023, non consultables directement dans l'applicatif.</li>
            <li>Dettes, délais de paiement, cotisations, procédures collectives (URSSAF) : données à janvier 2024.</li>
            <li>Activité partielle (DGEFP) : données à janvier 2024.</li>
            <li>Attitude de paiement (Paydex + FPI) : données à janvier 2024.</li>
            <li>Référentiel des entreprises (Sirene) : données à février 2024.</li>
            <li>Données financières publiques : mises à jour hebdomadaire depuis l'open data INPI.</li>
          </ul>
          <p/>
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
        4641,
        30653,
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
