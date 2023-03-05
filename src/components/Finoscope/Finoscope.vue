<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab>Performance</v-tab>
      <v-tab>Bilan</v-tab>
      <v-tab>Compte de résultat</v-tab>
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
            <BilanTable :ratios="ratios" :siren="siren"/>
          </v-flex>
          <v-flex md6 xs12>
            <BilanGraph :ratios="ratios" :chartOptions="chartOptions"/>
          </v-flex>
        </v-layout>
      </v-tab-item>
      <v-tab-item>
        <v-layout mt-4 wrap width="100%">
          <v-flex md6 xs12>
            <CompteDeResultatTable :ratios="ratios" :siren="siren"/>
          </v-flex>
          <v-flex md6 xs12>
            <CompteDeResultatGraph :ratios="ratios" :chartOptions="chartOptions" :siren="siren"/>
          </v-flex>
        </v-layout>
      </v-tab-item>
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
import BilanTable from "@/components/Finoscope/BilanTable.vue";
import BilanGraph from "@/components/Finoscope/BilanGraph.vue";
import CompteDeResultatTable from "@/components/Finoscope/CompteDeResultatTable.vue";
import CompteDeResultatGraph from "@/components/Finoscope/CompteDeResultatGraph.vue";
import GestionTable from "@/components/Finoscope/GestionTable.vue";
import GestionGraph from "@/components/Finoscope/GestionGraph.vue";


export default {
  name: 'Finoscope',
  components: {
    PerformanceTable, PerformanceGraph,
    BilanTable, BilanGraph,
    CompteDeResultatTable, CompteDeResultatGraph,
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
            ebe: this.roundAt(fields.ebe, 1),
            ebit: this.roundAt(fields.ebit, 1),
            resultatNet: this.roundAt(fields.resultat_net, 1),
          },
          bilan: {
            tauxDEndettement: this.roundAt(fields.taux_d_endettement,1),
            ratioDeLiquidite: this.roundAt(fields.ratio_de_liquidite, 1),
            ratioDeVetuste: this.roundAt(fields.ratio_de_vetuste, 1),
            autonomieFinanciere: this.roundAt(fields.autonomie_financiere, 1),
            poidsBFRExploitationSurCA: this.roundAt(fields.poids_bfr_exploitation_sur_ca, 1),
          },
          compteDeResultat: {
            couvertureDesInterets: this.roundAt(fields.couverture_des_interets, 1),
            cafSurCA: this.roundAt(fields.caf_sur_ca, 1),
            capaciteRemboursement: this.roundAt(fields.capacite_de_remboursement, 1),
            margeEBE: this.roundAt(fields.marge_ebe, 1),
            resultatCourantAvantImpotsSurCA: this.roundAt(fields.resultat_courant_avant_impots_sur_ca, 1)
          },
          gestion: {
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
              return r.dateClotureExercice.getTime() > (new Date('2019-01-01')).getTime()
            })
            .sort(this.sortRatios)
      }
    },
  },
}
</script>


<style>
table {
  width: 100%;
  margin: 5px;
  border-collapse: collapse;
}

tr td {
  padding: 4px;
  text-align: right;
  font-family: Abel;
  font-size: 16gpx;
  padding: 5px;
}

tr th {
  padding: 4px;
  text-align: left;
}

tr:not(:first-child), td {
}

tr th:first-child {
  max-width: 200px;
}
table tr:not(:last-child) td, table tr:not(:last-child) th {
  border-bottom: 1px solid rgba(0,0,0,0.20);
}

table tr:nth-child(odd){
  background-color: rgba(0,0,0,0.03);
}

table tr:first-child td, table tr:first-child th {
  border-bottom: 2px solid rgba(0,0,0,0.20);
  background-color: rgba(0,0,0,0.08);
  text-align: center;
}

.negative {
  color: rgba(210,0,0,1);
}

.numerateur {
  text-align: center;
  border-bottom: 2px solid rgba(0,0,0,0.6);
}

.denominateur {
  text-align: center;
}

</style>