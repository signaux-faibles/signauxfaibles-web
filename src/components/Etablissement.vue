<template>
  <div style="background: #fff">
    <div>
      <v-container>
        <v-layout wrap>

          <v-flex

          style="vertical-align: middle; text-align: center; margin-top: 30px; font-size: 24px"
          xs12>
            {{ sirene.raison_sociale }}
          </v-flex>
          <v-flex
          xs12
          md6
          class="pa-3"
          style="font-size: 18px">

            <h4>SIRET {{ siret }} </h4><br/>
            {{ sirene.nature_juridique }} <br/>
            <!-- <v-btn :color="suivi?'error':'success'" @click="suivi=!suivi">
              {{ suivi?'Ne plus suivre cet établissement':'Suivre cet établissement' }}
            </v-btn> -->


            <br/>
            <b>{{ sirene.l1_normalisee }} </b><br/>
            <b>{{ sirene.l2_normalisee }} </b><br/>
            <b>{{ sirene.l3_normalisee }} </b><br/>
            <b>{{ sirene.l4_normalisee }} </b><br/>
            <b>{{ sirene.l5_normalisee }} </b><br/>
            <b>{{ sirene.l6_normalisee }} </b><br/>
            <b>{{ sirene.l7_normalisee }} </b><br/>

            <br/><br/>
            <v-divider/>
            <br/>
            <v-divider/>
            <br/>
            
            <b>{{ (naf.n1 || {})[((naf.n5to1 || {})[(sirene.activite_principale || '')] || '')] }}</b><br/>
            {{ (naf.n5 || {})[(sirene.activite_principale || '')] }}<br/>
            Code APE: {{ (sirene.activite_principale || '') }}<br/> 
          </v-flex>
          <v-flex xs12 md6 class="text-xs-right pa-3">
            <iframe
            :v-if="sirene.longitude"
            width="100%"
            height="360"
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
            :src="'https://www.openstreetmap.org/export/embed.html?bbox=' + (parseFloat(sirene.longitude) - 0.03) + '%2C' + (parseFloat(sirene.latitude)  - 0.03) + '%2C' + (parseFloat(sirene.longitude) + 0.03) + '%2C' + (parseFloat(sirene.latitude) + 0.03) + '&amp;layer=mapnik&amp;marker=' + sirene.latitude + '%2C' + sirene.longitude" style="border: 1px solid black"></iframe><br/>
            <small><a :href="'https://www.openstreetmap.org/#map=17/' + sirene.latitude + '/' + sirene.longitude">Afficher une carte plus grande</a></small>
          </v-flex>

          <!-- <v-flex
            xs12 md12 class="pa-3"
            v-for="(c, i) in comments"
            :key="c['comment'] + i">
            <v-textarea
              box
              :label="c['author'] + ', le ' + c['date']"
              :value="c['comment']"
            ></v-textarea>
          </v-flex> -->
          <v-flex xs6 class="pr-1" style="min-height: 200px">
            <v-toolbar
              dark
              color='indigo darken-5'>
              <v-toolbar-title class="localtoolbar">Effectifs</v-toolbar-title>
            </v-toolbar>
            <IEcharts
              auto-resize
              :loading="chart"
              style="width: 100%; height: 350px"
              :option="effectifOptions"
            />
          </v-flex>

          <v-flex xs6 class="pr-1">
            <v-toolbar
              dark
              color='indigo darken-5'>
              <v-toolbar-title
              class="localtoolbar">
                  Débits Urssaf
              </v-toolbar-title>
              <v-spacer/>
              <v-menu max-width="400px" offset-y>                 
                <v-btn slot="activator" icon><v-icon>help</v-icon></v-btn>
                <v-card>
                  <v-card-title class="headline">
                    Cotisations et Débits URSSAF
                  </v-card-title>
                  <v-card-text>
                    Ce graphique représente les données URSSAF:<br/>
                    <ul>
                      <li> Cotisations: Montant des cotisations appelées. La date désigne la fin de la période appelée.</li>
                      <li> Débits: Cumul des dettes restantes à payer. La date désigne la fin de la période de constatation du débit</li>
                    </ul>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer/>
                    <v-btn flat color="success">OK</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-toolbar>
            <IEcharts
              auto-resize
              v-if="roles.includes('urssaf')"
              :loading="chart"
              style="width: 100%; height: 350px"
              :option="urssafOptions"
            />
            <div 
              style=" height: 350px; width: 100%; text-align: center;"
              v-if="!roles.includes('urssaf')"
            >
              <img
              style="vertical-align: middle; margin: 125px 0; opacity: 0.2;"
              height="100px"
              src="@/assets/noaccess.svg"/>
            </div>
          </v-flex>
          <v-flex xs6 class="pr-1">
            <v-toolbar
              dark
              color='indigo darken-5'>
              <v-toolbar-title class="localtoolbar">Demandes d'activité partielle</v-toolbar-title>
            </v-toolbar>
            <div 
              style=" height: 350px; width: 100%; text-align: center;"
              v-if="!roles.includes('dgefp')"
            >
              <img
              style="vertical-align: middle; margin: 125px 0; opacity: 0.2;"
              height="100px"
              src="@/assets/noaccess.svg"/>
            </div>
            <div style="min-height: 350px;">
              <table 
                style="width: 100%; padding: 5px; text-align: center"
                v-if="roles.includes('dgefp')"
              >
                <tr>
                  <th>
                    Date
                  </th>
                  <th>
                    Effectif Autorisé
                  </th>
                  <th>
                    Début
                  </th>
                  <th>
                    Fin
                  </th>
                </tr>
                <tr v-for="d in apdemande" :key="d.date_statut" style="font-weight: 400">
                  <td>
                    {{ d.date_statut.substring(0,10) }}
                  </td>
                  <td>
                    {{ d.effectif_autorise }}
                  </td>
                  <td>
                    {{ d.periode.start.substring(0,10) }}
                  </td>
                  <td>
                    {{ d.periode.end.substring(0,10) }}
                  </td>
                </tr>
              </table>
            </div>
          </v-flex>

          <v-flex xs6 class="pr-1">
            <v-toolbar
            dark
            color='indigo darken-5'>
              <v-toolbar-title class="localtoolbar">Consommations d'activité partielle</v-toolbar-title>
            </v-toolbar>
            <div 
              style=" height: 350px; width: 100%; text-align: center;"
              v-if="!roles.includes('dgefp')"
            >
              <img
              style="vertical-align: middle; margin: 125px 0; opacity: 0.2;"
              height="100px"
              src="@/assets/noaccess.svg"/>
            </div>
            <table 
              style="min-height: 350px; width: 100%; padding: 5px; text-align: center"
              v-if="roles.includes('dgefp')"
            >
              <tr>
                <th>
                  Date
                </th>
                <th>
                  Effectifs
                </th>
                <th>
                  Heures
                </th>
              </tr>
              <tr v-for="d in apconso" :key="d.periode" style="font-weight: 400">
                <td>
                  {{ d.periode.substring(0, 10) }}
                </td>
                <td>
                  {{ d.effectif }}
                </td>
                <td>
                  {{ d.heure_consomme }}
                </td>
              </tr>
            </table>
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
          <Financier data:="finance"/>
          <v-flex
            v-for="f in finance.slice(0,6)"
            :key="f.annee"
            pa-1
            xs12
            sm6
            md4
            lg4
          >
            <v-card
            outline
            class="elevation-2">
              <v-card-title style="background-color: #dde;" class="subheading font-weight-bold">{{ f.annee }}</v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Chiffre d'Affaire:</v-list-tile-content>
                  <v-list-tile-content class="text-xs-right">
                    <div style="width: 100%;" :class="f.caClass">
                    {{ f.ca }}
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Résultat d'exploitation:</v-list-tile-content>
                  <v-list-tile-content class="text-xs-right">
                    <div style="width: 100%;" :class="f.margeOpeClass">
                      {{ f.resultatExpl }} ({{ (f.margeOpe) }})
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Résultat net:</v-list-tile-content>
                  <v-list-tile-content class="text-xs-right">
                    <div style="width: 100%;" :class="f.margeNetteClass">
                      {{ f.beneficeOuPerte }} ({{ (f.margeNette) }})
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Délai Fournisseur:</v-list-tile-content>
                  <v-list-tile-content class="text-xs-right">
                    <div style="width: 100%;" :class="f.delaiFournisseurClass">
                      {{ f.delaiFournisseur }}
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Délai Client:</v-list-tile-content>
                  <v-list-tile-content class="text-xs-right">
                    <div style="width: 100%;" :class="f.delaiClientClass">
                      {{ f.delaiClient }}
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Poids FRNG:</v-list-tile-content>
                  <v-list-tile-content class="text-xs-right">
                    <div style="width: 100%;" :class="f.poidsFrngClass">
                      {{ f.poidsFrng }}
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Financement court terme:</v-list-tile-content>
                  <v-list-tile-content class="text-xs-right">
                    <div style="width: 100%;" :class="f.financierCourtTermeClass">
                      {{ f.financierCourtTerme }}
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
 
            </v-card>
          </v-flex> 
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import IEcharts from 'vue-echarts-v3/src/lite.js'
import Finance from '@/components/Finance.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import axios from 'axios'


export default {
  props: ['siret', 'batch'],
  name: 'Etablissement',
  components: { IEcharts },
  data() {
    return {
      axios: axios.create(),
      suivi: false,
      chart: false,
      bilan: true,
      urssaf: true,
      apart: true,
      sirene: {},
      etablissement: { value: {} },
      pagination: null,
      comments: [],
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
    addComment() {
      this.comments.push({
        comment: '',
        author: 'C.Ninucci',
        date: this.formattedDate(new Date()),
      })
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
    this.getEtablissement()
  },
  watch: {
    localSiret(val) {
      this.getEtablissement(val)
    },
  },
  computed: {
    finance() {
      return this.zipDianeBDF.filter((z) => z.annee).map((z) => this.computeFinance(z))
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
      const annees = new Set(this.bdf.map((b) => b.arrete_bilan_bdf).concat(this.diane.map((d) => d.arrete_bilan_diane)))
      return Array.from(annees).sort((a, b) => a < b).map((a) => {
        return {
          annee: a.slice(0,10),
          bdf: this.bdf.filter((b) => b.arrete_bilan_bdf === a)[0] || {},
          diane: this.diane.filter((d) => d.arrete_bilan_diane === a)[0] || {},
        }
      })
    },
    effectifOptions() {
      return {
        title: {
          text: null,
        },
        legend: {
          data: ['effectif'],
          y: 'bottom',
        },
        toolbox: {
          show: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56',
            },
          },
        },
        xAxis: {
          show: true,
          type: 'category',
          data: this.effectif.map((e) => e.periode.slice(0, 10)),
        },
        yAxis: {
          type: 'value',
          show: true,
        },
        series: [{
          name: 'effectif',
          color: 'indigo',
          step: 'end',
          type: 'line',
          data: this.effectif.map((e) => e.effectif),
        }],
      }
    },
    urssafOptions() {
      return {
        title: {
          text: null,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56',
            },
          },
        },
        legend: {
          data: ['Cotisation', 'Débit'],
          y: 'bottom',
        },
        toolbox: {
          show: true,
        },
        xAxis: {
          show: true,
          type: 'category',
          axisTick: false,
          data: this.debit.map((d) => (d.periode || '').slice(0, 10)),
        },
        yAxis: {
          type: 'value',
          show: true,
        },
        series: [{
          color: 'indigo',
          smooth: true,
          name: 'Cotisation',
          type: 'line',
          data: this.cotisation,
        }, {
          color: 'red',
          smooth: true,
          name: 'Débit',
          type: 'line',
          data: this.debit.map((d) => d.part_ouvriere + d.part_patronale),
        }],
      }
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
