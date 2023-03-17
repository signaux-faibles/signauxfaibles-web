<template>
  <div style="min-height: 100%; background: #fff">
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
              :pge="pge"
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
              :naf="sirene.naf"
              v-if="ready"
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
      ready: false,
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
    getEntrepriseEtablissements() {
      this.$axios.get(`/entreprise/all/${this.siren}`).then((response) => {
        this.entreprise = response.data
        this.ready = true
      }).catch((error) => {
        this.entreprise = {}
      })
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
    pge() {
      return this.entreprise.pge || false
    },
    groupe() {
      return ((this.entreprise || {}).groupe || {}).raison_sociale_groupe
    },
    creation() {
      const creation = new Date(this.sirene.creation)
      return (!isNaN(creation.getTime())) ? creation : null
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
