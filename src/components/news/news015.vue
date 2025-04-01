<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <h1>Signalements — Mars 2025</h1>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text class="text">
          La liste de mars 2025 est désormais accessible dans l'onglet détection :
          <br />
          <br />
          <ul>
            <li>Les détections disponibles dans « Signaux Faibles » sont issues d’un modèle d’apprentissage statistique.</li>
            <li>Le modèle a intégré l’ensemble des données des entreprises depuis mars 2020.</li>
            <li>Le filtre "Liste retraitée par la DGFIP" sera disponible prochainement. L’activer vous permettra de limiter votre liste à 200 entreprises répondant aux critères suivants : "Premières alertes", "In Bonis", "Sans délai de paiement Urssaf" et "Sans entreprises récentes".</li>
          </ul>
          <p></p>
          <h2>Statistiques de la nouvelle liste</h2>
          <v-row>
            <v-col>
              <ul>
                <li>nombre total de signalements : 69932</li>
                <li>nombre d’alertes après sélection des filtres « In Bonis », « Premières alertes », « Sans délai de paiement Urssaf » et « Sans entreprises récentes » : 13226</li>
              </ul>
            </v-col>
          </v-row>
          <br />
          <br />
          <h2>Mise à jour des données</h2>
          Les données actualisées sont mobilisées pour cette prédiction.<br/>
          Cela concerne nos différentes sources de données :
          <ul>
            <li>Au 1er février 2025 pour les données de dettes sociales (URSSAF)</li>
            <li>Au 1er mars 2025 pour les données de délais fournisseurs (Altares)</li>
            <li>Au 1er janvier 2025 pour les données d'effectifs (URSSAF) et de consommation d’AP (DGEFP)</li>
            <li>Au 1er janvier 2025 pour les données fiscales (DGFiP). Ces données sont non consultables directement dans l'application mais mobilisées par l’algorithme</li>
            <li>Pour les données liées au bilan, seules les données INPI rendues publiques par l'entreprise sont disponibles.</li>
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
