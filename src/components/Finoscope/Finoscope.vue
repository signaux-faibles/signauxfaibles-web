<template>
  <div>
    <div v-if="ready && nodata">
      <v-layout mt-4 wrap style="font-size: 17px">
        <v-flex xs12>
          <div class="px-12 ma-12" style="text-align: center;">
            Il n'existe pas de donnée financière publique pour cette entreprise.<br/>
            <v-icon size="100" color="#ccc" class="ma-12">fa-low-vision</v-icon>
          </div>
        </v-flex>
      </v-layout>

    </div>
    <div style="height: 400px" v-if="!ready && !nodata">
      <Spinner style=""/>
    </div>
    <div v-if="ready && !nodata">
    <v-tabs v-model="tab" v-if="ready">
      <v-tab @click="trackMatomoEvent('finoscope', 'performance_table', siren)">Performance</v-tab>
      <v-tab @click="trackMatomoEvent('finoscope', 'solvabilite_tresorerie_table', siren)">Solvabilité et Trésorerie</v-tab>
      <v-tab @click="trackMatomoEvent('finoscope', 'gestion_table', siren)">Gestion</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-layout mt-4 wrap width="100%">
          <v-flex md12>
            <PerformanceTable :ratios="[...ratios]" :siren="siren"/>
          </v-flex>
          <v-flex md12>
            <PerformanceGraph :ratios="[...ratios]" :siren="siren" :sectors="sectors" :naf="naf"/>
          </v-flex>
        </v-layout>
      </v-tab-item>
      <v-tab-item>
        <v-layout mt-4 wrap width="100%">
          <v-flex md12>
            <SolvabiliteEtTresorerieTable :ratios="[...ratios]" :siren="siren"/>
          </v-flex>
          <v-flex md12>
            <SolvabiliteEtTresorerieGraph :ratios="[...ratios]" :siren="siren" :sectors="sectors" :naf="naf"/>
          </v-flex>
        </v-layout>
      </v-tab-item>
      <v-tab-item>
        <v-layout mt-4 wrap width="100%">
          <v-flex md12>
            <GestionTable :ratios="[...ratios]" :siren="siren"/>
          </v-flex>
          <v-flex md12>
            <GestionGraph :ratios="[...ratios]" :siren="siren" :sectors="sectors" :naf="naf"/>
          </v-flex>
        </v-layout>
      </v-tab-item>
    </v-tabs-items>
    <DataSource :siren="siren"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import PerformanceTable from "@/components/Finoscope/PerformanceTable.vue";
import PerformanceGraph from "@/components/Finoscope/PerformanceGraph.vue";
import SolvabiliteEtTresorerieTable from "@/components/Finoscope/SolvabiliteEtTresorerieTable.vue";
import SolvabiliteEtTresorerieGraph from "@/components/Finoscope/SolvabiliteEtTresorerieGraph.vue";
import GestionTable from "@/components/Finoscope/GestionTable.vue";
import GestionGraph from "@/components/Finoscope/GestionGraph.vue";
import DataSource from "@/components/Finoscope/DataSource.vue"
import Spinner from "@/components/Spinner.vue"

export default {
  name: 'Finoscope',
  components: {
    PerformanceTable, PerformanceGraph,
    SolvabiliteEtTresorerieTable, SolvabiliteEtTresorerieGraph,
    GestionTable, GestionGraph,
    DataSource, Spinner
  },
  props: ['siren', 'naf'],
  data() {
    return {
      nodata: false,
      ready: false,
      tab: null,
      axios: axios.create(),
      odsRatiosPayload: null,
      odsSectorsPayload: null,
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
  },
  mounted() {
    this.getRatios()
  },
  methods: {
    sortRatios(exercice1, exercice2) {
      return (exercice1.dateClotureExercice.getTime() < exercice2.dateClotureExercice.getTime())?1:-1
    },
    sortSectorsCohorte(sectors1, sectors2) {
      return (sectors1.cohorte < sectors2.cohorte)?-1:1
    },
    sortSectorsCA(sectors1, sectors2) {
      return (sectors1.classeCA > sectors2.classeCA)?-1:1
    },
    filterSectors(element, index, array) {
      return (index == array.findIndex(a => a.classeCA != '*') || index == array.findIndex(a => a.classeCA == '*'))
    },
    roundAt(val, precision) {
      return Math.round(val*Math.pow(10,precision))/Math.pow(10,precision)
    },
    quantiles(fields, field) {
      return [
        fields[field+'_q10'],
        fields[field+'_q25'],
        fields[field+'_q50'],
        fields[field+'_q75'],
        fields[field+'_q90'],
      ]
    },
    getRatios() {
      this.axios
          .get(this.odsRatiosURL, this.odsRatiosParams)
          .then(r => {
            this.odsRatiosPayload = r.data

            if (this.ratios.length < 1) {
              this.ready = true
              this.nodata = true
              return
            }
            this.getSectors()
          })


    },
    getSectors() {
      this.axios
          .get(this.odsSectorsURL, this.odsSectorsParams)
          .then(r => {
            this.odsSectorsPayload = r.data
            this.ready = true
            this.trackMatomoEvent('finoscope', 'performance_table', this.siren)
          })
          .catch(r => {
            alert('error loading sectors: ' + JSON.stringify(r))
          })
    },
    exerciceFromDateCloture(dateClotureExercice) {
      if (dateClotureExercice.getMonth() < 6) {
        return dateClotureExercice.getFullYear() - 1
      } else {
        return dateClotureExercice.getFullYear()
      }
    },
    sectorsTransform(record) {
      if (record) {
        const fields = record.record.fields
        return {
          classeCA: fields.classe_ca,
          classeNAF: fields.classe_naf,
          exercice: fields.exercice,
          cohorte: fields.cohorte,
          performance: {
            margeCommerciale: this.quantiles(fields, 'part_ca_marge_brute'),
            ebe: this.quantiles(fields, 'part_ca_ebe'),
            ebit: this.quantiles(fields, 'part_ca_ebit'),
            resultatNet: this.quantiles(fields, 'part_ca_resultat_net'),
          },
          solvabiliteEtTresorerie: {
            tauxDEndettement: this.quantiles(fields, 'taux_d_endettement'),
            autonomieFinanciere: this.quantiles(fields, 'autonomie_financiere'),
            ratioDeVetuste: this.quantiles(fields, 'ratio_de_vetuste'),
            cafSurCA: this.quantiles(fields, 'caf_sur_ca'),
            capaciteDeRemboursement: this.quantiles(fields, 'capacite_de_remboursement'),
            ratioDeLiquidite: this.quantiles(fields, 'ratio_de_liquidite'),
          },
          gestion: {
            poidsBfrExploitation: this.quantiles(fields, 'poids_bfr_exploitation'),
            poidsBfrExploitationSurCAJours: this.quantiles(fields, 'poids_bfr_exploitation_sur_ca_jours'),
            rotationDesStocks: this.quantiles(fields, 'rotation_des_stocks_jours'),
            creditClients: this.quantiles(fields, 'credit_clients_jours'),
            creditFournisseurs: this.quantiles(fields, 'credit_fournisseurs_jours'),
          }
        }
      }
    },
    ratiosTransform(record) {
      if (record) {
        let fields = record.record.fields
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
            poidsBfrExploitationSurCAJours: this.roundAt(fields.poids_bfr_exploitation_sur_ca_jours, 1),
            rotationDesStocks: this.roundAt(fields.rotation_des_stocks_jours, 1),
            creditClients: this.roundAt(fields.credit_clients_jours, 1),
            creditFournisseurs: this.roundAt(fields.credit_fournisseurs_jours, 1),
          }
        }
      }
    },
  },
  computed: {
    lastExercice() {
      if (this.ratios.length > 0) {return this.ratios[0].exercice}
    },
    classeCA() {
      if (this.ratios.length > 0) {
        const chiffreDAffaires = this.ratios[0].performance.chiffreDAffaires
        if (chiffreDAffaires < 2000000) {
          return '<2M'
        } else if (chiffreDAffaires < 10000000) {
          return '2M-10M'
        } else if (chiffreDAffaires < 50000000) {
          return '10M-50M'
        } else if (chiffreDAffaires >= 50000000) {
          return '>50M'
        } else {
          return '*'
        }
      }
    },
    odsSectorsParams() {
      const where = "(classe_naf='*' or " +
          "classe_naf='" + this.naf.codeSecteur + "' or " +
          "classe_naf='" + this.naf.codeActivite.slice(0,2) + "' or " +
          "classe_naf='" + this.naf.codeActivite.slice(0,3) + "' or " +
          "classe_naf='" + this.naf.codeActivite.slice(0,4) + "' or " +
          "classe_naf='" + this.naf.codeActivite + "') and " +
          "(classe_ca='*' or classe_ca='" + this.classeCA + "') and exercice=" + this.lastExercice
      return {
        params: {
          limit: 50,
          where: where
        }
      }
    },
    odsRatiosParams() {
      return {
        params: {
          where: "siren='"+this.siren+"'"
        },
      }
    },
    odsURL() {
      return process.env.VUE_APP_ODS_URL
    },
    odsRatiosURL() {
      return this.odsURL + "/api/v2/catalog/datasets/" + this.odsRatiosDataset + "/records"
    },
    odsSectorsURL() {
      return this.odsURL + "/api/v2/catalog/datasets/" + this.odsSectorsDataset + "/records"
    },
    odsRatiosDataset() {
      return process.env.VUE_APP_ODS_RATIOS_DATASET
    },
    odsSectorsDataset() {
      return process.env.VUE_APP_ODS_SECTORS_DATASET
    },
    ratios() {
      if (this.odsRatiosPayload == null) {
        return []
      } else {
        return this.odsRatiosPayload.records
            .map(this.ratiosTransform)
            .sort((exercice1, exercice2) => {
          return (exercice1.dateClotureExercice.getTime() < exercice2.dateClotureExercice.getTime())?1:-1
            }).slice(0,5)
      }
    },
    sectors() {
      if (this.odsSectorsPayload == null) {
        return []
      } else {
        return this.odsSectorsPayload.records
            .map(this.sectorsTransform)
            .sort(this.sortSectorsCohorte)
            .filter(this.filterSectors)
            .sort(this.sortSectorsCA)
      }
    },
  },
}
</script>