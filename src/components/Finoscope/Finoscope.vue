<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab>Performance</v-tab>
      <v-tab>Solvabilité et Trésorerie</v-tab>
<!--      <v-tab>Compte de résultat</v-tab>-->
      <v-tab>Gestion</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-layout mt-4 wrap width="100%">
          <v-flex md6 xs12>
            <PerformanceTable :ratios="ratios" :siren="siren"/>
          </v-flex>
          <v-flex md6 xs12>
            <PerformanceGraph :ratios="ratios"/>
          </v-flex>
        </v-layout>
      </v-tab-item>
      <v-tab-item>
        <v-layout mt-4 wrap width="100%">
          <v-flex md6 xs12>
            <SolvabiliteEtTresorerieTable :ratios="ratios" :siren="siren"/>
          </v-flex>
          <v-flex md6 xs12>
            <SolvabiliteEtTresorerieGraph :ratios="ratios" :chartOptions="chartOptions"/>
          </v-flex>
        </v-layout>
      </v-tab-item>
<!--      <v-tab-item>-->
<!--        <v-layout mt-4 wrap width="100%">-->
<!--          <v-flex md6 xs12>-->
<!--            <CompteDeResultatTable :ratios="ratios" :siren="siren"/>-->
<!--          </v-flex>-->
<!--          <v-flex md6 xs12>-->
<!--            <CompteDeResultatGraph :ratios="ratios" :chartOptions="chartOptions" :siren="siren"/>-->
<!--          </v-flex>-->
<!--        </v-layout>-->
<!--      </v-tab-item>-->
      <v-tab-item>
        <v-layout mt-4 wrap width="100%">
          <v-flex md6 xs12>
            <GestionTable :ratios="ratios" :siren="siren"/>
          </v-flex>
          <v-flex md6 xs12>
            <GestionGraph :ratios="ratios" :chartOptions="chartOptions"/>
          </v-flex>
        </v-layout>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import axios from 'axios'
import PerformanceTable from "@/components/Finoscope/PerformanceTable.vue";
import PerformanceGraph from "@/components/Finoscope/PerformanceGraph.vue";
import SolvabiliteEtTresorerieTable from "@/components/Finoscope/SolvabiliteEtTresorerieTable.vue";
import SolvabiliteEtTresorerieGraph from "@/components/Finoscope/SolvabiliteEtTresorerieGraph.vue";
// import CompteDeResultatTable from "@/components/Finoscope/CompteDeResultatTable.vue";
// import CompteDeResultatGraph from "@/components/Finoscope/CompteDeResultatGraph.vue";
import GestionTable from "@/components/Finoscope/GestionTable.vue";
import GestionGraph from "@/components/Finoscope/GestionGraph.vue";


export default {
  name: 'Finoscope',
  components: {
    ResultatTable, ResultatGraph,
    SolvabiliteEtTresorerieTable, SolvabiliteEtTresorerieGraph,
    // CompteDeResultatTable, CompteDeResultatGraph,
    GestionTable, GestionGraph
  },
  props: ['siren'],
  data() {
    return {
      tab: null,
      axios: axios.create(),
      odsPayload: null,
      pastExerciceIndex: 1,
      chartOptions: {
        legend: {
          show: true,
          position: 'right',

        },
        theme: {
          palette: 'palette5',
        },
        chart: {
            fontFamily: 'Oswald',
            fontSize: '14px',

          toolbar: {
              show: false,
            },
          type: 'radar',
          width: '50%',
        },
        yaxis: {
          tickAmount: 3,
        },
        xaxis: {
          labels: {
            show: true,
            style: {
              fontSize: '14px',
              fontFamily: 'Oswald',
              colors: ['#444','#444','#444','#444','#444'],
            }
          }
        }
      }
    }
  },
  created() {
    if (process.env.VUE_APP_BILANS_ENABLED && !!JSON.parse(process.env.VUE_APP_BILANS_ENABLED)) {
      this.getBilansExercices()
    }
    this.getRatios()
  },
  methods: {
    sortRatios(ratio1, ratio2) {
      return (ratio1.dateClotureExercice.getTime() > ratio2.dateClotureExercice.getTime())?-1:1
    },
    roundAt(val, precision) {
      return Math.round(val*Math.pow(10,precision))/Math.pow(10,precision)
    },
    getRatios() {
      this.axios
          .get(process.env.VUE_APP_ODS_URL, this.odsParams)
          .then(r => {
            this.odsPayload = r.data
          })
          .catch(r => {
            alert("miss")
          })
    },
    exerciceFromDateCloture(dateClotureExercice) {
      if (dateClotureExercice.getMonth() < 6) {
        return dateClotureExercice.getFullYear() - 1
      } else {
        return dateClotureExercice.getFullYear()
      }
    },
    fieldsTransform(record) {
      if (record) {
        let fields = record.fields
        const dateClotureExercice = new Date(fields.date_cloture_exercice)
        return {
          dateClotureExercice: dateClotureExercice,
          exercice: this.exerciceFromDateCloture(dateClotureExercice),
          siren: fields.siren,
          performance: {
            chiffreDAffaires: this.roundAt(fields.chiffre_d_affaires, 1),
            margeCommerciale: this.roundAt(fields.marge_brute, 1),
            partCaMargeCommerciale: this.roundAt(fields.marge_brute/fields.chiffre_d_affaires*100, 1),
            ebe: this.roundAt(fields.ebe, 1),
            margeEBE: this.roundAt(fields.marge_ebe, 1),
            partCaEBE: this.roundAt(fields.ebe/fields.chiffre_d_affaires*100, 1),
            ebit: this.roundAt(fields.ebit, 1),
            partCaEbit: this.roundAt(fields.ebit/fields.chiffre_d_affaires*100, 1),
            resultatNet: this.roundAt(fields.resultat_net, 1),
            partCaResultatNet: this.roundAt(fields.resultat_net/fields.chiffre_d_affaires*100, 1),
          },
          solvabiliteEtTresorerie: {
            tauxDEndettement: this.roundAt(fields.taux_d_endettement,1),
            autonomieFinanciere: this.roundAt(fields.autonomie_financiere, 1),
            ratioDeVetuste: this.roundAt(fields.ratio_de_vetuste, 1),
            cafSurCA: this.roundAt(fields.caf_sur_ca, 1),
            capaciteDeRemboursement: this.roundAt(fields.capacite_de_remboursement, 1),
            ratioDeLiquidite: this.roundAt(fields.ratio_de_liquidite, 1),
          },
          gestion: {
            poidsBfrExploitation: this.roundAt(fields.poids_bfr_exploitation, 1),
            poidsBFRExploitationSurCAJours: this.roundAt(fields.poids_bfr_exploitation_sur_ca_jours, 1),
            rotationDesStocks: this.roundAt(fields.rotation_des_stocks_jours, 1),
            creditClients: this.roundAt(fields.credit_clients_jours, 1),
            creditFournisseurs: this.roundAt(fields.credit_fournisseurs_jours, 1),
          }
        }
      }
    },
  },
  computed: {
    odsURL() {
      return process.env.VUE_APP_ODS_URL
    },
    odsDataset() {
      return process.env.VUE_APP_ODS_DATASET
    },
    odsParams() {
      return {
        params: {
          q: encodeURI("siren="+this.siren),
          dataset: this.odsDataset
        },
      }
    },
    ratios() {
      if (this.odsPayload == null) {
        return []
      } else {
        return this.odsPayload.records
            .map(this.fieldsTransform)
            .filter(r => {
              return r.dateClotureExercice.getTime() > (new Date('2018-01-01')).getTime()
            })
            .sort(this.sortRatios)
      }
    },
  },
}
</script>