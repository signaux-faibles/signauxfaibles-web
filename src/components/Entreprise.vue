<template>
  <div style="background: #fff">
    <div>
      <v-container>
        <v-layout wrap>
          <v-flex xs12 class="pa-3" style="font-size: 18px; margin-top: 3em;">
            <EntrepriseIdentite
              :denomination="denomination"
              :siren="siren"
              :siege="siege"
              :groupe="groupe"
              :terrind="terrind"
              :creation="creation"
              :statutJuridique="statutJuridique"
            />
          </v-flex>
          <v-flex xs12 class="pb-3 pr-1">
            <EntrepriseSocial
              :siren="siren"
              :etablissementsSummary="etablissementsSummary"
              :etablissements="etablissements"
              v-on="$listeners"
            />
          </v-flex>
          <v-flex xs12 class="pb-3 pr-1">
            <EntrepriseFinance 
              :siren="siren"
              :finance="finance"
            />
          </v-flex>
          <v-flex xs12 class="pr-1">
            <EntreprisePaiement
              :siren="siren"
              :paydex="paydex"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import EntrepriseIdentite from '@/components/Entreprise/Identite.vue'
import EntrepriseSocial from '@/components/Entreprise/Social.vue'
import EntrepriseFinance from '@/components/Entreprise/Finance.vue'
import EntreprisePaiement from '@/components/Entreprise/Paiement.vue'
import axios from 'axios'
import fr from 'apexcharts/dist/locales/fr.json'

export default {
  name: 'Entreprise',
  props: ['siren'],
  components: { EntrepriseIdentite, EntrepriseSocial, EntrepriseFinance, EntreprisePaiement },
  data() {
    return {
      axios: axios.create(),
      entreprise: {},
    }
  },
  created() {
    Apex.chart = {
      locales: [fr],
      defaultLocale: 'fr',
    }
  },
  mounted() {
    this.getEntrepriseEtablissements()
  },
  methods: {
    getEntreprise() {
      this.$axios.get(`/entreprise/get/${this.siren}`).then((response) => {
        this.entreprise = response.data
      }).catch((error) => {
        this.entreprise = {}
      })
    },
    getEntrepriseEtablissements() {
      this.$axios.get(`/entreprise/all/${this.siren}`).then((response) => {
        this.entreprise = response.data
      }).catch((error) => {
        this.entreprise = {}
      })
    },
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
  },
  computed: {
    sirene() {
      return (this.entreprise || {}).Sirene || {}
    },
    denomination() {
      return this.sirene.raisonSociale
    },
    siege() {
      return ((this.entreprise || {}).etablissements || []).filter((e) => e.siege === true)[0] || {}
    },
    terrind() {
      return (this.siege.territoireIndustrie || {}).libelle
    },
    groupe() {
      return ((this.entreprise || {}).groupe || {}).raison_sociale_groupe
    },
    creation() {
      const creation = new Date(this.sirene.creation)
      return (!isNaN(creation.getTime())) ? creation : null
    },
    finance() {
      return this.zipDianeBDF.map((z) => this.computeFinance(z))
    },
    zipDianeBDF() {
      const entreprise = this.entreprise || {}
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
      return (this.entreprise || {}).etablissementsSummary || []
    },
    etablissements() {
      return (this.entreprise || {}).etablissements || []
    },
    paydex() {
      return (this.entreprise || {}).paydex
    },
    statutJuridique() {
      const statutJuridique = this.sirene.statutJuridiqueN2
      return statutJuridique
    },
  },
}
</script>
