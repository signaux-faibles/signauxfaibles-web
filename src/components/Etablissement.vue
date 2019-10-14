<template>
  <div style="background: #fff">
    <div>
      <v-container>
        <v-layout wrap>
          <v-flex
          xs12
          md6
          class="pa-3"
          style="font-size: 18px; margin-top: 3em;">
            <Identite :historique="historique" :sirene="sirene" :siret="siret" :naf="naf"/>
          </v-flex>
          <v-flex xs12 md6 class="text-xs-right pa-3" style="margin-top: 3em">
            <Map :longitude="sirene.longitude" :latitude="sirene.latitude"/>
            <!-- <iframe
            :v-if="sirene.longitude"
            width="100%"
            height="360"
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
            :src="'https://www.openstreetmap.org/export/embed.html?bbox=' + (parseFloat(sirene.longitude) - 0.03) + '%2C' + (parseFloat(sirene.latitude)  - 0.03) + '%2C' + (parseFloat(sirene.longitude) + 0.03) + '%2C' + (parseFloat(sirene.latitude) + 0.03) + '&amp;layer=mapnik&amp;marker=' + sirene.latitude + '%2C' + sirene.longitude" style="border: 1px solid black"></iframe><br/>
            <small><a :href="'https://www.openstreetmap.org/#map=17/' + sirene.latitude + '/' + sirene.longitude">Afficher une carte plus grande</a></small> -->
          </v-flex>

          <v-flex md6 xs12 class="pr-1" style="min-height: 200px">
            <Effectif :effectif="effectif" :apconso="apconso" :apdemande="apdemande"/>
          </v-flex>

          <v-flex md6 xs12 class="pr-1">
            <Urssaf :debit="debit" :roles="roles" :cotisation="cotisation"/>
          </v-flex>

          <v-flex xs12 class="pr-1">
            <v-toolbar
              class="mb-2"
              color="indigo darken-5"
              dark
            >
              <v-toolbar-title class="localtoolbar">Informations Financières</v-toolbar-title>
            </v-toolbar>
          </v-flex>
          <v-flex
            v-for="f in finance.slice(0,6)"
            :key="f.annee"
            pa-1
            xs12
            sm6
            md4
            lg4
          >
         <OldFinance :f="f"/>
          </v-flex> 
          <!-- <v-flex xs12 class="pr-1">
            <Finance :siren="siret.slice(0,9)"/> 
          </v-flex> -->
        </v-layout>
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
import OldFinance from '@/components/Etablissement/OldFinance.vue'
// import Finance from '@/components/Etablissement/Finance.vue'
import axios from 'axios'


export default {
  props: ['siret', 'batch'],
  name: 'Etablissement',
  components: { Effectif, Urssaf, Help, OldFinance, Identite, Map },
  data() {
    return {
      axios: axios.create(),
      sirene: {},
      etablissement: { value: {} },
      historique: [],
      pagination: null,
      comments: [],
      error: false,
      loading: true,
    }
  },
  methods: {
    computeFinance(f) {
      const annee = f.annee
      const ca = f.diane.ca ? f.diane.ca + ' k€' : 'n/c'
      const caClass = (!f.diane.ca) ? 'gray' : ''
      const resultatExpl = f.diane.resultat_expl ? f.diane.resultat_expl + ' k€' : 'n/c'
      let margeOpe = f.diane.resultat_expl / f.diane.ca
      const margeOpeClass = (!margeOpe) ? 'gray' : (margeOpe < 0) ? 'down' : ''
      margeOpe = margeOpe ? (Math.floor(margeOpe * 1000) / 10) + ' %' : 'n/c'

      const beneficeOuPerte = f.diane.benefice_ou_perte ? f.diane.benefice_ou_perte + ' k€' : 'n/c'
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
        axios: axios.create(),
      }
    },
    formattedDate(d) {
      let month = String(d.getMonth() + 1)
      let day = String(d.getDate())
      const year = String(d.getFullYear())

      if (month.length < 2) {month = '0' + month}
      if (day.length < 2) {day = '0' + day}

      return `${day}/${month}/${year}`
    },
    close() {
      this.tabs = this.tabs.filter((tab, index) => index !== this.activeTab)
      this.activeTab = this.activeTab - 1
    },
    getHistorique() {
      const params = {
        key: {
          siret: this.siret,
          type: 'detection',
        },
      }

      this.loading = true
      this.$axios.post('/data/get/public', params).then((response) => {
        this.error = false
        this.historique = response.data.sort((d1, d2) => d1.key.batch < d2.key.batch) || []
      }).catch((error) => {
        this.error = true
      })
    },
    getEtablissement() {
      const params = {
        key: {
          batch: this.batch,
          siret: this.siret,
          type: 'detail',
        },
      }

      this.$axios.post('/data/get/public', params).then((response) => {
        this.etablissement = response.data[0] || []
      }).catch((error) => {
        this.etablissement = { value: {} }
      })

      this.axios.get(`https://entreprise.data.gouv.fr/api/sirene/v1/siret/${this.siret}`)
      .then((r) => {
          this.sirene = r.data.etablissement
      }).catch((error) => {
        this.etablissement = { value: {} }
      })

    },
    printDate(date) {
      return (date || '          ').substring(0, 10)
    },
    round(value, size) {
      return Math.round(value * (Math.pow(10, size))) / (Math.pow(10, size))
    },
  },
  mounted() {
    this.getHistorique()
    this.getEtablissement()
  },
  watch: {
    localSiret(val) {
      this.getEtablissement(val)
    },
  },
  computed: {
    finance() {
      return this.zipDianeBDF.filter((z) => z.annee != '0001-01-01').map((z) => this.computeFinance(z))
    },
    naf() {
      return this.$store.state.naf[0] ? this.$store.state.naf[0].value : {}
    },
    localSiret() {
      return this.siret
    },
    apconso() {
      return this.etablissement.value ? (this.etablissement.value.apconso || [])
        .sort((a, b) => a.periode <= b.periode).slice(0, 10)
        : []
    },
    apdemande() {
      return this.etablissement.value ? (this.etablissement.value.apdemande || [])
        .sort((a, b) => a.periode.start <= b.periode.start).slice(0, 10)
        : []
    },
    debit() {
      return this.etablissement.value.debit || []
    },
    cotisation() {
      return (this.etablissement.value.cotisation || []).slice(0, 23)
    },
    effectif() {
      return this.etablissement.value.effectif || []
    },
    bdf() {
      if (this.etablissement.value) {
        return this.etablissement.value.bdf || []
      } else {
        return []
      }
    },
    jwt() {
      return this.$keycloak.tokenParsed || {resource_access: { signauxfaibles: {roles: []}}}
    },
    roles() {
      return this.jwt.resource_access.signauxfaibles.roles
    },
    diane() {
      if (this.etablissement.value) {
        return this.etablissement.value.diane || []
      } else {
        return []
      }
    },
    currentBatchKey() {
      return this.$store.state.currentBatchKey
    },
    zipDianeBDF() {
      const annees = new Set(this.bdf.map((b) => b.arrete_bilan_bdf)
        .concat(this.diane.map((d) => d.arrete_bilan_diane))) 
      return (Array.from(annees) || []).sort((a, b) => a < b).map((a) => {
        return {
          annee: a.slice(0, 10),
          bdf: this.bdf.filter((b) => b.arrete_bilan_bdf === a)[0] || {},
          diane: this.diane.filter((d) => d.arrete_bilan_diane === a)[0] || {},
        }
      })
    },
  },
}

</script>

<style scoped>
.echarts {
  width: 400px
}
.gray {
  color: #aaa;
}
.down {
  color: rgb(244, 67, 54);
}
.widget {
  position: absolute;
  left: 20px;
  top: 20px;
  right: 20px;
}
.localtoolbar {
  font-weight: 600;
  text-align: center;
  width: 100%;
}
.nc {
  color: #bbb;
}
.align-right > * {
  text-align: center;
}
</style>
