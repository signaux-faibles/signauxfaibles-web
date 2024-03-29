<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <h1>Signalements — Décembre 2023</h1>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text class="text">
          La liste de décembre 2023 est désormais accessible dans l'onglet détection :
          <ul>
            <li>le modèle a évolué pour intégrer les délais fournisseurs dépassant des niveaux jugés critiques</li>
            <li>Il est désormais possible de filtrer les listes pour en exclure les entreprises ayant un délai de paiement accordé par l'URSSAF en cours.</li>
          </ul>
          <p/>
          <h2>Statistiques de la nouvelle liste</h2>
          <v-row>
            <v-col>
              <ul>
                <li>nombre total de signalements : 35294</li>
                <li>nombre de premières alertes : 4641</li>
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

          <h2>Délais URSSAF</h2>
          Le graphique des cotisations et impayés URSSAF intègre désormais une visualisation des délais de paiement en cours en pointillé comme sur l'exemple ci-dessous:
          <div width="100%" class="pt-4 pl-10">
          <img width="400px" src="/delai_urssaf.png"/>
          </div>
          <ul>
            <li>la valeur «délai de paiement accordé» représente le montant total de l'échéancier sur l'ensemble de la durée du délai</li>
            <li>les données sources ont été actualisées pour la production de cette liste, en novembre 2023</li>
            <li>nous vous invitons à nous communiquer les incompréhensions ou problèmes constatés avec cette donnée</li>
          </ul>
          <p/>
          <h2>Mise à jour des données</h2>
          Les données ont été actualisées en novembre 2023 et mises en ligne dans l'applicatif. <br/>
          Voici leur état de fraicheur :
          <ul>
            <li>Données fiscales (DGFiP) : données à septembre 2023, non consultables directement dans l'applicatif.</li>
            <li>Dettes, délais de paiement, cotisations, procédures collectives (URSSAF) : données à octobre 2023.</li>
            <li>Activité partielle (DGEFP) : données à octobre 2023.</li>
            <li>Attitude de paiement (Paydex + FPI) : données à octobre 2023.</li>
            <li>Référentiel des entreprises (Sirene) : données à novembre 2023.</li>
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
