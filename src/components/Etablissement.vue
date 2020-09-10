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
              :adresse="adresse"
            />
          </v-flex>
          <v-flex xs12 md6 class="text-xs-right pa-3" style="margin-top: 3em">
            <Map :longitude="sirene.longitude" :latitude="sirene.lattitude" ref="map" />
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
          <v-dialog v-model="followDialog" @input="closeFollowDialog()" max-width="500px">
            <v-card>
              <v-card-title class="headline">Suivre {{ denomination }} ?</v-card-title>
              <v-card-text>
                <v-textarea v-model="followComment" solo label="Pour quel motif souhaitez-vous suivre cet établissement ?"></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click="closeFollowDialog()">Annuler</v-btn>
                <v-btn dark color="indigo darken-5" @click="followEtablissement()"><v-icon left class="mr-2">mdi-star-outline</v-icon>Suivre</v-btn>
              </v-card-actions>
              <v-alert :value="followAlert" type="error" transition="scale-transition">{{ followAlertError }}</v-alert>
            </v-card>
          </v-dialog>
        </v-layout>
        <v-btn v-if="followed === false" fab fixed bottom right dark color="indigo darken-5" class="mr-2" @click="followDialog = true"><v-icon>mdi-star-outline</v-icon></v-btn>
        <v-btn v-if="followed === true" fab fixed bottom right outline color="indigo darken-5" class="mr-2" @click="unfollowEtablissement()"><v-icon>mdi-star</v-icon></v-btn>
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
import axios from 'axios'
import fr from 'apexcharts/dist/locales/fr.json'

export default {
  props: ['siret', 'batch'],
  name: 'Etablissement',
  components: { Effectif, Urssaf, Help, Finance, Identite, Map, Commentaire },
  data() {
    return {
      axios: axios.create(),
      sirene: {},
      etablissement: {},
      historique: [],
      adresse: '',
      followed: null,
      followDialog: false,
      followComment: '',
      followAlert: false,
      followAlertError: '',
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
      this.axios.get(process.env.VUE_APP_SIRENE_BASE_URL + `/v1/siret/${this.siret}`).then((response) => {
        const etablissement = response.data.etablissement || {}
        const adresse = [etablissement.l1_normalisee,
          etablissement.l2_normalisee,
          etablissement.l4_normalisee,
          etablissement.l5_normalisee,
          etablissement.l6_normalisee,
          etablissement.l7_normalisee].filter(Boolean).join('<br>')
        this.adresse = adresse
        this.$refs.map.resizeMap()
      })
    },
    followEtablissement() {
      if (this.followComment.trim().length > 0) {
        const params = {}
        params.comment = this.followComment
        this.$axios.post(`/follow/${this.siret}`, params).then((response) => {
          if (response.status === 201 || response.status === 204) {
            this.followed = true
            this.followDialog = false
            this.followAlert = false
            this.getEtablissement()
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
    unfollowEtablissement() {
      this.$axios.delete(`/follow/${this.siret}`).then((response) => {
        if (response.status === 200 ) {
          this.followed = false
          this.getEtablissement()
        }
      })
    },
    closeFollowDialog() {
      this.followDialog = false
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
            part_ouvriere: (periodeUrssaf.partPatronale || {})[i],
            part_patronale: (periodeUrssaf.partSalariale || {})[i],
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
        return {
          effectif: periodeUrssaf.effectif[i],
          periode: p,
        }
      })
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
