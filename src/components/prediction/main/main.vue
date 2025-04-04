<template>
  <div id="#detection" ref="detection">
    <v-app-bar
      app
      height="35px"
      class="toolbar elevation-12"
      color="#ffffff"
      extension-height="48px"
    >
      <v-icon
        @click="drawers.showLeft()"
        class="fa-rotate-180"
        v-if="!drawers.left"
        color="#ffffff"
        key="toolbar"
        >fa-bars</v-icon
      >

      <div
        style="width: 100%; display: flex; justify-content: center"
        class="toolbar_titre"
      >
        Détection - {{ currentBatch }}
        <Gitbook icon :target="gitbookPath('CIBLER_RECHERCHE')" />
      </div>
      <v-spacer></v-spacer>
      <v-icon
        :class="loading ? 'rotate' : ''"
        color="#ffffff"
        v-if="!drawers.right"
        @click="drawers.showRight()"
        >fa-satellite-dish</v-icon
      >
    </v-app-bar>
    <div class="mt-6">
      <div id="nodata" v-if="complete && prediction.length == 0">
        Les paramètres de filtrage ne font ressortir aucune des entreprises pour
        lesquelles vous êtes habilité(e).
      </div>
      <v-navigation-drawer
        :class="(drawers.right ? 'elevation-6' : '') + ' rightDrawer'"
        width="330"
        v-model="drawers.right"
        right
        app
      >
        <v-toolbar flat class="transparent" height="40">
          <v-icon :class="loading ? 'rotate' : ''" @click="drawers.hideRight()"
            >fa-satellite-dish</v-icon
          >
        </v-toolbar>
        <div class="mt-2" style="padding: 0 15px">
          <v-select
            :items="batches"
            v-model="currentBatchKey"
            @change="getPrediction"
            label="Liste de détection"
          ></v-select>
        </div>
        <v-divider class="mb-3" />
        <div style="vertical-align: middle; padding: 0 15px">
          <v-icon style="width: 30px; margin-right: 10px">fa-industry</v-icon>
          <span style="color: rgba(0, 0, 0, 0.54); font-size: 13px"
            >Secteur d'activité</span
          >
          <p />
          <span
            style="color: #f00; font-weight: 600"
            v-if="currentNaf.length == 0"
            >Aucun secteur sélectionné</span
          >
          <ul style="font-size: 11px" v-if="!allNaf">
            <li v-for="l in currentNafLibelle.slice(0, 4)" :key="l">{{ l }}</li>
          </ul>
          <span
            style="margin-left: 15px; font-size: 11px; color: #444"
            v-if="currentNaf.length > 4 && !allNaf"
            >+ {{ currentNaf.length - 4 }} autre{{
              currentNaf.length > 5 ? "s" : ""
            }}</span
          >
          <span
            style="margin-left: 15px; font-size: 11px; color: #444"
            v-if="allNaf"
            >Tout secteur confondu</span
          >
          <v-dialog v-model="nafDialog" persistent scrollable width="700">
            <template v-slot:activator="{ on }">
              <v-btn
                light
                color="rgba(0,0,0,0.74)"
                v-on="on"
                @click="copyNaf()"
                outlined
                class="mt-3 mx-3"
              >
                <v-icon small class="mr-2">fa-filter</v-icon>selection des
                secteurs
              </v-btn>
            </template>
            <v-card>
              <v-toolbar dark dense color="indigo">
                <v-toolbar-title
                  >Sélectionner les secteurs d'activité</v-toolbar-title
                >
              </v-toolbar>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon style="cursor: pointer" @click="selectAllNaf()">{{
                        allNextNaf ? "fa-square-xmark" : "fa-square-plus"
                      }}</v-icon> </v-list-item-action
                    >{{
                      !allNextNaf ? "Tout sélectionner" : "Tout désélectionner"
                    }}
                    <v-list-item-content></v-list-item-content>
                  </v-list-item>
                  <v-divider />
                  <v-list-item v-for="n in naf1" :key="n.value">
                    <v-list-item-action @click="toggleNaf(n.value)">
                      <v-icon style="cursor: pointer">
                        {{
                          nextNaf.includes(n.value)
                            ? "fa-square-check"
                            : "far fa-square"
                        }}
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>{{ n.text }}</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions class="pa-2 elevation-6">
                <v-spacer />
                <v-btn light color="indigo" outlined @click="nafDialog = false"
                  >annuler</v-btn
                >
                <v-btn
                  light
                  color="indigo"
                  dark
                  @click="
                    applyNaf();
                    nafDialog = false;
                  "
                  >appliquer</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <v-list three-line>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox
                v-model="excludeSecteursCovid"
                @change="getPrediction()"
              ></v-checkbox>
            </v-list-item-action>
            <v-list-item-content
              @click="() => filterPrediction('excludeSecteursCovid')"
            >
              <v-list-item-title>Hors secteurs COVID-19</v-list-item-title>
              <v-list-item-subtitle
                >Exclure les entreprises appartenants aux secteurs dits COVID-19
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider class="mb-3" />
        <div
          style="
            display: flex;
            flex-direction: row;
            vertical-align: middle;
            padding: 0 15px;
          "
        >
          <v-icon style="width: 30px; margin-right: 10px">fa-map</v-icon>
          <v-select
            :items="subzones"
            v-model="zone"
            label="Zones Géographiques"
            @change="getPrediction()"
          ></v-select>
        </div>
        <v-divider class="mb-3" />
        <div
          style="
            display: flex;
            flex-direction: row;
            vertical-align: middle;
            padding: 0 15px;
          "
        >
          <v-icon style="width: 30px; margin-right: 10px">fa-coins</v-icon>
          <v-text-field
            v-model="caMin"
            label="Chiffre d'affaires min"
            suffix="k€"
            @change="getPrediction()"
          ></v-text-field>
        </div>
        <v-divider class="mb-3" />
        <div
          style="
            display: flex;
            flex-direction: row;
            vertical-align: middle;
            padding: 0 15px;
          "
        >
          <v-icon style="width: 30px; margin-right: 10px">fa-users</v-icon>
          <v-combobox
            v-model="minEffectif"
            :items="effectifClass"
            label="Effectif min de l'entreprise"
            @change="getPrediction()"
          ></v-combobox>
        </div>
        <v-divider class="mb-3" />
        <div
          style="
            display: flex;
            flex-direction: column;
            vertical-align: middle;
            padding: 0 15px;
          "
        >
          <span style="font-size: 15px" @change="getPrediction()"
            >Visibilité selon statut des procédures</span
          >
          <v-select
            ref="procol"
            v-model="procol"
            :items="procolItems"
            :menu-props="{ maxHeight: 400 }"
            multiple
            chips
            @blur="getPrediction()"
          >
            <template v-slot:append-item>
              <div class="text-center my-2">
                <v-btn
                  @click="$refs.procol.isMenuActive = false"
                  color="primary"
                  >OK</v-btn
                >
              </div>
            </template>
          </v-select>
        </div>
        <v-list three-line>
          <v-list-item> Filtres avancés </v-list-item>
          <v-list-item :disabled="!allowedBatches.includes(currentBatch)">
            <v-list-item-action>
              <v-checkbox
                v-model="codefiListOnly"
                @change="getPrediction()"
              ></v-checkbox>
            </v-list-item-action>
            <v-list-item-content
              @click="() => filterPrediction('codefiListOnly')"
            >
              <v-list-item-title
                >Liste retraitée par la DGFIP</v-list-item-title
              >
              <v-list-item-subtitle class="long-subtitle">
                {{
                  allowedBatches.includes(currentBatch)
                    ? "Affiche uniquement la liste transmise au CDED en amont de la réunion du CODEFI"
                    : `Filtre inactif en raison de l\'absence de retraitement DGFIP correspondant à la liste de ${currentBatch}`
                }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox
                v-model="firstAlert"
                @change="getPrediction()"
              ></v-checkbox>
            </v-list-item-action>
            <v-list-item-content @click="() => filterPrediction('firstAlert')">
              <v-list-item-title>Premières alertes</v-list-item-title>
              <v-list-item-subtitle
                >Affiche uniquement les premières alertes</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox
                v-model="hasntDelai"
                @change="getPrediction()"
              ></v-checkbox>
            </v-list-item-action>
            <v-list-item-content @click="() => filterPrediction('hasntDelai')">
              <v-list-item-title
                >Sans délai de paiement URSSAF</v-list-item-title
              >
              <v-list-item-subtitle
                >Affiche uniquement les entreprises dont les établissement sont
                sans délai de paiement urssaf en cours</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox
                v-model="creationDateThreshold"
                @change="getPrediction()"
              ></v-checkbox>
            </v-list-item-action>
            <v-list-item-content
              @click="() => filterPrediction('creationDateThreshold')"
            >
              <v-list-item-title>Sans entreprises récentes</v-list-item-title>
              <v-list-item-subtitle>
                Affiche uniquement les entreprises créées avant le {{ twoYearsBeforeLastList() }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-tooltip left v-if="isIgnoreZoneDisabled">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item class="disabled-item" v-bind="attrs" v-on="on">
                <v-list-item-action>
                  <v-checkbox
                    :disabled="true"
                    v-model="ignorezone"
                  ></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title
                    >Implantations dans ma zone</v-list-item-title
                  >
                  <v-list-item-subtitle
                    >Inclure les sièges dont certains établissements sont dans
                    ma zone</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </template>
            <span
              >Ce filtre ne peut être utilisé que si la zone géographique 'Ma zone' est
              sélectionnée</span
            >
          </v-tooltip>

          <v-list-item v-else>
            <v-list-item-action>
              <v-checkbox
                v-model="ignorezone"
                @change="getPrediction()"
              ></v-checkbox>
            </v-list-item-action>
            <v-list-item-content @click="() => filterPrediction('ignorezone')">
              <v-list-item-title>Implantations dans ma zone</v-list-item-title>
              <v-list-item-subtitle
                >Inclure les sièges dont certains établissements sont dans ma
                zone</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>

          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-list-item :disabled="true" class="disabled-item" v-bind="attrs" v-on="on">
                <v-list-item-action>
                  <v-checkbox
                    v-model="inclureEtablissementsFermes"
                    @change="getPrediction()"
                  ></v-checkbox>
                </v-list-item-action>
                <v-list-item-content
                  @click="() => filterPrediction('inclureEtablissementsFermes')"
                >
                  <v-list-item-title>Établissements fermés</v-list-item-title>
                  <v-list-item-subtitle
                    >Inclure les établissements fermés</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </template>
            <span
            >Ce filtre est temporairement désactivé</span
            >
          </v-tooltip>
        </v-list>
      </v-navigation-drawer>
    </div>
    <v-card
      style="
        height: 80px;
        text-align: center;
        vertical-align: top;
        background-color: #fff0;
      "
      class="elevation-0 ma-2 pointer"
    >
      <v-container style="position: relative">
        <v-layout row>
          <v-flex xs12 md6>
            <v-text-field
              v-model="filter"
              @input="getPrediction"
              solo
              label="Filtre rapide par raison sociale ou SIREN"
              clearable
            />
          </v-flex>
          <v-flex xs12 md6 style="line-height: 53px">
            <v-icon style="top: -4px" color="red darken-2"
              >fa-exclamation-triangle</v-icon
            >
            <span style="font-size: 25px">{{ predictionAlerts }}</span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <v-icon style="top: -4px" color="amber darken-2"
              >fa-exclamation-triangle</v-icon
            >
            <span style="font-size: 25px">{{ predictionWarnings }}</span>
            <v-btn
              :disabled="downloadingExport"
              outlined
              color="indigo"
              @click="download"
              class="ml-4 mb-3"
            >
              <v-progress-circular
                indeterminate
                color="white"
                v-if="downloadingExport"
                size="24"
                width="3"
              ></v-progress-circular>
              <v-icon v-else small class="mr-2">fa-file-download</v-icon>
              Exporter
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <div class="pa-4" v-if="activeFilters.length">
      <span class="subheading">Filtres actifs :</span>
      <a
        v-if="!drawers.right"
        @click.prevent="drawers.showRight"
        style="cursor: pointer"
      >
        <v-icon small class="mr-2">fa-filter</v-icon>Modifier
      </a>
      <v-chip-group column>
        <v-chip v-for="(filter, index) in activeFilters" :key="index" small>
          {{ filter }}
        </v-chip>
      </v-chip-group>
    </div>
    <PredictionWidget
      v-for="p in prediction"
      :key="p.siret"
      :prediction="p"
      @hide-etablissement="onHideEtablissement"
      @follow-etablissement="followStateChanged = true"
      @unfollow-etablissement="followStateChanged = true"
    />
    <Spinner style="min-height: 60vh" v-if="loading" />
    <v-snackbar
      v-if="currentBatchDescription"
      v-model="snackbar"
      :bottom="true"
    >
      Le modèle de détection a évolué !
      <v-btn
        style="text-transform: none"
        color="primary"
        text
        @click="showModelHelp()"
        >En savoir plus</v-btn
      >
      <v-btn icon @click="snackbar = false"><v-icon>clear</v-icon></v-btn>
    </v-snackbar>
  </div>
</template>

<script src="./script.js" />
<style src="./style.css" scoped />
