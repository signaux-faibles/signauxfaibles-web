<template>
  <div>
    <v-toolbar
      dark
      color='indigo darken-5'>
      <v-toolbar-title class="localtoolbar">Informations Financières</v-toolbar-title>
      <v-spacer/>
      <Help titre="Informations Financières de l'établissement">
        <template>
          Ce graphique illustre les informations financières
        </template>
      </Help>
    </v-toolbar>
    <div>
      <v-layout mt-4 wrap>
        <v-flex  md6 xs12><apexchart width="100%" heigth="100%" type="bar" :options="sigBarOptions" :series="sigSeries"></apexchart></v-flex>
        <v-flex md6 xs12><apexchart width="100%" heigth="100%" type="bar" :options="tresorerieBarOptions" :series="tresorerieSeries"></apexchart></v-flex>
      </v-layout>
      <v-layout wrap>
        <v-flex
          v-for="f in this.sortedFinance()"
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
            <v-card-title style="background-color: #dde;" class="subheading font-weight-bold">Ratios de l'exercice {{ f.exercice + ' ' + mois(f.nombreMois)}}</v-card-title>
            <v-divider></v-divider>
            <v-subheader>Structure et liquidité</v-subheader>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Équilibre financier&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.structureLiquidite.equilibreFinancier }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Indépendance financière&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.structureLiquidite.independanceFinanciere }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Endettement&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.structureLiquidite.endettement }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Autonomie financière&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.structureLiquidite.autonomieFinanciere }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Degré d'amortissements des immobilisations corporelles&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.structureLiquidite.degreImmoCorporelle }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list >
              <v-list-tile>
                <v-list-tile-content>Financement de l'actif circulant net&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.structureLiquidite.financementActifCirculant }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Liquidité générale&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.structureLiquidite.liquiditeGenerale }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Liquidité réduite&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.structureLiquidite.liquiditeReduite }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-subheader>Gestion</v-subheader>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Rotation des stocks&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.gestion.rotationStocks }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Crédit clients&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.gestion.creditClient }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Crédit fournisseurs&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.gestion.creditFournisseur }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>CA par effectif&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.gestion.caParEffectif }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Taux d'intérêt financier&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.gestion.tauxInteretFinancier }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Intérêts / Chiffre d'affaires&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.gestion.tauxInteretSurCa }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Endettement global&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.gestion.endettementGlobal }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Taux d'endettement&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.gestion.tauxEndettement }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Capacité de remboursement&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.gestion.capaciteRemboursement }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Capacité d'autofinancement&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.gestion.capaciteAutofinancement }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Couverture du CA par le FRNG&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.gestion.couvertureCaFdr }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Couverture du CA par le BFR&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.gestion.couvertureCaBesoinFdr }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Poids des BFR d'exploitation&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.gestion.poidsBfrExploitation }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Exportation&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.gestion.exportation }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-subheader>Productivité et rentabilité</v-subheader>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Efficacité économique&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.productiviteRentabilite.efficaciteEconomique }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Productivité du potentiel de production&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.productiviteRentabilite.productivitePotentielProduction }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Productivité du capital financier&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.productiviteRentabilite.productiviteCapitalFinancier }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Productivité du capital investi&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.productiviteRentabilite.productiviteCapitalFinancier }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Taux d'investissement productif&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.productiviteRentabilite.tauxDInvestissementProductif }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Rentabilité économique&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.productiviteRentabilite.rentabiliteEconomique }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Performance&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.productiviteRentabilite.performance }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Rendement brut des fonds propres nets&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.productiviteRentabilite.rendementBrutFondsPropres }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Rentabilité nette&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.productiviteRentabilite.rentabiliteNette }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Rendement des capitaux propres nets&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.productiviteRentabilite.rendementCapitauxPropres }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Rendement des ressources durables nettes&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.productiviteRentabilite.rendementRessourcesDurables }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-subheader>Marge et valeur ajoutée</v-subheader>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Taux de marge commerciale&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.margeValeurAjoutee.tauxMargeCommerciale }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Taux de valeur ajoutée&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.margeValeurAjoutee.tauxValeurAjoutee }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Part des salariés&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.margeValeurAjoutee.partSalaries }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Part de l'État&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.margeValeurAjoutee.partEtat }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Part des prêteurs&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.margeValeurAjoutee.partPreteur }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>Part de l'autofinancement&nbsp;:</v-list-tile-content>
                <v-list-tile-content class="align-end">{{ f.ratios.margeValeurAjoutee.partAutofinancement }}</v-list-tile-content>
              </v-list-tile>
            </v-list>
            <div class="pb-3 text-xs-center"><v-btn dark color="indigo darken-5">Télécharger le bilan {{ f.exercice }}</v-btn></div>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'

export default {
  name: 'OldFinance',
  props: ['finance'],
  components: { Help },
  methods: {
    sortedFinance() {
      return (this.finance || []).sort((f1, f2) => (f2.annee > f1.annee ? -1 : 1))
        .slice((this.finance.length - 3 > 0) ? this.finance.length - 3 : 0, this.finance.length)
    },
    annees() {
      return this.sortedFinance().map((f) => f.annee )
    },
    exercices() {
      return this.sortedFinance().map((f) => f.exercice )
    },
    barOptions() {
      return {
        legend: {
          show: true,
          showForSingleSeries: true,
          showForNullSeries: false,
          showForZeroSeries: false,
        },
        chart: {
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: true,
          },
          id: 'barFinance',
        },
        xaxis: {
          type: 'category',
          categories: this.exercices(),
        },
        yaxis: {
          title: {
            text: 'k€ (milliers d\'euros)',
          },
          labels: {
            formatter(val, index) {
                return val.toFixed(0)
              },
          },
        },
        theme: {
          monochrome: {
            enabled: true,
            color: '#4f8a83',
            shadeTo: 'light',
            shadeIntensity: 1,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '50%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        tooltip: {
          enabled: true,
          y: {
            formatter(val) {
              return parseFloat(val.toFixed(2)).toLocaleString() + ' k€'
            },
          },
        },
      }
    },
    mois(m) {
      return m ? '(' + m + ' mois)' : ''
    },
  },
  computed: {
    options() {
      return {
        legend: {
          show: true,
          showForSingleSeries: true,
          showForNullSeries: false,
          showForZeroSeries: false,
        },
        tooltip: {
          enabled: true,
        },
        theme: {
          mode: 'light',
          palette: 'palette7',
        },
        chart: {
          toolbar: {
            show: false,
          },
          id: 'finance',
        },
        zoom: {
          enabled: false,
        },
        xaxis: {
          type: 'datetime',
          categories: this.annees(),
        },
        colors: ['#4f8a83'],
        fill: {
          type: [ 'solid'],
          colors: ['#4f8a83'],
        },
        stroke: {
          curve: ['smooth'],
          width: [5],
        },
      }
    },
    caSeries() {
      return [{
        name: 'CA',
        data: this.sortedFinance().map((f) => {
          return parseInt(f.ca, 10)
        }),
      }]
    },
    resultatExplSeries() {
      return [{
        name: 'REX',
        data: this.sortedFinance().map((f) => {
          return parseInt(f.resultatExpl, 10)
        }),
      }]
    },
    beneficeOuPerteSeries() {
      return [{
        name: 'Résultat net',
        data: this.sortedFinance().map((f) => {
          return parseInt(f.beneficeOuPerte, 10)
        }),
      }]
    },
    delaiFournisseurSeries() {
      return [{
        name: 'Délai Fournisseur',
        data: this.sortedFinance().map((f) => {
          return parseInt(f.delaiFournisseur, 10)
        }),
      }]
    },
    delaiClientSeries() {
      return [{
        name: 'Délai Client',
        data: this.sortedFinance().map((f) => {
          return parseInt(f.delaiClient, 10)
        }),
      }]
    },
    poidsFrngSeries() {
      return [{
        name: 'Poids FRNG',
        data: this.sortedFinance().map((f) => {
          return parseInt(f.poidsFrng, 10)
        }),
      }]
    },
    financierCourtTermeSeries() {
      return [{
        name: 'Financement court terme',
        data: this.sortedFinance().map((f) => {
          return parseInt(f.financierCourtTerme, 10)
        }),
      }]
    },
    sigBarOptions() {
      const title = {
        title: {
          text: 'Soldes Intermédiaires de Gestion (SIG)',
          align: 'center',
          margin: 0,
        },
      }
      return {...this.barOptions(), ...title}
    },
    tresorerieBarOptions() {
      const title = {
        title: {
          text: 'État de la trésorerie',
          align: 'center',
          margin: 0,
        },
      }
      return {...this.barOptions(), ...title}
    },
    sigSeries() {
      return [{
        name: 'CA',
        data: this.sortedFinance().map((f) => {
          return parseInt(f.ca, 10)
        }),
      }, {
        name: 'VA',
        data: this.sortedFinance().map((f) => {
          return f.va
        }),
      }, {
        name: 'EBE',
        data: this.sortedFinance().map((f) => {
          return f.ebe
        }),
      }, {
        name: 'REX',
        data: this.sortedFinance().map((f) => {
          return parseInt(f.resultatExpl, 10)
        }),
      }, {
        name: 'résultat net',
        data: this.sortedFinance().map((f) => {
          return parseInt(f.beneficeOuPerte, 10)
        }),
      }, {
        name: 'CAF',
        data: this.sortedFinance().map((f) => {
          return f.caf
        }),
      }]
    },
    tresorerieSeries() {
      return [{
        name: 'FRNG',
        data: this.sortedFinance().map((f) => {
          return f.frng
        }),
      }, {
        name: 'BFR',
        data: this.sortedFinance().map((f) => {
          return f.bfr
        }),
      }, {
        name: 'trésorerie nette',
        data: this.sortedFinance().map((f) => {
          return f.tresorerie
        }),
      }]
    },
  },
}
</script>