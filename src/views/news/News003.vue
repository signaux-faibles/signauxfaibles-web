<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <h1>Signalements — Décembre 2022</h1>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text class="text">
          Signaux Faibles consolide continuellement la production de ses signalements, voici quelques informations pour suivre les dernières évolutions :
          <h2>Ajout de critères experts financiers</h2>
          <ul>
            <li>Les 3 critères experts de la liste précédente ont été maintenus et actualisés avec les dernières données disponibles.</li>
            <li>3 nouveaux critères experts portant sur la santé financière de l'entreprise ont été introduits</li>
          </ul>
          <Gitbook :target="gitbookPath('LISTES')"/>
          <p/>
          <h2>Statistiques de la nouvelle liste</h2>
          <v-row>
            <v-col>
              <ul>
                <li>nombre total de signalements : 31174</li>
                <li>nombre de premières alertes : 15227</li>
                <ul>
                <li>dont 12164 sont signalées uniquement grâce aux nouveaux critères financiers</li>
                </ul>
              </ul>
              <p/>
              La nouveauté de ces critères financiers engendre un grand nombre de nouvelles alertes.
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
          Les données ont été actualisées en octobre 2022 et mises en ligne dans l'applicatif. <br/>
          Voici leur état de fraicheur :
          <ul>
            <li>Données fiscales (DGFiP) : données à août 2022, non consultables directement dans l'applicatif.</li>
            <li>Dettes, cotisations, procédures collectives (URSSAF) : données à septembre 2022.</li>
            <li>Activité partielle (DGEFP) : données à octobre 2022.</li>
            <li>Comportement de paiement (Paydex) : données à octobre 2022.</li>
            <li>Référentiel des entreprises (Sirene) : données à octobre 2022.</li>
            <li>Données financières publiques : données jusqu'à l'exercice 2019.</li>
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
        15227,
        3063,
        15947,
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
