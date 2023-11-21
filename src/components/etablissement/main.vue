<template>
  <div style="min-height: 100%;  background: #fff">

    <div v-if="loading" style="min-height: 100%; display: flex; justify-content: center; align-items: center;">
      <Spinner v-if="loading" style="min-height: 80vh"/>
    </div>
    <div :class="'maindiv ' + loadingClass"
         style="min-height: 100%; background: #fff; font-weight: 800; font-family: 'Oswald', sans-serif;">
      <v-container>
        <v-layout style="margin-top: 3em" wrap>
          <v-flex class="pa-3" md6 style="font-size: 18px" xs12>
            <Identite
              :creation="creation"
              :denomination="denomination"
              :groupe="groupe"
              :historique="historique"
              :siege="etablissement.siege"
              :sirene="sirene"
              :siret="siret"
              :statutJuridique="statutJuridique"
              :summary="summary"
              :terrind="terrind"
              :visiteFCE="visiteFCE"
            />
            <v-btn v-if="etablissement.siren" color="indigo" dark @click="dialogs.showEntreprise(etablissement.siren)">
              Voir Fiche Entreprise
            </v-btn>
            <v-btn :dark="!exportDOCXLoading" :disabled="exportDOCXLoading" :loading="exportDOCXLoading" class="ml-4"
                   color="indigo"
                   outlined @click="exportDOCX">
              <v-icon class="mr-2" small>fa-file-word</v-icon>
              Exporter en DOCX (Word)
            </v-btn>
            <v-alert :value="alertExport" dismissible transition="scale-transition" type="error">Un problème est survenu
              lors de l'export de l’établissement.
            </v-alert>
          </v-flex>
          <v-flex class="text-left pa-3" md6 style="font-size: 17px" xs12>
            <v-layout align-center fill-height>
              <v-flex>
                <v-layout wrap>
                  <v-flex>
                    <Historique v-if="summary" :historique="historique || []" :summary="summary"/>
                  </v-flex>
                </v-layout>
                <v-layout wrap>
                  <v-flex lg12 xl6>
                    <EtablissementProcols :etablissement="etablissement" :summary="summary"/>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex md12 xs12>
            <EtablissementCards
              v-if="wekanUser"
              :codeDepartement="sirene.codeDepartement"
              :denomination="denomination"
              :siret="siret"
            />
          </v-flex>

          <v-flex class="pr-1" md6 style="min-height: 200px" xs12>
            <Effectif :apconso="apconso" :apdemande="apdemande" :effectif="effectif" :permDGEFP="perms.permDGEFP"/>
          </v-flex>
          <v-flex class="pr-1" md6 xs12>
            <Urssaf :cotisation="cotisation" :delai="delai" :debit="debit" :permUrssaf="perms.permUrssaf"/>
          </v-flex>
          <v-flex class="pr-1 pt-3" xs12>
            <EtablissementEntreprise :codeDepartement="sirene.codeDepartement"
                                     :etablissementsSummary="etablissementsSummary" :siege="etablissement.siege"
                                     :siret="siret" v-on="$listeners"/>
          </v-flex>
          <FollowDialog/>
          <UnfollowDialog/>
        </v-layout>
        <v-btn v-if="followed === false" bottom class="mr-2" color="indigo" dark fab fixed right
               @click="followDialog = true">
          <v-icon style="top:-1px">far fa-star</v-icon>
        </v-btn>
        <v-btn v-if="followed === true" bottom class="mr-2" color="indigo" fab fixed outlined right
               @click="unfollowDialog = true">
          <v-icon small style="top:-1px">far fa-star</v-icon>
        </v-btn>
      </v-container>
    </div>
  </div>
</template>

<script>
import Effectif from '@/components/etablissement/effectif.vue'
import Urssaf from '@/components/etablissement/urssaf.vue'
import Identite from '@/components/etablissement/identite.vue'
import Map from '@/components/etablissement/map.vue'
import EtablissementEntreprise from '@/components/etablissement/entreprise.vue'
import Entreprise from '@/components/entreprise/main.vue'
import Historique from '@/components/etablissement/Score/Historique.vue'
import axios from 'axios'
import fr from 'apexcharts/dist/locales/fr.json'
import EtablissementCards from '@/components/etablissement/cards/main.vue'
import FollowDialog from '@/components/etablissement/followDialog.vue'
import UnfollowDialog from '@/components/etablissement/unfollowDialog.vue'
import CreateCardDialog from '@/components/follow/createcard/main.vue'
import Help from '@/components/Help.vue'
import Spinner from '@/components/Spinner.vue'
import {useDialogsStore} from "@/stores/dialogs";
import EtablissementProcols from "@/components/etablissement/procols.vue";

export default {
  props: ['siret', 'batch'],
  name: 'Etablissement',
  components: {
    EtablissementProcols,
    Effectif, Urssaf, Help, Identite, Map,
    EtablissementEntreprise, Entreprise, Historique,
    EtablissementCards, FollowDialog, UnfollowDialog, CreateCardDialog,
    Spinner
  },
  setup() {
    const dialogs = useDialogsStore()
    return {dialogs}
  },
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
      lienVisiteFCE: '',
      exportDOCXLoading: false,
      alertExport: false,
      joinCardDialog: false,
      joiningCard: false,
      joinCardAlert: false,
      joinCardAlertError: '',
      followSwimlane: '',
      loading: true,
    }
  },
  methods: {
    getEtablissement() {
      this.loading = true
      this.$axios.get(`/etablissement/get/${this.siret}`).then((response) => {
        this.etablissement = {}
        this.historique = []
        this.sirene = {}
        this.etablissement = response.data
        this.historique = (this.etablissement.scores || []).sort((d1, d2) => d1.batch < d2.batch)
        this.sirene = this.etablissement.sirene
        this.followed = this.etablissement.followed
      }).catch(() => {
        this.etablissement = {}
        this.historique = []
        this.sirene = {}
      }).finally(() => {
        this.loading = false
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
    delais(periodeString) {
      const periode = new Date(periodeString)
      return this.delai.filter((delai) => {
        const dateEcheance = new Date(delai.dateEcheance)
        const dateCreation = new Date(delai.dateCreation)
        return periode < dateEcheance && periode > dateCreation
      })
    }
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
  },
  computed: {
    loadingClass() {
      if (this.loading) {
        return "loading"
      }
    },
    currentBoard: {
      get() {
        return this.$localStore.state.currentBoard
      },
      set(value) {
        this.$localStore.commit('setCurrentBoard', value)
      },
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
            delai: this.delais(p).reduce((m, delai) => {return m + delai.montantEcheancier}, 0)
          }
        })
      } else {
        return []
      }
    },
    delai() {
      return this.etablissement.delai
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
      return (this.etablissement.territoireIndustrie || {}).libelle
    },
    creation() {
      const creation = new Date(((this.etablissement.entreprise || {}).Sirene || {}).creation)
      return (!isNaN(creation.getTime())) ? creation : null
    },
    commune() {
      return (this.summary || {}).commune || ''
    },
    visiteFCE() {
      return this.etablissement.visiteFCE || false
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

.maindiv {
  transition: opacity 0.5s;
}

.loading {
  opacity: 0;
}
</style>