<template>
    <v-expansion-panel>
      <v-expansion-panel-header ripple>
        <h1>Filtre disponible : "Liste retraitée par la DGFIP"</h1>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card flat>
          <v-card-text class="text">
            Le filtre « Liste retraitée par la DGFIP » est désormais disponible dans "Signaux Faibles" et peut être appliqué à la liste de septembre.<br /><br />
            Ce filtre vous permet d'accéder directement depuis l’application à la liste réceptionnée par chaque CDED en amont des CODEFI. Il a pour objectif de limiter à 200 le nombre d'entreprises suggérées à votre analyse.<br /><br />
            Il agrège les critères suivants :<br />
            <ul>
                <li>Visibilité selon le statut des procédures : In bonis (uniquement)</li>
                <li>Premières alertes</li>
                <li>Sans délai de paiement URSSAF</li>
                <li>Sans entreprises récentes.</li>
            </ul>
            <br />
            Aucun autre filtre présent dans « Signaux Faibles » n’est appliqué : pas de secteur d’activité, de chiffres d’affaires ou d’effectif minimum.
            Suite à l'application de ces filtres, si plus de 200 entreprises ressortent, alors celles avec des ratios financiers dégradés et/ou en alerte modérée sont priorisées par rapport aux autres.<br /><br />
            Dans le cadre de la liste de septembre, seuls les départements 13, 33, 59, 69, 75, 92, 93, 94 et 95 sont concernés par ce retraitement.<br /><br />
            Nous restons à votre entière disposition pour toute demande d’information complémentaire.<br />
            L’équipe « Signaux Faibles »
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
  