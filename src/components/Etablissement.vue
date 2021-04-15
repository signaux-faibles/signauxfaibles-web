<template>
  <div style="background: #fff; font-weight: 800; font-family: 'Oswald', sans;">
    <div>
      <v-container>
        <v-layout wrap style="margin-top: 3em">
          <v-flex xs12 md6 class="pa-3" style="font-size: 18px">
            <Identite
              :denomination="denomination"
              :historique="historique"
              :sirene="sirene"
              :siret="siret"
              :siege="etablissement.siege"
              :groupe="groupe"
              :terrind="terrind"
              :creation="creation"
              :visiteFCE="visiteFCE"
              :statutJuridique="statutJuridique"
            />
            <v-btn v-if="etablissement.siren" dark color="indigo" @click="showEntreprise">Voir Fiche Entreprise</v-btn>
          </v-flex>
          <v-flex xs12 md6 class="text-xs-left pa-3" style="font-size: 18px">
            <div v-if="followCard" class="followCard">
              <h2>Suivi de l'établissement</h2>
              <h3 class="mt-3">Statut du suivi <v-chip class="chip ml-3">{{ this.followCard.status }}</v-chip></h3>
              <div class="description my-3" v-html="followCard.description"></div>
              <v-btn dark color="indigo" :href="followCard.url" target="_blank" rel="noopener" @click="trackMatomoEvent('etablissement', 'voir_carte_suivi', siret)">Voir Carte Suivi</v-btn>
            </div>
            <Map v-else :longitude="sirene.longitude" :latitude="sirene.latitude" ref="map" />
          </v-flex>
          <v-flex xs12 md12 class="text-xs-right pa-3">
            <Commentaire :siret="siret" />
          </v-flex>
          <v-flex md6 xs12 class="pr-1" style="min-height: 200px">
            <Effectif :effectif="effectif" :apconso="apconso" :apdemande="apdemande" :permDGEFP="perms.permDGEFP" />
          </v-flex>
          <v-flex md6 xs12 class="pr-1">
            <Urssaf :debit="debit" :cotisation="cotisation" :permUrssaf="perms.permUrssaf" />
          </v-flex>
          <v-flex xs12 class="pr-1 pt-3">
            <EtablissementEntreprise :siret="siret" :siege="etablissement.siege" :codeDepartement="sirene.codeDepartement" :etablissementsSummary="etablissementsSummary" v-on="$listeners" />
          </v-flex>
          <v-dialog v-model="followDialog" @input="closeFollowDialog()" max-width="500px">
            <v-card>
              <v-card-title>
                <div>
                  <div class="headline">Suivre {{ denomination }} {{ commune }} ?</div>
                  <span class="grey--text">(siret {{ siret }})</span>
                </div>
              </v-card-title>
              <v-card-text>
                Pour quel motif souhaitez-vous suivre cet établissement ?
                <v-radio-group v-model="followCategory" :mandatory="true">
                  <v-radio key="detection" value="detection"><template slot="label"><span class="text-pre-wrap">L'établissement fait partie d'une <strong>liste de détection</strong></span></template></v-radio>
                  <v-radio key="source_externe" value="source_externe"><template slot="label"><span class="text-pre-wrap">J'ai eu connaissance de difficultés par l'<strong>ecosystème local</strong> ou <strong>la presse</strong></span></template></v-radio>
                  <v-radio key="source_interne" value="source_interne"><template slot="label"><span class="text-pre-wrap">J'ai été contacté par l'<strong>entreprise</strong> ou un <strong>partenaire direct</strong>  (expert comptable, client, fournisseur, etc.)</span></template></v-radio>
                  <v-radio key="autre" value="autre"><template slot="label"><span class="text-pre-wrap">Je souhaite suivre cet établissement pour un <strong>autre motif</strong></span></template></v-radio>
                </v-radio-group>
                <v-textarea v-show="followCategory === 'autre'" v-model="followComment" solo placeholder="Résumez en une phrase vos motivations"></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click="closeFollowDialog()">Annuler</v-btn>
                <v-btn dark color="indigo" @click="followEtablissement()"><v-icon left class="mr-2">mdi-star-outline</v-icon>Suivre</v-btn>
              </v-card-actions>
              <v-alert :value="followAlert" type="error" transition="scale-transition">{{ followAlertError }}</v-alert>
            </v-card>
          </v-dialog>
          <v-dialog v-model="cardCreationDialog" persistent @input="closeCardCreationDialog()" max-width="600px">
            <v-card>
              <v-card-title>
                <div>
                  <div class="headline">Créer une carte de suivi ?</div>
                  <span class="grey--text">(siret {{ siret }})</span>
                </div>
              </v-card-title>
              <v-card-text>
                Pour le moment, aucune carte de suivi n’est rattachée à cet établissement.<br>Répondez aux questions suivantes afin d’en créer une.<br><br>
                Quelles sont les difficultés diagnostiquées pour cet établissement ?
                <Help titre="Difficultés diagnostiquées" :big="true">
                  <div v-html="followCardConfig.problemHelpContent" />
                </Help>
                <v-select
                  ref="problems"
                  v-model="problems"
                  :items="followCardConfig.problemItems"
                  :menu-props="{ maxHeight: 400 }"
                  multiple
                  chips
                  :disabled="creatingCard"
                >
                  <template v-slot:append-item>
                    <div class="text-xs-center my-2">
                      <v-btn @click="$refs.problems.isMenuActive = false" color="primary">OK</v-btn>
                    </div>
                  </template>
                </v-select>
                Quelles actions ont déjà été menées ou sont envisagées ?
                <Help titre="Actions menées ou envisagées" :big="true">
                  <div v-html="followCardConfig.actionHelpContent" />
                </Help>
                <v-select
                  ref="actions"
                  v-model="actions"
                  :items="followCardConfig.actionItems"
                  :menu-props="{ maxHeight: 400 }"
                  multiple
                  chips
                  :disabled="creatingCard"
                >
                  <template v-slot:append-item>
                    <div class="text-xs-center my-2">
                      <v-btn @click="$refs.actions.isMenuActive = false" color="primary">OK</v-btn>
                    </div>
                  </template>
                </v-select>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click="closeCardCreationDialog()" :disabled="creatingCard">Passer</v-btn>
                <v-btn dark color="indigo" @click="createNewFollowCard()" :disabled="creatingCard"><v-icon left class="mr-2">mdi-star-outline</v-icon>Créer carte</v-btn>
              </v-card-actions>
              <v-alert :value="cardCreationAlert" type="error" transition="scale-transition">{{ cardCreationAlertError }}</v-alert>
            </v-card>
          </v-dialog>
          <v-dialog v-model="unfollowDialog" @input="closeUnfollowDialog()" max-width="500px">
            <v-card>
              <v-card-title>
                <div>
                  <div class="headline">Ne plus suivre {{ denomination }} {{ commune }} ?</div>
                  <span class="grey--text">(siret {{ siret }})</span>
                </div>
              </v-card-title>
              <v-card-text>
                Des actions ont-elles été menées auprès de cet établissement ?
                <v-radio-group v-model="unfollowCategory" :mandatory="true">
                  <v-radio key="actions" value="actions"><template slot="label"><span class="text-pre-wrap"><strong>OUI</strong>, une ou plusieurs actions</span></template></v-radio>
                  <v-radio key="aucune-action" value="aucune_action"><template slot="label"><span class="text-pre-wrap"><strong>NON</strong>, aucune</span></template></v-radio>
                </v-radio-group>
                <v-textarea v-show="unfollowCategory" v-model="unfollowComment" solo :placeholder="unfollowCommentPlaceholder"></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click="closeUnfollowDialog()">Annuler</v-btn>
                <v-btn dark color="indigo" @click="unfollowEtablissement()">Ne plus suivre</v-btn>
              </v-card-actions>
              <v-alert :value="followAlert" type="error" transition="scale-transition">{{ followAlertError }}</v-alert>
            </v-card>
          </v-dialog>
          <v-dialog lazy fullscreen v-model="entrepriseDialog">
            <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
              <v-toolbar
                fixed
                class="toolbar"
                height="35px"
                style="color: #fff; font-size: 22px; z-index: 50;"
              >
                <v-spacer />FICHE ENTREPRISE
                <v-spacer />
                <v-icon @click="hideEntreprise()" style="color: #fff">mdi-close</v-icon>
              </v-toolbar>
              <Entreprise v-if="entrepriseDialog" :siren="etablissement.siren" v-on="$listeners" />
            </div>
          </v-dialog>
        </v-layout>
        <v-btn v-if="followed === false" fab fixed bottom right dark color="indigo" class="mr-2" @click="followDialog = true"><v-icon>mdi-star-outline</v-icon></v-btn>
        <v-btn v-if="followed === true" fab fixed bottom right outline color="indigo" class="mr-2" @click="unfollowDialog = true"><v-icon>mdi-star</v-icon></v-btn>
      </v-container>
    </div>
  </div>
</template>

<script>
import Effectif from '@/components/Etablissement/Effectif.vue'
import Urssaf from '@/components/Etablissement/Urssaf.vue'
import Help from '@/components/Help.vue'
import Identite from '@/components/Etablissement/Identite.vue'
import Map from '@/components/Etablissement/Map.vue'
import Commentaire from '@/components/Etablissement/Commentaire.vue'
import EtablissementEntreprise from '@/components/Etablissement/Entreprise.vue'
import Entreprise from '@/components/Entreprise.vue'
import axios from 'axios'
import fr from 'apexcharts/dist/locales/fr.json'
import MarkdownIt from 'markdown-it'
import followCardConfig from '@/assets/follow_card_config.json'

export default {
  props: ['siret', 'batch'],
  name: 'Etablissement',
  components: { Effectif, Urssaf, Help, Identite, Map, Commentaire, EtablissementEntreprise, Entreprise },
  data() {
    return {
      axios: axios.create(),
      sirene: {},
      etablissement: {},
      historique: [],
      adresse: '',
      followed: null,
      followDialog: false,
      followCategory: '',
      followComment: '',
      followAlert: false,
      followAlertError: '',
      unfollowDialog: false,
      unfollowCategory: '',
      unfollowComment: '',
      unfollowCommentPlaceholder: '',
      entrepriseDialog: false,
      cardCreationDialog: false,
      statusItems: ['À définir', 'Veille', 'Suivi en cours', 'Suivi terminé'],
      followCardConfig,
      problems: [],
      actions: [],
      cardCreationAlert: false,
      cardCreationAlertError: '',
      followCard: null,
      wekanUser: false,
      effectifClass: [10, 20, 50, 100],
      creatingCard: false,
    }
  },
  methods: {
    getEtablissement() {
      this.$axios.get(`/etablissement/get/${this.siret}`).then((response) => {
        this.etablissement = response.data
        this.historique = (this.etablissement.scores || []).sort((d1, d2) => d1.batch < d2.batch)
        this.sirene = this.etablissement.sirene
        this.followed = this.etablissement.followed
      }).catch((error) => {
        this.etablissement = {}
        this.historique = []
        this.sirene = {}
      })
    },
    isFollowValid() {
      return this.followCategory === 'detection'
        || this.followCategory === 'source_externe'
        || this.followCategory === 'source_interne'
        || (this.followCategory === 'autre' && this.followComment.trim().length > 0)
    },
    followEtablissement() {
      this.trackMatomoEvent('etablissement', 'suivre', this.siret)
      if (this.isFollowValid()) {
        const params = {}
        params.category = this.followCategory
        params.comment = this.followComment
        this.$axios.post(`/follow/${this.siret}`, params).then((response) => {
          if (response.status === 201 || response.status === 204) {
            this.followed = true
            this.followCategory = ''
            this.followComment = ''
            this.followDialog = false
            this.followAlertError = ''
            this.followAlert = false
            this.getEtablissement()
            this.$emit('follow-etablissement')
            if (!this.followCard && this.inZone && this.wekanUser) {
              this.cardCreationDialog = true
            }
          }
        }).catch((error) => {
          this.followAlertError = 'Une erreur est survenue lors du suivi'
          this.followAlert = true
        })
      } else {
        this.followAlertError = 'Un motif de suivi doit être indiqué'
        this.followAlert = true
      }
    },
    isUnfollowValid() {
      return this.unfollowCategory === 'actions'
        || this.unfollowCategory === 'aucune_action'
    },
    unfollowEtablissement() {
      this.trackMatomoEvent('etablissement', 'ne_plus_suivre', this.siret)
      if (this.isUnfollowValid()) {
        const params = {}
        params.unfollowCategory = this.unfollowCategory
        params.unfollowComment = this.unfollowComment
        this.$axios.delete(`/follow/${this.siret}`, { data: params }).then((response) => {
          if (response.status === 200 ) {
            this.followed = false
            this.unfollowCategory = ''
            this.unfollowComment = ''
            this.unfollowDialog = false
            this.followAlertError = ''
            this.followAlert = false
            this.getEtablissement()
            this.$emit('unfollow-etablissement')
          }
        }).catch((error) => {
          this.followAlertError = 'Une erreur est survenue lors du suivi'
          this.followAlert = true
        })
      } else {
        this.followAlertError = 'Veuillez indiquer si des actions ont été menées'
        this.followAlert = true
      }
    },
    getFollowCard() {
      this.$axios.get(`/wekan/cards/${this.siret}`).then((response) => {
        const card = response.data
        const md = new MarkdownIt()
        this.followCard = {
          status: this.statusItems[card.listIndex],
          description: md.render(card.cardDescription),
          url: card.cardURL,
        }
        this.wekanUser = true
      }).catch((error) => {
        if (error.response.status === 404) {
          this.wekanUser = true
        }
        this.followCard = null
      })
    },
    createNewFollowCard() {
      this.trackMatomoEvent('etablissement', 'creer_carte_suivi', this.siret)
      this.creatingCard = true
      const params = {
        description: this.formattedDescription,
      }
      this.$axios.post(`/wekan/cards/${this.siret}`, params).then((response) => {
        this.problems = []
        this.actions = []
        this.cardCreationDialog = false
        this.cardCreationAlertError = ''
        this.cardCreationAlert = false
        this.getFollowCard()
      }).catch((error) => {
        this.cardCreationAlertError = 'Une erreur est survenue lors de la création de la carte de suivi'
        this.cardCreationAlert = true
      }).finally(() => {
        this.creatingCard = false
      })
    },
    closeFollowDialog() {
      this.followCategory = ''
      this.followComment = ''
      this.followDialog = false
      this.followAlertError = ''
      this.followAlert = false
    },
    closeUnfollowDialog() {
      this.unfollowCategory = ''
      this.unfollowComment = ''
      this.unfollowDialog = false
      this.followAlertError = ''
      this.followAlert = false
    },
    closeCardCreationDialog() {
      this.problems = []
      this.actions = []
      this.cardCreationDialog = false
      this.cardCreationAlertError = ''
      this.cardCreationAlert = false
    },
    showEntreprise() {
      this.trackMatomoEvent('entreprise', 'ouvrir_fiche_entreprise', this.etablissement.siren)
      this.entrepriseDialog = true
    },
    hideEntreprise() {
      this.trackMatomoEvent('entreprise', 'fermer_fiche_entreprise', this.etablissement.siren)
      this.entrepriseDialog = false
    },
  },
  created() {
    Apex.chart = {
      locales: [fr],
      defaultLocale: 'fr',
    }
  },
  mounted() {
    this.getEtablissement()
    this.getFollowCard()
  },
  watch: {
    localSiret(val) {
      this.getEtablissement()
    },
    unfollowCategory(val) {
      if (this.unfollowCategory === 'actions') {
        this.unfollowCommentPlaceholder = 'Précisez la nature des actions si nécessaire'
      } else {
        this.unfollowCommentPlaceholder = 'Dites-nous pourquoi ; en particulier, s\'il s\'agissait selon vous d\'une erreur de détection'
      }
    },
  },
  computed: {
    denomination() {
      const entreprise = (this.etablissement || {}).entreprise || {}
      return (entreprise.Sirene || {}).raisonSociale
    },
    naf() {
      return ((this.etablissement || {}).sirene || {}).naf || {}
    },
    localSiret() {
      return this.siret
    },
    apconso() {
      return ((this.etablissement || {}).apConso || []).sort((a1, a2) => (a1.date < a2.date) ? 1 : -1).slice(0, 10)
    },
    apdemande() {
      return ((this.etablissement || {}).apDemande || []).sort((a1, a2) => (a1.debut < a2.debut) ? 1 : -1).slice(0, 10)
    },
    debit() {
      const periodeUrssaf = (this.etablissement || {}).periodeUrssaf || {}
      if (periodeUrssaf.periodes && periodeUrssaf.partPatronale && periodeUrssaf.partSalariale) {
        return periodeUrssaf.periodes.map((p, i) => {
          return {
            part_ouvriere: (periodeUrssaf.partSalariale || {})[i],
            part_patronale: (periodeUrssaf.partPatronale || {})[i],
            periode: p,
          }
        })
      } else {
        return []
      }
    },
    cotisation() {
      const periodeUrssaf = (this.etablissement || {}).periodeUrssaf || {}
      return (periodeUrssaf.cotisation || []).slice(0, 23)
    },
    effectif() {
      const periodeUrssaf = (this.etablissement || {}).periodeUrssaf || {}
      return (periodeUrssaf.periodes || []).map((p, i) => {
        if (periodeUrssaf.effectif[i]) {
          return {
            effectif: periodeUrssaf.effectif[i],
            periode: p,
          }
        } else {
          return null
        }
      }).filter(Boolean)
    },
    zipDianeBDF() {
      const entreprise = (this.etablissement || {}).entreprise || {}
      if (entreprise.bdf || entreprise.diane) {
        const bdf = entreprise.bdf || []
        const diane = entreprise.diane || []
        const annees = [...new Set(bdf.map((b) => b.arrete_bilan_bdf)
          .concat(diane.map((d) => d.arrete_bilan_diane)))].sort((a1, a2) => (a1 > a2) ? 1 : -1)
        return annees.map((a) => {
          return {
            annee: a.slice(0, 10),
            bdf: bdf.filter((b) => b.arrete_bilan_bdf === a)[0] || {},
            diane: diane.filter((d) => d.arrete_bilan_diane === a)[0] || {},
          }
        })
      } else {
        return []
      }
    },
    etablissementsSummary() {
      return (this.etablissement.entreprise || {}).etablissementsSummary || []
    },
    perms() {
      return {
        permDGEFP: (this.etablissement || {}).permDGEFP || false,
        permUrssaf: (this.etablissement || {}).permUrssaf || false,
        permScore: (this.etablissement || {}).permScore || false,
        permBDF: (this.etablissement || {}).permBDF || false,
      }
    },
    groupe() {
      return ((this.etablissement.entreprise || {}).groupe || {}).raison_sociale_groupe
    },
    terrind() {
      return (this.etablissement.territoireIndustrie ||  {}).libelle
    },
    creation() {
      const creation = new Date(((this.etablissement.entreprise || {}).Sirene || {}).creation)
      return (!isNaN(creation.getTime())) ? creation : null
    },
    commune() {
      const summary = this.etablissementsSummary.filter((es) => es.siret === this.siret)[0]
      return (summary || {}).commune || ''
    },
    visiteFCE() {
      return this.etablissement.visiteFCE ||  false
    },
    formattedDescription() {
      let formattedDescription = '**Difficultés :**\n'
      this.problems.forEach((p, i) => {
        formattedDescription += '- ' + p + '\n'
      })
      formattedDescription += '\n'
      formattedDescription += '**Actions :**\n'
      this.actions.forEach((a, i) => {
        formattedDescription += '- ' + a + '\n'
      })
      return formattedDescription
    },
    libelleActivite() {
      return this.naf.libelleActivite
    },
    codeActivite() {
      return this.naf.codeActivite
    },
    activiteField() {
      let activite = ''
      if (this.libelleActivite && this.codeActivite) {
        activite += this.libelleActivite + ' (' + this.codeActivite + ')'
      }
      return activite
    },
    ficheEntrepriseField() {
      return process.env.VUE_APP_WEB_BASE_URL + 'ets/' + this.siret
    },
    username() {
      const username = this.jwt.preferred_username
      return username
    },
    codeDepartement() {
      return this.sirene.codeDepartement
    },
    region() {
      return this.sirene.region
    },
    inZone() {
      return (this.etablissement || {}).inZone || false
    },
    effectifIndex() {
      let effectifIndex = null
      const summary = this.etablissementsSummary.filter((es) => es.siret === this.siret)[0]
      const dernierEffectif = summary.dernier_effectif
      for (let i = this.effectifClass.length - 1; i >= 0; i--) {
        if (dernierEffectif >= this.effectifClass[i]) {
          effectifIndex = i
          break
        }
      }
      return effectifIndex
    },
    statutJuridique() {
      const statutJuridique = ((this.etablissement.entreprise || {}).Sirene || {}).statutJuridiqueN2
      return statutJuridique
    },
  },
}
</script>

<style scoped>
.gray {
  color: #aaa;
}
.down {
  color: rgb(244, 67, 54);
}
::v-deep .followCard .description p {
  margin: 8px 0;
}
</style>