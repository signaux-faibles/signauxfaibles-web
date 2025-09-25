<template>
  <div style="min-height: 100%; background: #fff">

    <Spinner style="min-height: 80vh" v-if="loading" />

    <div :class="'maindiv ' + loadingClass"
         style="min-height: 100%;
         background: #fff;
         font-weight: 800;
         font-family: 'Oswald', sans-serif;"
    >
      <v-container>
        <v-layout wrap>
          <v-flex class="pa-3" style="font-size: 18px; margin-top: 3em;" xs12>
            <EntrepriseIdentite
              :creation="creation"
              :denomination="denomination"
              :groupe="groupe"
              :pge="pge"
              :siege="siege"
              :siren="siren"
              :statutJuridique="statutJuridique"
              :terrind="terrind"
            />
          </v-flex>
          <v-flex class="pb-3 pr-1" xs12>
            <EntrepriseSocial
              :etablissements="etablissements"
              :etablissementsSummary="etablissementsSummary"
              :siren="siren"
              v-on="$listeners"
            />
          </v-flex>
          <v-flex class="pb-3 pr-1" xs12>
            <EntrepriseFinance
              v-if="ready"
              :naf="sirene.naf"
              :siren="siren"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import EntrepriseIdentite from '@/components/entreprise/identite.vue'
import EntrepriseSocial from '@/components/entreprise/social.vue'
import EntrepriseFinance from '@/components/entreprise/finance.vue'
import axios from 'axios'
import fr from 'apexcharts/dist/locales/fr.json'
import Spinner from "@/components/Spinner.vue";

export default {
  name: 'Entreprise',
  props: ['siren'],
  components: {Spinner, EntrepriseIdentite, EntrepriseSocial, EntrepriseFinance},
  data() {
    return {
      axios: axios.create(),
      entreprise: {},
      ready: false,
      loading: true,
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
      this.loading = true
      this.$axios.get(`/entreprise/all/${this.siren}`).then((response) => {
        this.entreprise = response.data
        this.ready = true
        this.loading = false
      }).catch(() => {
        this.entreprise = {}
      })
    },

  },
  computed: {
    loadingClass() {
      if (!this.ready) {
        return "loading"
      }
    },
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
      return this.sirene.statutJuridiqueN2
    },
  },
}
</script>

<style scoped>
  .maindiv {
    transition: opacity 0.5s;
  }

  .loading {
    opacity: 0;
  }
</style>
