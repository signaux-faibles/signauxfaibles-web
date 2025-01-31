<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <h1>Signalements — Janvier 2025</h1>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text class="text">
          La liste de janvier 2025 est désormais accessible dans l'onglet détection :
          <br />
          <br />
          <ul>
            <li>Les détections disponibles dans « Signaux Faibles » sont issues d’un modèle d’apprentissage statistique.</li>
            <li>Le modèle a intégré l’ensemble des données des entreprises depuis mars 2020.</li>
            <li>Le filtre "Liste retraitée par la DGFIP" est également disponible. L’activer vous permettra de limiter votre liste à 200 établissements, en n’ayant plus que les sociétés en « Premières alertes », « In Bonis », « Sans délai de paiement Urssaf » et « Sans entreprises récentes ».</li>
          </ul>
          <p></p>
          <h2>Statistiques de la nouvelle liste</h2>
          <v-row>
            <v-col>
              <ul>
                <li>nombre total de signalements : 51243</li>
                <li>nombre de premières alertes : 14682</li>
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
          Les données actualisées jusqu’au 31 décembre 2024 sont mobilisées pour cette prédiction.<br/>
          Cela concerne nos différentes sources de données :
          <ul>
            <li>Données fiscales (DGFiP). Ces données sont non consultables directement dans l'application mais mobilisées par l’algorithm</li>
            <li>Données URSSAF :  Dettes, délais de paiement, cotisations, procédures collectives</li>
            <li>Données DGEFP : Activité partielle</li>
            <li>Données Altares : Attitude de paiement fournisseurs (Paydex + FPI)</li>
            <li>Données INSEE : Référentiel des entreprises (Sirene)</li>
            <li>Données financières publiques : mises à jour hebdomadaire depuis l'open data INPI</li>
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
        36561,
        14682,
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
