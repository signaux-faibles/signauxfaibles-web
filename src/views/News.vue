<template>
  <v-dialog v-model="dialog" width="800px">
    <template v-slot:activator="{ on }">
      <v-btn
        :class="(newsToRead>0)?'pulse':'inerte'"
        flat
        round
        v-on="on">
        Nouveautés ({{ newsToRead }})
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Journal des changements</span>
        <v-spacer/>
        <v-btn color="primary" text @click="newsread">ok</v-btn>
      </v-card-title>
      <v-card-text>
        <ul>
          <li v-for="n in news" :key="n.date.getTime()">
            <b>{{ n.date.toLocaleDateString() }}:</b>
            <ul>
              <li v-for="l in n.news" :key="l">{{ l }}</li>
            </ul>
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'News',
  methods: {
    newsread() {
      this.dialog = false
      const today = new Date()
      this.newsRead = today
    },
  },
  computed: {
    newsToRead() {
      return this.news.reduce((m, n) => {
        if (n.date.getTime() > this.newsRead.getTime()) {
          m += 1
        }
        return m
      }, 0)
    },
    newsRead: {
      get() {return new Date(this.$localStore.state.newsRead)},
      set(val) {this.$localStore.commit('setNewsRead', val)},
    },
  },
  data() {
    return {
      dialog: false,
      news: [
        {date: new Date('2020-01-21'), news: [
            'Relooking mineur des filtres de la liste de détection',
            'Export excel de la liste affichée',
            'Sélection multiple des secteurs d\'activité dans l\'affichage des listes',
        ]},
        {date: new Date('2020-01-16'), news: [
            'Nouveau filtre rapide pour rechercher une raison sociale ou un siret dans la liste',
            'Ajout de l\' outil fider pour traiter les retours utilisateurs',
        ]},
        {date: new Date('2019-12-20'), news: [
            'Correction coquille chiffre d\'affaire(s)',
            'Correction bug rafraichissement de l\'historique des détections',
        ]},
        {date: new Date('2019-12-13'), news: [
            'Design écran de chargement',
            'Espace commentaire sur la fiche établissement',
            'Ajustement de l\'affichage de l\'historique des détections',
        ]},
        {date: new Date('2019-11-26'), news: [
            'Correction de l\'ordre de l\'historique des détections dans la fiche établissement',
            'Ajoût d\'un bandeau alpha pour les utilisateurs du groupe experimental',
            'Extraction de liste csv pour les utilisateurs du groupe expérimental',
            'Listes de détection sans données urssaf dans les variables explicatives pour le groupe expérimental',
        ]},
        {date: new Date('2019-11-20'), news: [
            'Historique des scores de détection complété dans la fiche établissement',
        ]},
        {date: new Date('2019-11-05'), news: [
            'Correction de l\'ordre d\'affichage des batches',
          ]},
          {date: new Date('2019-10-31'), news: [
            'Publication de la liste d\'Octobre 2019',
          ]},
          {date: new Date('2019-10-23'), news: [
            'Ajoût de la méthode de login délégué dans le composant keycloak',
            'Les utilisateurs de niveau B peuvent voir les listes de détection',
            'Bugfix: suppression de l\'affichage d\' un graphique urssaf vide pour les utilisateurs non habilités',
            'Ajout de l\'écran d\'avertissement sécurité à l\'accès de l\'application',
          ]},
          {date: new Date('2019-10-22'), news: [
            'Bugfix: Firefox ESR 52.0.7 est de nouveau compatible avec l\'application',
            'Bugfix: affichage des effectifs dans Firefox ESR (sans Array.prototype.flatMap)',
            'Bugfix: filtrage des plans de continuation dans la liste',
          ]},
          {date: new Date('2019-10-17'), news: [
            'Optimisation de l\'affichage des longues listes',
          ]},
          {date: new Date('2019-10-11'), news: [
            'Un nouveau composant cartes pour des cartes plus jolies et fonctionnelles',
            'Informations sur la précédente liste de détection dans la fiche établissement',
            'Les adresses sont mieux formatées dans la fiche établissement',
            'Correction: la liste des départements est maintenant complète',
            'Correction: le graphique effectif échoue lorsque le rendu est ralenti',
          ]},
          {date: new Date('2019-10-09'), news: [
            'Amélioration de l\'aide contextuelle effectif et identité de l\'établissement',
            'Amélioration du composant identité de la fiche établissement',
            'Correction de l\'ordre d\'affichage des régions dans le sélecteur du filtre géographique',
            'Ajoût de la part ouvrière des débits dans le graphique urssaf',
            'Intégration de l\'activité partielle dans le graphique des effectifs',
            'Migration de Echarts vers ApexCharts pour la fiche établissement',
          ]},
          {date: new Date('2019-10-07'), news: [
            'Ajoût de l\'information sur les nouveautés',
            'L\'application se souvient des paramètres de filtrage',
            'Refonte des contrôles de filtrage des listes de détection',
            'Gestion des envois manuels partagés/privés',
          ]},
          {date: new Date('2019-10-04'), news: [
            'L\'écran des listes de détection n\'est plus accessible aux agents habilités B',
            'Les données d\'activité partielle ne sont plus disponibles en visualisation pour les entreprises absentes des listes de détection.',
          ]},
      ],
    }
  },
}
</script>

<style scoped>
  .pulse {
    background-color: rgba(255, 255, 255, 0);
    -webkit-animation: blink 800ms infinite;
            animation: blink 800ms infinite;
    height: 24px;
  }
  .inerte {
    height: 24px;
  }
  .purse:hover {
    background-color: rgb(255, 0, 0);
  }
  @-webkit-keyframes blink { 10% { background-color: rgba(255, 0, 43, 0.349); }}
          @keyframes blink { 10% { background-color: rgba(255, 0, 43, 0.349); }}
</style>