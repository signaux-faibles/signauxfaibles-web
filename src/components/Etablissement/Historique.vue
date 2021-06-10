<template>
  <div>
    <h2>
      Détection Signaux Faibles
      <Help titre="Détection Signaux Faibles">
        <template>
          <p>En premier lieu, c’est le risque de défaillance à 18 mois estimé lors de la production de la dernière liste de détection qui vous est présenté.<br />
          Son calcul est basé sur des éléments structurels non affectés par la crise et sur des règles métier conjoncturelles.<br />
          Lorsque ce risque existe, nous l’expliquons par les données ayant le plus influencé ce résultat.<br />
          Un graphique sous la forme d’un radar vous permettra de rapidement juger du positionnement (risque élevé rouge en périphérie) de l’établissement pour chaque thématique de données.<br />
          Vous avez également la possibilité de consulter l’historique des alertes qui synthétise toutes les listes de détection sur lesquelles l’établissement est apparu.</p>
          <p>Notez que cet espace est très dépendant de vos habilitations. Par conséquent, les détections émanant d’une zone géographique en dehors de vos attributions nécessiteront que vous suiviez l’établissement.</p>
        </template>
      </Help>
    </h2>
    <v-layout wrap>
      <v-flex xl6 lg12 mb-2>
        <div class="mb-3">
          <span class="mr-2"><ScoreWidget size="25px" :prediction="summary" class="mr-1" /> {{ dernierBatch.text }}</span>
          <v-tooltip bottom v-if="summary.firstAlert === true">
            <template v-slot:activator="{ on, attrs }">
              <v-chip v-bind="attrs" v-on="on" class="ma-0 chip" small color="primary" text-color="white">1re alerte</v-chip>
            </template>
            <span>Cet établissement est pour la première fois en alerte sur une liste de détection</span>
          </v-tooltip>
        </div>
        <div style="font-size: 16px">
          <div v-if="permScore">
            <div v-if="summary.alert == null">
              Cet établissement ne faisait pas partie du périmètre de Signaux Faibles au moment de la production de cette liste de détection.
            </div>
            <div v-if="summary.alert === 'Pas d\'alerte'">
              Cet établissement n’a pas été identifié par l’algorithme comme étant à risque de défaillance à 18 mois.
            </div>
            <div v-if="summary.alert === 'Alerte seuil F2'">
              Cet établissement a été identifié par l’algorithme comme étant à risque modéré de défaillance à 18 mois{{ alertSuffix(dernierScore) }}
              <ul v-if="selectConcerning(dernierScore)">
                <li v-for="c in selectConcerning(dernierScore)" :key="c[1]"><em>{{ libelleMicro(c[1]) }}</em> ({{ libelleMacro(c[0]) }})</li>
              </ul>
            </div>
            <div v-if="summary.alert === 'Alerte seuil F1'">
              Cet établissement a été identifié par l’algorithme comme étant à risque élevé de défaillance à 18 mois{{ alertSuffix(dernierScore) }}
              <ul v-if="selectConcerning(dernierScore)">
                <li v-for="c in selectConcerning(dernierScore)" :key="c[1]"><em>{{ libelleMicro(c[1]) }}</em> ({{ libelleMacro(c[0]) }})</li>
              </ul>
            </div>
            <div v-if="dernierScore.alertPreRedressements != summary.alert && (dernierScore.redressements || []).includes('detteUrssaf')">Ce risque a été réévalué à la hausse car l’établissement présente une augmentation significative de la dette Urssaf entre juillet 2020 et janvier 2021.</div>
          </div>
          <div v-else>
            <div v-if="roles.includes('score')">Veuillez suivre cet établissement pour consulter ses données de détection.</div>
            <div v-else>Vous n’êtes pas autorisé(e) à consulter les données de détection.</div>
          </div>
        </div>
      </v-flex>
      <v-flex xl6 lg12 mt-2>
        <apexchart
          v-if="permScore && dernierScore && dernierScore.macroRadar && Object.keys(dernierScore.macroRadar).length > 2 && (summary.alert === 'Alerte seuil F1' || summary.alert === 'Alerte seuil F2')"
          type="radar"
          height="200"
          :options="macroOptions(dernierScore)"
          :series="series(dernierScore)"
        ></apexchart>
      </v-flex>
      <v-btn v-if="permScore && historique.length > 1" outline small dark color="indigo" @click="historiqueDialog = true">Voir historique des alertes</v-btn>
      <v-dialog v-model="historiqueDialog" @input="historiqueDialog = false" max-width="500px">
        <div>
          <v-card>
            <v-card-title class="headline">
              Historique des alertes
            </v-card-title>
            <v-card-text style="font-size: 16px; font-weight: 800; font-family: 'Oswald', sans;">
              <v-expansion-panel>
                <v-expansion-panel-content
                  v-for="h in historique"
                  :key="h.idListe"
                >
                  <template v-slot:header>
                    <div><ScoreWidget size="25px" :prediction="h" class="mr-1" /> {{ h.idListe }}</div>
                  </template>
                  <v-card>
                    <v-card-text>
                      <div v-if="h.alert == null" >
                        Cet établissement ne faisait pas partie du périmètre de Signaux Faibles au moment de la production de cette liste de détection.
                      </div>
                      <div v-if="h.alert === 'Pas d\'alerte'">
                        Cet établissement n’a pas été identifié par l’algorithme comme étant à risque de défaillance à 18 mois.
                      </div>
                      <div v-if="h.alert === 'Alerte seuil F2'">
                        Cet établissement a été identifié par l’algorithme comme étant à risque modéré de défaillance à 18 mois{{ alertSuffix(h) }}
                        <ul v-if="selectConcerning(h)" style="list-style-type: disc">
                          <li v-for="c in selectConcerning(h)" :key="c[1]"><em>{{ libelleMicro(c[1]) }}</em> ({{ libelleMacro(c[0]) }})</li>
                        </ul>
                      </div>
                      <div v-if="h.alert === 'Alerte seuil F1'">
                        Cet établissement a été identifié par l’algorithme comme étant à risque élevé de défaillance à 18 mois{{ alertSuffix(h) }}
                        <ul v-if="selectConcerning(h)" style="list-style-type: disc">
                          <li v-for="c in selectConcerning(h)" :key="c[1]"><em>{{ libelleMicro(c[1]) }}</em> ({{ libelleMacro(c[0]) }})</li>
                        </ul>
                      </div>
                      <div class="mt-4">
                        <apexchart
                          v-if="h.macroRadar && Object.keys(h.macroRadar).length > 2 && (h.alert === 'Alerte seuil F1' || h.alert === 'Alerte seuil F2')"
                          type="radar"
                          height="200"
                          :options="macroOptions(h)"
                          :series="series(h)"
                        ></apexchart>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="historiqueDialog = false">Fermer</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import ScoreWidget from '@/components/ScoreWidget.vue'
import Help from '@/components/Help.vue'
import libellesVariablesScores from '@/assets/libelles_variables_scores.json'

export default {
  name: 'Historique',
  props: ['historique', 'summary'],
  components: { ScoreWidget, Help },
  data() {
    return {
      variablesMacro: ['activite_partielle', 'dette_urssaf', 'retards_paiement', 'sante_financiere'],
      historiqueDialog: false,
    }
  },
  methods: {
    libelleMicro(variable) {
      return libellesVariablesScores.micro[variable]
    },
    libelleMacro(variable) {
      return libellesVariablesScores.macro[variable]
    },
    series(h) {
      return [{
        data: this.variablesMacro.reduce((data, v) => {
          if (h.macroRadar.hasOwnProperty(v)) {
            data.push(h.macroRadar[v])
          }
          return data
        }, []),
      }]
    },
    macroOptions(h) {
      const xaxis = {
        xaxis: {
          categories: this.variablesMacro.reduce((categories, v) => {
            if (h.macroRadar.hasOwnProperty(v)) {
              categories.push(this.libelleMacro(v))
            }
            return categories
          }, []),
        },
      }
      return {...this.options, ...xaxis}
    },
    selectConcerning(h) {
      return ((h || {}).explSelection || {}).selectConcerning
    },
    alertSuffix(h) {
      return this.selectConcerning(h) ?
        ', principalement en raison des données suivantes :' : '.'
    },
  },
  computed: {
    options() {
      return {
        chart: {
          type: 'radar',
          toolbar: {
            show: false,
          },
        },
        colors: ['#999'],
        fill: {
          opacity: 0,
        },
        stroke: {
          show: true,
          width: 2,
        },
        markers: {
          size: 0,
        },
        yaxis: {
          show: false,
          tickAmount: 5,
          max: 1,
        },
        plotOptions: {
          radar: {
            size: 75,
            polygons: {
              strokeColors: ['#f67577', '#f9c16b', '#eeedaa', '#b9e69f', '#8ec07e'],
              fill: {
                colors: ['#f67577', '#f9c16b', '#eeedaa', '#b9e69f', '#8ec07e'],
              },
            },
          },
        },
        legend: {
          show: true,
        },
      }
    },
    permScore() {
      return this.summary.hasOwnProperty('permScore') ? this.summary.permScore : true
    },
    dernierScore() {
      return this.historique[0]
    },
    batches() {
      const batches = this.$store.getters.batches
      return batches
    },
    dernierBatch() {
      return this.batches[0]
    },
  },
}
</script>
<style scoped>
.chip {
  font-family: "Roboto";
  font-size: 13px;
  font-weight: 400;
  vertical-align: text-bottom;
}
</style>