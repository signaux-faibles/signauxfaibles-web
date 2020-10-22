<template>
  <div style="background: #fff">
    <div>
      <v-container>
        <v-layout wrap>
          <v-flex xs12 md6 class="pa-3" style="font-size: 18px; margin-top: 3em;">
            <Identite
              :denomination="denomination"
              :historique="historique"
              :sirene="sirene"
              :siret="siret"
              :siege="etablissement.siege"
              :groupe="groupe"
              :terrind="terrind"
              :creation="creation"
            />
          </v-flex>
          <v-flex xs12 md6 class="text-xs-right pa-3" style="margin-top: 3em">
            <Map :longitude="sirene.longitude" :latitude="sirene.latitude" ref="map" />
          </v-flex>
          <v-flex xs12 md12 class="text-xs-right pa-3">
            <Commentaire :siret="siret" />
          </v-flex>
          <v-flex md6 xs12 class="pr-1" style="min-height: 200px">
            <Effectif :effectif="effectif" :apconso="apconso" :apdemande="apdemande" />
          </v-flex>
          <v-flex md6 xs12 class="pr-1">
            <Urssaf :debit="debit" :cotisation="cotisation" />
          </v-flex>
          <v-flex xs12 class="pr-1">
            <Finance :finance="finance" :siret="siret" />
          </v-flex>
          <v-flex xs12 class="pr-1 pt-3">
            <Entreprise :siret="siret" :siege="etablissement.siege" :groupe="groupe" :codeDepartement="sirene.codeDepartement" :etablissementsSummary="etablissementsSummary" v-on="$listeners" />
          </v-flex>
          <v-dialog v-model="followDialog" @input="closeFollowDialog()" max-width="500px">
            <v-card>
              <v-card-title>
                <div>
                  <div class="headline">Suivre {{ denomination }} ?</div>
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
                <v-btn dark color="indigo darken-5" @click="followEtablissement()"><v-icon left class="mr-2">mdi-star-outline</v-icon>Suivre</v-btn>
              </v-card-actions>
              <v-alert :value="followAlert" type="error" transition="scale-transition">{{ followAlertError }}</v-alert>
            </v-card>
          </v-dialog>
          <v-dialog v-model="unfollowDialog" @input="closeUnfollowDialog()" max-width="500px">
            <v-card>
              <v-card-title>
                <div>
                  <div class="headline">Ne plus suivre {{ denomination }} ?</div>
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
                <v-btn dark color="indigo darken-5" @click="unfollowEtablissement()">Ne plus suivre</v-btn>
              </v-card-actions>
              <v-alert :value="followAlert" type="error" transition="scale-transition">{{ followAlertError }}</v-alert>
            </v-card>
          </v-dialog>
        </v-layout>
        <v-btn v-if="followed === false" fab fixed bottom right dark color="indigo darken-5" class="mr-2" @click="followDialog = true"><v-icon>mdi-star-outline</v-icon></v-btn>
        <v-btn v-if="followed === true" fab fixed bottom right outline color="indigo darken-5" class="mr-2" @click="unfollowDialog = true"><v-icon>mdi-star</v-icon></v-btn>
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
import Finance from '@/components/Etablissement/Finance.vue'
import Commentaire from '@/components/Etablissement/Commentaire.vue'
import Entreprise from '@/components/Etablissement/Entreprise.vue'
import axios from 'axios'
import fr from 'apexcharts/dist/locales/fr.json'

export default {
  props: ['siret', 'batch'],
  name: 'Etablissement',
  components: { Effectif, Urssaf, Help, Finance, Identite, Map, Commentaire, Entreprise },
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
    }
  },
  methods: {
    computeFinance(f) {
      // TODO: integration in component
      const annee = f.annee

      const ca = f.diane.ca ? f.diane.ca + '\u00A0k€' : 'n/c'
      const caClass = (!f.diane.ca) ? 'gray' : ''
      const resultatExpl = f.diane.resultat_expl ? f.diane.resultat_expl + '\u00A0k€' : 'n/c'
      let margeOpe = f.diane.resultat_expl / f.diane.ca
      const margeOpeClass = (!margeOpe) ? 'gray' : (margeOpe < 0) ? 'down' : ''
      margeOpe = margeOpe ? (Math.floor(margeOpe * 1000) / 10) + ' %' : 'n/c'

      const beneficeOuPerte = f.diane.benefice_ou_perte ? f.diane.benefice_ou_perte + '\u00A0k€' : 'n/c'
      let margeNette = f.diane.benefice_ou_perte / f.diane.ca
      const margeNetteClass = !(margeNette) ? 'gray' : (margeNette < 0) ? 'down' : ''
      margeNette = margeNette ? (Math.floor(margeNette * 1000) / 10) + ' %' : 'n/c'

      const delaiFournisseur = f.bdf.delai_fournisseur ? Math.round(f.bdf.delai_fournisseur) + ' jours' : 'n/c'
      const delaiFournisseurClass = !(f.bdf.delai_fournisseur) ? 'gray' : ''
      let delaiClient = Math.round(f.diane.credit_client / f.diane.ca * 360)
      const delaiClientClass = !(delaiClient) ? 'gray' : ''

      delaiClient = delaiClient ? delaiClient + ' jours' : 'n/c'

      const poidsFrng = f.bdf.poids_frng ? Math.round(f.bdf.poids_frng * 10) / 10 + ' %' : 'n/c'
      const poidsFrngClass = !(f.bdf.poids_frng) ? 'gray' : ''

      const financierCourtTerme = f.bdf.financier_court_terme ?
        Math.round(f.bdf.financier_court_terme * 10) / 10 + ' %' : 'n/c'

      const financierCourtTermeClass = !(f.bdf.financier_court_terme) ? 'gray' : ''

      const exercice = f.diane.exercice_diane
      const nombreMois = f.diane.nombre_mois

      // Soldes Intermédiaires de Gestion (SIG) restants
      const va = f.diane.valeur_ajoutee ? f.diane.valeur_ajoutee.toFixed(2) : null
      const ebe = f.diane.excedent_brut_d_exploitation ? f.diane.excedent_brut_d_exploitation.toFixed(2) : null
      const caf = f.diane.capacite_autofinancement ? f.diane.capacite_autofinancement.toFixed(2) : null

      // État de la trésorerie
      const frng = f.diane.couverture_ca_fdr ?
        Math.round(f.diane.couverture_ca_fdr * f.diane.ca / 360) : null
      const bfr = f.diane.couverture_ca_besoin_fdr ?
        Math.round(f.diane.couverture_ca_besoin_fdr * f.diane.ca / 360) : null
      const tresorerie = (frng && bfr) ? frng - bfr : null

      // Ratios
      const ratios = {}
      // A - Structure et liquidité
      ratios.structureLiquidite = {}
      ratios.structureLiquidite.equilibreFinancier = f.diane.equilibre_financier ?
        f.diane.equilibre_financier.toLocaleString() : 'n/c'
      ratios.structureLiquidite.independanceFinanciere = f.diane.independance_financiere ?
        f.diane.independance_financiere.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.structureLiquidite.endettement = f.diane.endettement ?
        f.diane.endettement.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.structureLiquidite.autonomieFinanciere = f.diane.autonomie_financiere ?
        f.diane.autonomie_financiere.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.structureLiquidite.degreImmoCorporelle = f.diane.degre_immo_corporelle ?
        f.diane.degre_immo_corporelle.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.structureLiquidite.financementActifCirculant = f.diane.financement_actif_circulant ?
        f.diane.financement_actif_circulant.toLocaleString() : 'n/c'
      ratios.structureLiquidite.liquiditeGenerale = f.diane.liquidite_generale ?
        f.diane.liquidite_generale.toLocaleString() : 'n/c'
      ratios.structureLiquidite.liquiditeReduite = f.diane.liquidite_reduite ?
        f.diane.liquidite_reduite.toLocaleString() : 'n/c'
      // B - Gestion
      ratios.gestion = {}
      ratios.gestion.rotationStocks = f.diane.rotation_stocks ?
        f.diane.rotation_stocks.toLocaleString() + '\u00A0jours' : 'n/c'
      ratios.gestion.creditClient = f.diane.credit_client ?
        f.diane.credit_client.toLocaleString() + '\u00A0jours' : 'n/c'
      ratios.gestion.creditFournisseur = f.diane.credit_fournisseur ?
        f.diane.credit_fournisseur.toLocaleString() + '\u00A0jours' : 'n/c'
      ratios.gestion.caParEffectif = f.diane.ca_par_effectif ?
        f.diane.ca_par_effectif.toLocaleString() + '\u00A0k€/emploi' : 'n/c'
      ratios.gestion.tauxInteretFinancier = f.diane.taux_interet_financier ?
        f.diane.taux_interet_financier.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.gestion.tauxInteretSurCa = f.diane.taux_interet_sur_ca ?
        f.diane.taux_interet_sur_ca.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.gestion.endettementGlobal = f.diane.endettement_global ?
        f.diane.endettement_global.toLocaleString() + '\u00A0jours' : 'n/c'
      ratios.gestion.tauxEndettement = f.diane.taux_endettement ?
        f.diane.taux_endettement.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.gestion.capaciteRemboursement = f.diane.capacite_remboursement ?
        f.diane.capacite_remboursement.toLocaleString() : 'n/c'
      ratios.gestion.capaciteAutofinancement = f.diane.capacite_autofinancement ?
        f.diane.capacite_autofinancement.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.gestion.couvertureCaFdr = f.diane.couverture_ca_fdr ?
        f.diane.couverture_ca_fdr.toLocaleString() + '\u00A0jours' : 'n/c'
      ratios.gestion.couvertureCaBesoinFdr = f.diane.couverture_ca_besoin_fdr ?
        f.diane.couverture_ca_besoin_fdr.toLocaleString() + '\u00A0jours' : 'n/c'
      ratios.gestion.poidsBfrExploitation = f.diane.poids_bfr_exploitation ?
        f.diane.poids_bfr_exploitation.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.gestion.exportation = f.diane.exportation ?
        f.diane.exportation.toLocaleString() + '\u00A0%' : 'n/c'
      // C - Productivité et rentabilité
      ratios.productiviteRentabilite = {}
      ratios.productiviteRentabilite.efficaciteEconomique = f.diane.efficacite_economique ?
        f.diane.efficacite_economique.toLocaleString() + '\u00A0k€/emploi' : 'n/c'
      ratios.productiviteRentabilite.productivitePotentielProduction = f.diane.productivite_potentiel_production ?
        f.diane.productivite_potentiel_production.toLocaleString() : 'n/c'
      ratios.productiviteRentabilite.productiviteCapitalFinancier = f.diane.productivite_capital_financier ?
        f.diane.productivite_capital_financier.toLocaleString() : 'n/c'
      ratios.productiviteRentabilite.productiviteCapitalInvesti = f.diane.productivite_capital_investi ?
        f.diane.productivite_capital_investi.toLocaleString() : 'n/c'
      ratios.productiviteRentabilite.tauxDInvestissementProductif = f.diane.taux_d_investissement_productif ?
        f.diane.taux_d_investissement_productif.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.productiviteRentabilite.rentabiliteEconomique = f.diane.rentabilite_economique ?
        f.diane.rentabilite_economique.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.productiviteRentabilite.performance = f.diane.performance ?
        f.diane.performance.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.productiviteRentabilite.rendementBrutFondsPropres = f.diane.rendement_brut_fonds_propres ?
        f.diane.rendement_brut_fonds_propres.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.productiviteRentabilite.rentabiliteNette = f.diane.rentabilite_nette ?
        f.diane.rentabilite_nette.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.productiviteRentabilite.rendementCapitauxPropres = f.diane.rendement_capitaux_propres ?
        f.diane.rendement_capitaux_propres.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.productiviteRentabilite.rendementRessourcesDurables = f.diane.rendement_ressources_durables ?
        f.diane.rendement_ressources_durables.toLocaleString() + '\u00A0%' : 'n/c'
      // D - Marge et valeur ajoutée
      ratios.margeValeurAjoutee = {}
      ratios.margeValeurAjoutee.tauxMargeCommerciale = f.diane.taux_marge_commerciale ?
        f.diane.taux_marge_commerciale.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.margeValeurAjoutee.tauxValeurAjoutee = f.diane.taux_valeur_ajoutee ?
        f.diane.taux_valeur_ajoutee.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.margeValeurAjoutee.partSalaries = f.diane.part_salaries ?
        f.diane.part_salaries.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.margeValeurAjoutee.partEtat = f.diane.part_etat ?
        f.diane.part_etat.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.margeValeurAjoutee.partPreteur = f.diane.part_preteur ?
        f.diane.part_preteur.toLocaleString() + '\u00A0%' : 'n/c'
      ratios.margeValeurAjoutee.partAutofinancement = f.diane.part_autofinancement ?
        f.diane.part_autofinancement.toLocaleString() + '\u00A0%' : 'n/c'

      return {
        annee,
        ca,
        caClass,
        resultatExpl,
        margeOpe,
        margeOpeClass,
        beneficeOuPerte,
        margeNette,
        margeNetteClass,
        delaiFournisseur,
        delaiFournisseurClass,
        delaiClient,
        delaiClientClass,
        poidsFrng,
        poidsFrngClass,
        financierCourtTerme,
        financierCourtTermeClass,
        frng,
        bfr,
        tresorerie,
        ebe,
        va,
        caf,
        exercice,
        nombreMois,
        ratios,
        axios: axios.create(),
      }
    },
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
  },
  created() {
    Apex.chart = {
      locales: [fr],
      defaultLocale: 'fr',
    }
  },
  mounted() {
    this.getEtablissement()
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
    finance() {
      return this.zipDianeBDF.map((z) => this.computeFinance(z))
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
</style>
