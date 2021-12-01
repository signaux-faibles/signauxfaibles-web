<template>
  <v-dialog v-model="dialog" width="800px">
    <template v-slot:activator="{ on }">
      <v-btn
        :class="(newsToRead>0)?'pulse':'inerte'"
        flat
        round
        v-on="on"
        @click="trackMatomoEvent('general', 'ouvrir_nouveautes')"
      >Nouveautés ({{ newsToRead }})</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Journal des changements</span>
        <v-spacer />
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
      get() { return new Date(this.$localStore.state.newsRead) },
      set(val) { this.$localStore.commit('setNewsRead', val) },
    },
  },
  data() {
    return {
      dialog: false,
      news: [
        // TODO: externalize
        {
          date: new Date('2021-12-01'), news: [
            'Exclusion des établissements fermés dans le calcul des effectifs entreprise',
            'Exclusion des établissements fermés dans le calcul des établissements actifs',
            'Ajout du champ procédure collective dans l\'export excel des listes de détection',
            'Transformation du libellé d\'alerte de l\'export excel des listes de détection',
            'Exclusion des établissements fermés dans le total effectif de l\'export excel des listes de détection',
          ],
        },
        { date: new Date('2121-11-15'), news: [
            'Ajout de champs financiers dans l\'export excel des listes de détection',
          ]
        },
        {
          date: new Date('2021-10-15'), news: [
            'Filtrage des listes de détection par chiffre d\'affaires',
            'Filtrage par effectif de l\'entreprise et révision de l\'affichage des informations sociales',
            'Option d\'exclusion des secteurs dits COVID-19 (S1, S1 bis, S2) dans les listes de détection',
            'Dernière mise à jour (décret du 15/09/2021) du périmètre des secteurs S1 et S1 bis',
            'Option pour inclure les établissements fermés sur les listes de détection',
            'Identification des établissements fermés sur liste et fiche établissement',
            'Alerte noire lors de fermeture ou défaillance (redressement ou liquidation judiciaire)',
            'Ajout de l\'Excédent Brut d\'Exploitation sur les listes',
            'Modification des réglages par défaut de la consultation : toute zone géographique et effectif minimum à 0',
          ],
        },
        {
          date: new Date('2021-06-23'), news: [
            'Enrichissement du contenu de l\'export de la liste de suivi au format XLSX (Excel)',
            'Export de la liste de suivi au format DOCX (Word)',
            'Export de la fiche établissement au format DOCX (Word)',
          ],
        },
        {
          date: new Date('2021-06-10'), news: [
            'Explicabilité des détections (données individuelles influentes, radar thématique, historique)',
            'Redressement du niveau d\'alerte a posteriori en fonction de l\'évolution de la dette Urssaf',
            'Recherche avancée des établissements (filtrage par secteur d\'activité, zone géographique et effectif)',
            'Intégration des procédures collectives et de leur historique sur la fiche établissement',
            'Affichage du statut juridique sur les fiches établissement et entreprise',
            'Refonte de l\'entête de la fiche établissement',
            'Amélioration de la réactivité du filtrage des listes de détection',
            'Renvoi vers la fiche entreprise pour les informations financières et le comportement de paiement',
            'Redirection vers la page de connexion en cas de perte de session',
            'Calcul de la capacité d\'autofinancement en valeur absolue pour le graphique des SIG',
            'Mise à jour des données et de la description du plan de relance',
          ],
        },
        {
          date: new Date('2021-04-19'), news: [
            'Mise à jour du périmètre des secteurs S1 et S1 bis',
            'Indication (via une étoile dans l\'angle supérieur gauche) des établissements suivis par l\'utilisateur sur les listes',
            'Expérimentation avec des CRP pilotes d\'un outil de suivi des entreprises en difficultés imbriqué à Signaux Faibles',
          ],
        },
        {
          date: new Date('2021-01-14'), news: [
            'Visites de la Direccte au cours des 24 derniers mois (Fiche Commune Entreprise)',
            'Suggestion d\'appartenance aux secteurs dits COVID-19 (S1, S1 bis, S2)',
            'Comportement de paiement de l\'entreprise vis à vis de ses créanciers',
            'Mise en avant des lauréats du plan de relance',
            'Révision des filtres des listes de détection',
          ],
        },
        {
          date: new Date('2020-12-03'), news: [
            'Nouvelle fiche Entreprise',
            'Matérialisation des périodes de confinement sur les graphiques',
          ],
        },
        {
          date: new Date('2020-11-10'), news: [
            'Revue des autorisations d\'accès',
            'Perfectionnement de la recherche',
            'Export Excel des établissements suivis',
          ],
        },
        {
          date: new Date('2020-10-22'), news: [
            'Bugfix: Inversion des parts de la dette Urssaf',
          ],
        },
        {
          date: new Date('2020-10-21'), news: [
            'Identification des établissements qui apparaissent pour la 1ère fois dans une liste de détection',
            'Révision de la vue synthétique d\'un établissement avec mise en avant des procédures collectives en cours',
            'Possibilité d\'exclure les établissements suivis des listes de détection',
            'Possibilité de n\'afficher que les sièges lors d\'une recherche ou sur une liste de détection',
            'Rattachement des établissements à un Territoire d\'industrie (forte identité et savoir-faire industriel)',
            'Affichage de la date de création de l\'entreprise, de la date d\'ouverture de l\'établissement et de leur ancienneté',
            'Proposition d\'import massif d\'établissements à suivre',
            'Présentation du nouveau modèle de détection',
          ],
        },
        {
          date: new Date('2020-10-12'), news: [
            'Signaux-Faibles version James M. Buchanan',
            'Nouvel algorithme de détection expérimental pour prendre en compte les effets de la crise COVID',
            'Fonctionnalité de suivi d\'entreprise',
            'Consultation des établissements étendue au périmètre entreprise',
            'Ajout des têtes de groupes, de la notion de siège',
            'Navigation entre établissements d\'une même entreprise',
            'Refonte de l\'affichage des données financières',
            'Périmètre des données étendu à toutes les entreprises dont un établissement comporte plus de 10 salariés',
            'Ajouts des données synthétiques dans la consultation d\'établissements',
          ],
        },
        {
          date: new Date('2020-01-21'), news: [
            'Relooking mineur des filtres de la liste de détection',
            'Export excel de la liste affichée',
            'Sélection multiple des secteurs d\'activité dans l\'affichage des listes',
          ],
        },
        {
          date: new Date('2020-01-16'), news: [
            'Nouveau filtre rapide pour rechercher une raison sociale ou un siret dans la liste',
            'Ajout de l\' outil fider pour traiter les retours utilisateurs',
          ],
        },
        {
          date: new Date('2019-12-20'), news: [
            'Correction coquille chiffre d\'affaire(s)',
            'Correction bug rafraichissement de l\'historique des détections',
          ],
        },
        {
          date: new Date('2019-12-13'), news: [
            'Design écran de chargement',
            'Espace commentaire sur la fiche établissement',
            'Ajustement de l\'affichage de l\'historique des détections',
          ],
        },
        {
          date: new Date('2019-11-26'), news: [
            'Correction de l\'ordre de l\'historique des détections dans la fiche établissement',
            'Ajoût d\'un bandeau alpha pour les utilisateurs du groupe experimental',
            'Extraction de liste csv pour les utilisateurs du groupe expérimental',
            'Listes de détection sans données urssaf dans les variables explicatives pour le groupe expérimental',
          ],
        },
        {
          date: new Date('2019-11-20'), news: [
            'Historique des scores de détection complété dans la fiche établissement',
          ],
        },
        {
          date: new Date('2019-11-05'), news: [
            'Correction de l\'ordre d\'affichage des batches',
          ],
        },
        {
          date: new Date('2019-10-31'), news: [
            'Publication de la liste d\'Octobre 2019',
          ],
        },
        {
          date: new Date('2019-10-23'), news: [
            'Ajoût de la méthode de login délégué dans le composant keycloak',
            'Les utilisateurs de niveau B peuvent voir les listes de détection',
            'Bugfix: suppression de l\'affichage d\' un graphique urssaf vide pour les utilisateurs non habilités',
            'Ajout de l\'écran d\'avertissement sécurité à l\'accès de l\'application',
          ],
        },
        {
          date: new Date('2019-10-22'), news: [
            'Bugfix: Firefox ESR 52.0.7 est de nouveau compatible avec l\'application',
            'Bugfix: affichage des effectifs dans Firefox ESR (sans Array.prototype.flatMap)',
            'Bugfix: filtrage des plans de continuation dans la liste',
          ],
        },
        {
          date: new Date('2019-10-17'), news: [
            'Optimisation de l\'affichage des longues listes',
          ],
        },
        {
          date: new Date('2019-10-11'), news: [
            'Un nouveau composant cartes pour des cartes plus jolies et fonctionnelles',
            'Informations sur la précédente liste de détection dans la fiche établissement',
            'Les adresses sont mieux formatées dans la fiche établissement',
            'Correction: la liste des départements est maintenant complète',
            'Correction: le graphique effectif échoue lorsque le rendu est ralenti',
          ],
        },
        {
          date: new Date('2019-10-09'), news: [
            'Amélioration de l\'aide contextuelle effectif et identité de l\'établissement',
            'Amélioration du composant identité de la fiche établissement',
            'Correction de l\'ordre d\'affichage des régions dans le sélecteur du filtre géographique',
            'Ajoût de la part ouvrière des débits dans le graphique urssaf',
            'Intégration de l\'activité partielle dans le graphique des effectifs',
            'Migration de Echarts vers ApexCharts pour la fiche établissement',
          ],
        },
        {
          date: new Date('2019-10-07'), news: [
            'Ajoût de l\'information sur les nouveautés',
            'L\'application se souvient des paramètres de filtrage',
            'Refonte des contrôles de filtrage des listes de détection',
            'Gestion des envois manuels partagés/privés',
          ],
        },
        {
          date: new Date('2019-10-04'), news: [
            'Signaux-Faibles version Maurice Allais',
            'L\'écran des listes de détection n\'est plus accessible aux agents habilités B',
            'Les données d\'activité partielle ne sont plus disponibles en visualisation pour les entreprises absentes des listes de détection.',
          ],
        },
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
@-webkit-keyframes blink {
  10% {
    background-color: rgba(255, 0, 43, 0.349);
  }
}
@keyframes blink {
  10% {
    background-color: rgba(255, 0, 43, 0.349);
  }
}
</style>