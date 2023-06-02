<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <h1>Signalements — Juin 2023</h1>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text class="text">
          La liste de juin 2023 est désormais accessible dans l'onglet détection:
          <h2></H2>
          <ul>
            <li>Le modèle, identique à celui utilisé pour produire la liste de mars 2023, s'appuie sur les dernières données disponibles.</li>
            <li>Les motifs de détection issus des données fiscales confidentielles sont désormais masqués.</li>
            <li>Tous les motifs de détection restent disponibles pour les entreprises ayant déposé publiquement leurs bilans,
              à l’exception de « rentabilité faible » fondé en partie sur les données TVA.</li>
          </ul>
          <Gitbook class="mt-2" :target="gitbookPath('LISTES')"/>
          <p/>
          <h2>Statistiques de la nouvelle liste</h2>
          <v-row>
            <v-col>
              <ul>
                <li>nombre total de signalements : 34214</li>
                <li>nombre de premières alertes : 2967</li>
                <ul>
                  <li>Les redressements financiers jouent un rôle dans 2380 d'entre elles.</li>
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
              ></apexchart>
            </v-col>
          </v-row>


          <h2>Mise à jour des données</h2>
          Les données ont été actualisées en mai 2023 et mises en ligne dans l'applicatif. <br/>
          Voici leur état de fraicheur :
          <ul>
            <li>Données fiscales (DGFiP) : données à mars 2023, non consultables directement dans l'applicatif.</li>
            <li>Dettes, cotisations, procédures collectives (URSSAF) : données à mars 2023.</li>
            <li>Activité partielle (DGEFP) : données à avril 2023.</li>
            <li>Comportement de paiement (Paydex) : données à avril 2023.</li>
            <li>Référentiel des entreprises (Sirene) : données à mai 2023.</li>
            <li>Données financières publiques : mises à jour depuis l'open data INPI.</li>
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
        2380,
        2967,
        34214,
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
