<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <h1>Signalements — Septembre 2024</h1>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text class="text">
          La liste de septembre 2024 est désormais accessible dans l'onglet détection :
          <br />
          <br />
          <ul>
            <li>Les détections disponibles dans « Signaux Faibles » sont issues d’un modèle d’apprentissage statistique.</li>
            <li>Le modèle a intégré l’ensemble des données des entreprises depuis mars 2020.</li>
            <li>Le filtre "Liste retraitée par la DGFIP" n'est pas encore fonctionnel. Il sera disponible dans l'application à partir de début octobre. Pour information, pour tous les départements avec moins de 200 détections, vous pouvez vous-même recréer ce filtre en appliquant les conditions suivantes : "In Bonis", “Premières alertes”, “Sans délai de paiement Urssaf” et “Sans entreprises récentes”.</li>
          </ul>
          <p></p>
          <h2>Statistiques de la nouvelle liste</h2>
          <v-row>
            <v-col>
              <ul>
                <li>nombre total de signalements : 44754</li>
                <li>nombre de premières alertes : 15039</li>
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
          Les données actualisées jusqu’au 31 juillet 2024 sont mobilisées pour cette prédiction.<br/>
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
