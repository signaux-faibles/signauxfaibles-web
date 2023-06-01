<template>
  <div>
    <v-app-bar app
               class="toolbar elevation-12"
               color="#ffffff"
               extension-height="48px"
               height="35px"
    >
      <v-icon
          v-if="!leftDrawer"
          key="toolbar"
          class="fa-rotate-180"
          color="#ffffff"
          @click="openLeftDrawer()"
      >mdi-backburger
      </v-icon>
      <div
          class="toolbar_titre"
          style="width: 100%; text-align: center;"
      >
        <span style="display: inline-flex">
          Suivi d'établissements
          <Gitbook icon :target="gitbookPath('SUIVI')"/>
        </span>
      </div>
      <v-spacer></v-spacer>
      <v-icon
          v-if="wekanUser && !rightDrawer"
          :class="loading?'rotate':''"
          color="#ffffff"
          @click="openRightDrawer()"
      >mdi-target
      </v-icon>
    </v-app-bar>
    <div style="width:100%">
      <v-navigation-drawer
          v-model="rightDrawer"
          :class="((rightDrawer)?'elevation-6':'') + ' rightDrawer'"
          app
          right
          transition="no-transition"
      >
        <v-toolbar class="transparent" flat height="40">
          <v-icon :class="loading?'rotate':''" @click="closeRightDrawer()">mdi-target</v-icon>
        </v-toolbar>

        <div class="mt-2" style="display: flex; flex-direction: column; vertical-align: middle; padding: 0 15px;">
          <v-select
              ref="boardMenu"
              v-model="boards"
              :disabled="type === 'no-card'"
              :items="boardsItems"
              :menu-props="{ maxHeight: 400 }"
              chips
              label="Tableaux de suivi"
              multiple
              prepend-icon="fab fa-trello"
              @change="debounce(clearAndGetFollowedEtablissements, 500)"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip small>
                {{ item.text }}
              </v-chip>
            </template>
            <template v-slot:append-item>
              <div class="text-center my-2">
                <v-btn color="primary" @click="$refs.listsMenu.isMenuActive = false">OK</v-btn>
              </div>
            </template>
          </v-select>
        </div>
        <v-divider class="mb-3"/>
        <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;">
          <v-select
              v-model="zone"
              :items="zoneItems"
              label="Départements"
              multiple
              prepend-icon="mdi-map-marker"
              @change="debounce(getFollowedEtablissements, 500)"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip small>
                {{ item.short }}
              </v-chip>
            </template>
          </v-select>
        </div>
        <v-divider class="mb-3"/>
        <div class="mt-2" style="display: flex; flex-direction: column; vertical-align: middle; padding: 0 15px;">
          <v-select
              ref="listsMenu"
              v-model="lists"
              :disabled="type === 'no-card'"
              :items="listsItems"
              :menu-props="{ maxHeight: 400 }"
              chips
              label="Statut"
              multiple
              prepend-icon="mdi-playlist-check"
              @change="debounce(getFollowedEtablissements, 500)"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip small>
                {{ item.text }}
              </v-chip>
            </template>
            <template v-slot:append-item>
              <div class="text-center my-2">
                <v-btn color="primary" @click="$refs.listsMenu.isMenuActive = false">OK</v-btn>
              </div>
            </template>
          </v-select>
        </div>
        <v-divider class="mb-3"/>
        <div class="mt-2" style="display: flex; flex-direction: column; vertical-align: middle; padding: 0 15px;">
          <v-select
              ref="labelMenu"
              v-model="labels"
              :disabled="type === 'no-card'"
              :items="labelItems"
              :menu-props="{ maxHeight: 400 }"
              chips
              label="Étiquettes"
              multiple
              prepend-icon="mdi-label"
              style="margin-bottom: -30px"
              @change="debounce(getFollowedEtablissements,500)"
          >
            <template v-if="labels.length > 0" v-slot:prepend-inner>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" @click="resetLabels" v-on="on">
                    mdi-close
                  </v-icon>
                </template>
                Réinitialiser la sélection
              </v-tooltip>
            </template>
            <template v-slot:selection="{ item, index }">
              <v-chip :color="item.background" :text-color="item.front" small>
                {{ item.text }}
              </v-chip>
            </template>
            <template v-slot:item="{ active, item, attrs, on }">
              <v-chip :color="item.background" :text-color="item.front">{{ item.text }}</v-chip>
            </template>
            <template v-slot:append-item>
              <div class="text-center my-2">
                <v-btn color="primary" @click="$refs.labelMenu.isMenuActive = false">OK</v-btn>
              </div>
            </template>
          </v-select>
          <div>
            <v-radio-group
                v-model="labelMode"
                :disabled="labels.length<2"
                @change="getFollowedEtablissements"
            >
              <v-radio
                  value="and"
                  label="Toutes les étiquettes"
              />
              <v-radio
                  value="or"
                  label="Au moins une étiquette"
              />
            </v-radio-group>
          </div>
        </div>
        <v-divider class="mb-3"/>
        <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;">
          <v-text-field label="raison sociale" v-model="raisonSociale" @keydown="debounce(getFollowedEtablissements, 500)"/>
        </div>
        <v-divider class="mb-3"/>
        <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;">
          <v-dialog
              ref="menuSince"
              v-model="menuSince"
              :return-value.sync="since"
              persistent
              width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="since"
                  clearable
                  label="Modifiée depuis"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  @click:clear="() => {since=null; debounce(getFollowedEtablissements, 500)}"
              ></v-text-field>
            </template>
            <v-date-picker
                v-model="since"
                locale="fr"
                scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                  color="primary"
                  text
                  @click="menuSince = false"
              >
                Cancel
              </v-btn>
              <v-btn
                  color="primary"
                  text
                  @click="$refs.menuSince.save(since)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </div>
      </v-navigation-drawer>
    </div>
    <v-layout column fill-height style="font-weight: normal">
      <v-flex v-if="wekanUser" pt-3 shrink text-center>
        <v-btn-toggle v-model="type" mandatory @change="getFollowedEtablissements">
          <v-btn text value="my-cards">Mes cartes de suivi</v-btn>
          <v-btn text value="all-cards">Toutes les cartes</v-btn>
          <v-btn @click="boards = ['*']" text value="no-card">Mon suivi sans carte</v-btn>
        </v-btn-toggle>
      </v-flex>
      <v-flex grow px-2>
        <div v-if="!loading && etablissements.length === 0 && init === false" id="nodata">
          <div v-if="wekanUser">
            Vous ne suivez aucun établissement ou aucun établissement suivi ne correspond à vos critères de
            filtrage.<br/>
          </div>
          <div v-else>Vous ne suivez pour le moment aucun établissement.<br/>Pour ce faire,
            rendez-vous sur la fiche d'un établissement et appuyez sur le bouton
            Suivre.<br/>Pour un import massif d'établissements, contactez-nous par email :<br/>
            <a href="mailto:contact@signaux-faibles.beta.gouv.fr?subject=Import massif d'établissements"
               target="_blank"><code>contact@signaux-faibles.beta.gouv.fr</code></a></div>
        </div>
        <div v-if="etablissements.length > 0" class="py-3 px-3 text-center">
          <span v-if="wekanUser && type==='my-cards'" class="intro">
              Vous suivez {{
                this.followPayload.stats.count | pluralizeEtablissement }}
              associés à des cartes dont vous êtes le créateur ou un des participants selon les filtres sélectionnés.
          </span>
          <span v-if="wekanUser && type==='all-cards'" class="intro">
              Le ou les tableaux régionaux auxquels vous êtes habilités référencent {{
                this.followPayload.stats.count | pluralizeEtablissement
              }} selon les filtres sélectionnés.
          </span>
          <span v-if="wekanUser && type==='no-card'"
                class="intro">Vous suivez {{ this.followPayload.stats.count | pluralizeEtablissement }} associés à aucune carte de suivi ou à une carte inaccessible.
          </span>
          <span v-if="!wekanUser"
                class="intro">Vous suivez {{ this.etablissements.length | pluralizeEtablissement }}.
          </span><br/>
          <v-btn :dark="!exportXSLXLoading" :disabled="loading || exportXSLXLoading" :loading="exportXSLXLoading"
                 class="mr-4" color="indigo"
                 outlined @click="exportXSLX">
            <v-icon class="mr-2" small>fa-file-excel</v-icon>
            Exporter en XLSX (Excel)
          </v-btn>
          <v-btn :dark="!exportDOCXLoading" :disabled="loading || exportDOCXLoading" :loading="exportDOCXLoading"
                 color="indigo" outlined
                 @click="exportDOCX">
            <v-icon class="mr-2" small>fa-file-word</v-icon>
            Exporter en DOCX (Word)
          </v-btn>
          <v-alert :value="alertExport" dismissible transition="scale-transition" type="error">Un problème est survenu
            lors de l’export des établissements suivis.
          </v-alert>
        </div>
        <PredictionWidget
            v-for="e in etablissements.slice(0,100)"
            :key="e.siret"
            :prediction="e"
            @follow-etablissement="getFollowedEtablissements"
            @unfollow-etablissement="getFollowedEtablissements"
        />
        <div v-if="etablissements.length >= 100">
          <v-alert
              :value="true"
              color="warning"
              icon="info"
          >
            La sélection a été tronquée à 100 établissements pour des raisons de performance d'affichage, utilisez <a
              @click="openRightDrawer()">les filtres</a> pour affiner votre sélection.
          </v-alert>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>
<script src="./script.js"/>
<style src="./style.css"/>