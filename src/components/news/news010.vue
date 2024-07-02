<template>
    <v-expansion-panel>
      <v-expansion-panel-header ripple>
        <h1>Nouveau filtre : Liste retraitée par la DGFIP</h1>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card flat>
          <v-card-text class="text">
            Un nouveau filtre est disponible dans « Signaux Faibles » : Liste retraitée par la DGFIP.<br /><br />
            Vous retrouverez, en appliquant ce filtre (case à cocher), la liste de signalements « Signaux
            Faibles » retraitée par la DGFIP et transmise au Secrétaire permanent du CODEFI/CDED en
            amont de la réunion du CODEFI.<br /><br />
            Les objectifs de ce filtre sont de :<br />
            <ul>
                <li>limiter le nombre d’entreprises soumises au CODEFI par le CDED à 200 entreprises</li>
                <li>donner la priorité aux entreprises pour lesquelles une action préventive est encore
                possible - et donc aux entreprises en alerte modérée.</li>
            </ul>
            <br />
                Un premier filtrage de toutes les listes départementales est opéré pour conserver uniquement :
            <ul>
                <li>les premières alertes</li>
                <li>les entreprises in bonis</li>
                <li>les entreprises sans délai de paiement URSSAF</li>
                <li>celles ayant plus de 2 ans d'existence</li>
            </ul>
            <br />
            Ces quatre filtres existent d'ores et déjà dans « Signaux Faibles ».
            Les listes départementales qui présentent plus de 200 entreprises après ce premier filtrage
            se sont vues appliquer différents filtres en priorisant :<br />
            <ul>
                <li>d'abord, les entreprises détectées en raison de ratios financiers dégradés sur lesquelles
                l'intérêt à agir est renforcé</li>
                <li>ensuite, celles signalées en niveau d'alerte modérée (orange)</li>
                <li>enfin, celles signalées en niveau d'alerte élevée (rouge)</li>
            </ul>
            <br />
            Nous restons à votre entière disposition pour toute demande d’information complémentaire.<br />
            L’équipe « Signaux Faibles »
            <br />
            <br />
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
  