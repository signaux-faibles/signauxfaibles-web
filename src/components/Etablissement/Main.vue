<template>
  <div style="min-height: 100%; background: #fff; font-weight: 800; font-family: 'Oswald', sans-serif;">
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
              :summary="summary"
            />
            <v-btn v-if="etablissement.siren" dark color="indigo" @click="showEntreprise">Voir Fiche Entreprise</v-btn>
            <v-btn outlined color="indigo" class="ml-4" @click="exportDOCX" :dark="!exportDOCXLoading" :loading="exportDOCXLoading" :disabled="exportDOCXLoading"><v-icon small class="mr-2">fa-file-word</v-icon>Exporter en DOCX (Word)</v-btn>
            <v-alert :value="alertExport" type="error" transition="scale-transition" dismissible>Un problème est survenu lors de l'export de l’établissement.</v-alert>
          </v-flex>
          <v-flex xs12 md6 class="text-left pa-3" style="font-size: 17px">
            <v-layout fill-height align-center>
              <v-flex>
                <v-layout wrap>
                  <v-flex>
                    <Historique v-if="summary" :historique="historique || []" :summary="summary" />
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                    <v-flex xl6 lg12>
                      <h2>
                        Procédure collective
                        <Help titre="Procédure collective">
                          <template>
                            <p>La dernière procédure collective (ou plan issu d'une procédure collective) connue de l'Urssaf est ici mise en avant.<br />
                            Vous avez également la possibilité de consulter l’historique des principaux jugements groupés par type de procédure collective : sauvegarde, redressement, liquidation judiciaire.<br />
                            Pour plus de détails encore, vous serez redirigés vers les annonces publiées au bulletin officiel (BODACC) pour cette entreprise.</p>
                            <p>Veuillez noter que les plans de cession lors d'un redressement judiciaire ne sont pas indiqués.</p>
                          </template>
                        </Help>
                      </h2>
                      <div v-if="summary && summary.etat_procol !== 'in_bonis'">
                        <div>
                          Cet établissement fait l’objet d’une procédure collective :<br/>
                          <v-chip class="my-2 chip" outlined small text-color="red darken-1">{{ libellesProcols[summary.etat_procol] }}</v-chip>
                        </div>
                        <v-btn outlined small dark color="indigo" @click="jugementsDialog = true">Voir historique des jugements</v-btn>
                        <v-dialog v-model="jugementsDialog" @input="jugementsDialog = false" max-width="500px">
                          <div>
                            <v-card>
                              <v-card-title class="headline">
                                Jugements de procédure collective
                              </v-card-title>
                              <v-card-text style="font-size: 17px">
                                <v-expansion-panel v-model="jugementsPanel" expand style="font-weight: 800; font-family: 'Oswald', sans-serif;">
                                  <v-expansion-panel-content v-if="liquidationJugements.length > 0">
                                    <template v-slot:header>
                                      <div>Liquidation</div>
                                    </template>
                                    <v-card>
                                      <v-card-text>
                                        <ul style="list-style-type: disc">
                                          <li v-for="j in liquidationJugements" :key="j">{{ j }}</li>
                                        </ul>
                                      </v-card-text>
                                    </v-card>
                                  </v-expansion-panel-content>
                                  <v-expansion-panel-content v-if="redressementJugements.length > 0">
                                    <template v-slot:header>
                                      <div>Redressement</div>
                                    </template>
                                    <v-card>
                                      <v-card-text>
                                        <ul style="list-style-type: disc">
                                          <li v-for="j in redressementJugements" :key="j">{{ j }}</li>
                                        </ul>
                                      </v-card-text>
                                    </v-card>
                                  </v-expansion-panel-content>
                                  <v-expansion-panel-content v-if="sauvegardeJugements.length > 0">
                                    <template v-slot:header>
                                      <div>Sauvegarde</div>
                                    </template>
                                    <v-card>
                                      <v-card-text>
                                        <ul style="list-style-type: disc">
                                          <li v-for="j in sauvegardeJugements" :key="j">{{ j }}</li>
                                        </ul>
                                      </v-card-text>
                                    </v-card>
                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                                <div class="mt-4" style="font-size: 14px; font-weight: 400; font-family: 'Roboto', sans-serif">
                                  Vous pouvez consulter les annonces publiées au bulletin officiel.
                                  <v-btn class="my-2" small outlined color="indigo" :href="lienBODACC" target="_blank" rel="noopener"><v-icon small left>open_in_new</v-icon>Voir annonces BODACC</v-btn>
                                </div>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="jugementsDialog = false">Fermer</v-btn>
                              </v-card-actions>
                            </v-card>
                          </div>
                        </v-dialog>
                      </div>
                      <div v-else>
                          Cet établissement ne fait, à notre connaissance, pas l’objet d’une procédure collective.
                      </div>
                    </v-flex>
                    <v-flex xl6 lg12 v-if="showFCE">
                      <h2>
                        Visites de la Dreets
                        <Help titre="Visites de la Dreets">
                          <template>
                            Cette information est fournie par <a href="https://fce.fabrique.social.gouv.fr/a-propos" target="_blank" rel="noopener">Fiche Commune Entreprise</a>.<br>
                            Vous pouvez consulter ce service édité par l’incubateur des ministères sociaux pour en savoir davantage sur la date et la nature des visites.<br>
                            Un compte Fiche Commune Entreprise avec une adresse email spécifique est nécessaire.
                          </template>
                        </Help>
                      </h2>
                      <div v-if="visiteFCE">
                        <div class="mb-2">Cet établissement a reçu la visite de la Dreets (ex-Direccte) au cours des 24 derniers mois.</div>
                        <v-btn v-if="showLienVisiteFCE" small outlined color="indigo" :href="lienVisiteFCE" target="_blank" rel="noopener" @click="getLienVisiteFCE()"><v-icon small left>open_in_new</v-icon>Fiche Commune Entreprise</v-btn>
                      </div>
                      <div v-else>
                        <div class="mb-2">Cet établissement n’a pas reçu la visite de la Dreets (ex-Direccte) au cours des 24 derniers mois.</div>
                      </div>
                    </v-flex>
                </v-layout>
                <Cards v-if="wekanUser" :siret="siret" :denomination="denomination" :codeDepartement="sirene.codeDepartement"/>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 md12 class="text-right pa-3">
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
          <FollowDialog/>
          <UnfollowDialog/>
          <v-dialog fullscreen v-model="entrepriseDialog">
            <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans-serif;">
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
        <v-btn v-if="followed === true" fab fixed bottom right outlined color="indigo" class="mr-2" @click="unfollowDialog = true"><v-icon>mdi-star</v-icon></v-btn>
      </v-container>
    </div>
  </div>
</template>

<script>
import Effectif from '@/components/Etablissement/Effectif.vue'
import Urssaf from '@/components/Etablissement/Urssaf.vue'
import Identite from '@/components/Etablissement/Identite.vue'
import Map from '@/components/Etablissement/Map.vue'
import Commentaire from '@/components/Etablissement/Commentaire.vue'
import EtablissementEntreprise from '@/components/Etablissement/Entreprise.vue'
import Entreprise from '@/components/Entreprise.vue'
import Historique from '@/components/Etablissement/Score/Historique.vue'
import axios from 'axios'
import fr from 'apexcharts/dist/locales/fr.json'
import libellesProcols from '@/assets/libelles_procols.json'
import Cards from '@/components/Etablissement/Cards.vue'
import FollowDialog from '@/components/Etablissement/FollowDialog.vue'
import UnfollowDialog from '@/components/Etablissement/UnfollowDialog.vue'
import NewCardDialog from '@/components/Etablissement/NewCardDialog/NewCardDialog.vue'
import Help from '@/components/Help.vue'

export default {
  props: ['siret', 'batch'],
  name: 'Etablissement',
  components: { Effectif, Urssaf, Help, Identite, Map,
    Commentaire, EtablissementEntreprise, Entreprise, Historique,
    Cards, FollowDialog, UnfollowDialog, NewCardDialog },
  data() {
    return {
      axios: axios.create(),
      sirene: {},
      etablissement: {},
      historique: [],
      adresse: '',
      followed: null,
      unfollowDialog: false,
      entrepriseDialog: false,
      followDialog: false,
      newCardDialog: false,
      boards: [],
      effectifClass: [10, 20, 50, 100],
      creatingCard: false,
      jugementsPanel: 0,
      jugementsDialog: false,
      sauvegardeJugements: [],
      redressementJugements: [],
      liquidationJugements: [],
      libellesProcols,
      lienVisiteFCE: '',
      exportDOCXLoading: false,
      alertExport: false,
      joinCardDialog: false,
      joiningCard: false,
      joinCardAlert: false,
      joinCardAlertError: '',
      followSwimlane: '',
    }
  },
  methods: {
    getEtablissement() {
      this.$axios.get(`/etablissement/get/${this.siret}`).then((response) => {
        this.etablissement = response.data
        this.historique = (this.etablissement.scores || []).sort((d1, d2) => d1.batch < d2.batch)
        this.sirene = this.etablissement.sirene
        this.followed = this.etablissement.followed
      }).catch(() => {
        this.etablissement = {}
        this.historique = []
        this.sirene = {}
      }) 
    },
    closeJoinCardDialog() {
      this.joinCardDialog = false
      this.joinCardAlertError = ''
      this.joinCardAlert = false
    },
    showEntreprise() {
      this.trackMatomoEvent('entreprise', 'ouvrir_fiche_entreprise', this.etablissement.siren)
      this.entrepriseDialog = true
    },
    hideEntreprise() {
      this.trackMatomoEvent('entreprise', 'fermer_fiche_entreprise', this.etablissement.siren)
      this.entrepriseDialog = false
    },
    processProcol(p) {
      const date = new Date(p.dateEffet).toLocaleDateString('fr', {timeZone: 'Europe/Paris'})
      let intitule = null
      if (p.action === 'sauvegarde') {
        if (p.stade === 'ouverture') {
          intitule = 'Jugement d\'ouverture d\'une procédure de sauvegarde'
        } else if (p.stade === 'plan_continuation') {
          intitule = 'Jugement arrêtant le plan de sauvegarde'
        }
        if (intitule) {
          const jugement = date + ' : ' + intitule
          this.sauvegardeJugements.push(jugement)
        }
      } else if (p.action === 'redressement') {
        if (p.stade === 'ouverture') {
          intitule = 'Jugement d\'ouverture d\'une procédure de redressement judiciaire'
        } else if (p.stade === 'plan_continuation') {
          intitule = 'Jugement de plan de continuation après un redressement judiciaire'
        }
        if (intitule) {
          const jugement = date + ' : ' + intitule
          this.redressementJugements.push(jugement)
        }
      } else if (p.action === 'liquidation') {
        if (p.stade === 'ouverture') {
          intitule = 'Jugement d\'ouverture de liquidation judiciaire'
        } else if (p.stade === 'cloture_insuffisance_actif') {
          intitule = 'Jugement de clôture pour insuffisance d\'actif'
        }
        if (intitule) {
          const jugement = date + ' : ' + intitule
          this.liquidationJugements.push(jugement)
        }
      }
    },
    getLienVisiteFCE() {
      const lienVisiteFCE = `https://fce.fabrique.social.gouv.fr/establishment/${this.siret}`
      this.$axios.get(`/fce/${this.siret}`).then((response) => {
        this.lienVisiteFCE = response.data || lienVisiteFCE
      }).catch(() => {
        this.lienVisiteFCE = lienVisiteFCE
      })
    },
    download(response) {
      const blob = new Blob([response.data])
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      const filename = response.headers['content-disposition'].split('=')[1]
      link.setAttribute('download', filename)
      link.click()
      link.remove()
    },
    exportDOCX() {
      this.trackMatomoEvent('etablissement', 'extraire', 'docx')
      this.exportDOCXLoading = true
      this.alertExport = false
      this.$axios.get(`/export/docx/siret/${this.siret}`, {responseType: 'blob', timeout: 120000}).then((response) => {
        this.download(response, this.siret)
        this.exportDOCXLoading = false
      }).catch(() => {
        this.exportDOCXLoading = false
        this.alertExport = true
      })
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
    this.getLienVisiteFCE()
  },
  watch: {
    localSiret() {
      this.getEtablissement()
    },
    etablissement(val) {
      if (val.procol) {
        val.procol.concat().sort((p1, p2) => {
          return (p2.dateEffet > p1.dateEffet ? 1 : -1)
        }).forEach((p) => {
          this.processProcol(p)
        })
      }
    },
  },
  computed: {
    currentBoard: {
      get() { return this.$localStore.state.currentBoard },
      set(value) { this.$localStore.commit('setCurrentBoard', value) },
    },
    wekanUser() {
      return this.roles.includes('wekan')
    },
    denomination() {
      const entreprise = (this.etablissement || {}).entreprise || {}
      return (entreprise.Sirene || {}).raisonSociale || ''
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
    etablissementsSummary() {
      return (this.etablissement.entreprise || {}).etablissementsSummary || []
    },
    summary() {
      return this.etablissementsSummary.filter((es) => es.siret === this.siret)[0]
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
      return (this.summary || {}).commune || ''
    },
    visiteFCE() {
      return this.etablissement.visiteFCE ||  false
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
      return this.jwt.preferred_username
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
      return ((this.etablissement.entreprise || {}).Sirene || {}).statutJuridiqueN2
    },
    lienBODACC() {
      return `https://www.bodacc.fr/pages/annonces-commerciales/?disjunctive.typeavis&disjunctive.familleavis&disjunctive.publicationavis&disjunctive.region_min&disjunctive.nom_dep_min&disjunctive.numerodepartement&sort=dateparution&q.registre=registre:${this.etablissement.siren}&refine.familleavis=collective#resultarea`
    },
    showFCE() {
      return process.env.VUE_APP_FCE_ENABLED && !!JSON.parse(process.env.VUE_APP_FCE_ENABLED)
    },
    showLienVisiteFCE() {
      const emailDomain = this.jwt.email.split('@').pop()
      return process.env.VUE_APP_FCE_DOMAIN_LIST.split(',').includes(emailDomain)
    },
  },
}
</script>

<style scoped>
::v-deep .followCard .description p {
  margin: 8px 0;
}
.chip {
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  font-weight: 400;
  vertical-align: text-bottom;
}
</style>