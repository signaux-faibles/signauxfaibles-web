<template>
    <v-expansion-panel>
      <v-expansion-panel-header ripple>
        <h1>Signalements — Juin 2025</h1>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card flat>
          <v-card-text class="text">
            La liste de juin 2025 est désormais accessible dans l'onglet détection :
            <br />
            <br />
            <ul>
              <li>Les détections disponibles dans "Signaux Faibles" sont issues d'un modèle d'apprentissage statistique.</li>
              <li>Le modèle a intégré l'ensemble des données des entreprises depuis mars 2020.</li>
              <li>Le filtre "Liste retraitée par la DGFIP" sera disponible prochainement. L’activer vous permettra de limiter votre liste à 200 entreprises répondant aux critères suivants : "Premières alertes", "In Bonis", "Sans délai de paiement Urssaf" et "Sans entreprises récentes".</li>
            </ul>
            <p></p>
            <h2>Statistiques de la nouvelle liste</h2>
            <v-row>
              <v-col>
                <ul>
                  <li>nombre total de signalements : 37083</li>
                  <li>nombre d’alertes après sélection des filtres "In Bonis", "Premières alertes", "Sans délai de paiement Urssaf" et "Sans entreprises récentes" : 6243</li>
                  <li>La liste a été réduite de 50 %, afin de gagner en pertinence et de corriger les faux positifs, grâce aux retours sur les précédentes listes.</li>
                </ul>
              </v-col>
            </v-row>
            <br />
            <h2>Mise à jour des données</h2>
            Les données actualisées sont mobilisées pour cette prédiction.<br/>
            Cela concerne nos différentes sources de données :
            <ul>
              <li>Au 1er mai 2025 pour les données de dettes sociales (URSSAF)</li>
              <li>Au 1er juin 2025 pour les données de délais fournisseurs (Altares)</li>
              <li>Au 1er avril 2025 pour les données d'effectifs (URSSAF) et de consommation d'AP (DGEFP)</li>
              <li>Au 1er avril 2025 pour les données fiscales (DGFiP). Ces données sont non consultables directement dans l'application mais mobilisées par l'algorithme</li>
              <li>Pour les données liées au bilan, seules les données INPI rendues publiques par l'entreprise sont disponibles.</li>
            </ul>
            <br />
            <h2>Nouveautés</h2>
            <p>La fonctionnalité "Accompagnements" est disponible :</p>
            <ul>
              <li>Visionnez la <a href="https://signaux-faibles.gitbook.io/guide-dutilisation-et-f.a.q.-de-signaux-faibles/accompagnements/tutoriels-dacces/demonstration-de-lespace-accompagnements" target="_blank">vidéo de démonstration</a> pas à pas, disponible dans le guide utilisateur.</li>
              <li>Consultez le <a href="https://signaux-faibles.gitbook.io/guide-dutilisation-et-f.a.q.-de-signaux-faibles/accompagnements/sommaire" target="_blank">guide utilisateur</a> pour une prise en main facilitée.</li>
            </ul>
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
  