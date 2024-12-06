<template>
    <v-expansion-panel>
      <v-expansion-panel-header ripple>
        <h1>Nouvelle représentation graphique - 12/2024 </h1>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card flat>
          <v-card-text class="text">
            <p>
                Une nouvelle représentation graphique des motifs de détection est disponible dans les fiches établissement !
            </p>
            <p>
                Pour comprendre comment se construit la probabilité de défaillance d’une entreprise, la nouvelle représentation graphique vous permet désormais de visualiser le poids de chaque groupe de variables dans le calcul de cette probabilité.
            </p>
            <p>
                Dans votre analyse, nous vous invitons à vous appuyer sur l’ensemble des données mises à votre disposition dans l’application, sur le partage d’informations avec les partenaires Signaux Faibles et sur vos réseaux locaux. Dans la répartition de la prise de contact, nous vous invitons à vous inscrire dans l'esprit de la 
                
                <a href="https://www.economie.gouv.fr/files/actes-BOAC/2024-03/ECOE2335742C_0_0.pdf" target="_blank">circulaire ministérielle du 6 mars 2024 relative aux évolutions des modalités d'accompagnement et de soutien des entreprises en difficulté (p.6)</a>.
            </p>

            <ul>
                <li>
                    Pour visualiser cette nouvelle représentation, rendez vous sur la fiche établissement du siège d’une entreprise détectée.
                </li>
                <li>
                    Pour lire cette nouvelle représentation, regardez notre <a href="https://tube.numerique.gouv.fr/w/rhhGiVaQPjkpXVtrWuXX1H" target="_blank">vidéo d'explication</a>.
                </li>
                <li>
                    Pour comprendre le fonctionnement du modèle de détection et les données qui l’alimentent, consultez notre <a href="https://signaux-faibles.gitbook.io/guide-dutilisation-et-f.a.q.-de-signaux-faibles/les-listes-de-detection/analyser-une-entreprise-detectee" target="_blank">guide utilisateur</a>.
                </li>
            </ul>
            <br>
            <p>
                L’équipe « Signaux Faibles »
            </p>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </template>
  
  <script lang="js">
  
  export default {
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
  