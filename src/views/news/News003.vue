<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <h1>Publication de signalements — Décembre 2022</h1>
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
          <Gitbook target="f.a.q.#comment-sont-obtenues-les-listes-comment-fonctionne-le-modele-algorithmique"/>
          <p/>
          <h2>Statistiques de la nouvelle liste</h2>
          <ul>
            <li>nombre total de signalements : 31174</li>
            <li>nombre de premières alertes : 15227</li>
            <ul>
            <li>dont 12164 sont signalées uniquement grâce aux nouveaux critères financiers</li>
            </ul>
          </ul>
          <p/>
          Ce dernier point explique notamment la hausse de 3124% des premières alertes par rapport à la publication de septembre 2022.
          <p/>

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
  props: ['activePanel']
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
