<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <h1>Publication de signalements — Mars 2023</h1>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text class="text">
          La liste de mars 2023 est désormais accessible dans l'onglet détection.
          <h2>Le modèle est identique au modèle de la liste de décembre 2022</h2>
          <ul>
            <li>Les 3 nouveaux critères experts portant sur la santé financière de l'entreprise ont été conservés et apportent de nouveaux signalements à la faveur des nouvelles liasses disponibles.</li>
          </ul>
          <Gitbook target="f.a.q./les-caracteristiques-des-listes"/>
          <p/>
          <h2>Statistiques de la nouvelle liste</h2>
          <v-row>
            <v-col>
              <ul>
                <li>nombre total de signalements : 39597</li>
                <li>nombre de premières alertes : 12608</li>
                <ul>
                <li>Les redressements financiers jouent un rôle dans 5190 d'entre elles.</li>
                </ul>
              </ul>
              <p/>

              <p/>
            </v-col>
            <v-col>
              <apexchart
                  height="300px"
                  type="donut"
                  :options="options"
                  :series="series"
                  :labels="labels"
              ></apexchart>
            </v-col>
          </v-row>


          <h2>Mise à jour des données</h2>
          Les données ont été actualisées en Janvier 2023 et mises en ligne dans l'applicatif. <br/>
          Voici leur état de fraicheur :
          <ul>
            <li>Données fiscales (DGFiP) : données à Décembre 2022, non consultables directement dans l'applicatif.</li>
            <li>Dettes, cotisations, procédures collectives (URSSAF) : données à Décembre 2022.</li>
            <li>Activité partielle (DGEFP) : données à Décembre 2022.</li>
            <li>Comportement de paiement (Paydex) : données à Janvier 2023.</li>
            <li>Référentiel des entreprises (Sirene) : données à Mars 2023.</li>
            <li>Données financières publiques : Mise à jour depuis l'Open Data INPI.</li>
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
        5190,
        7418,
        26989,
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
