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
        Suivi d'établissements
        <Help v-if="wekanUser" ref="followHelp" :big="true" :dark="true" titre="Suivi d'établissements">
          <template>
            <p>Compte tenu de votre niveau d'habilitation, trois types de suivi d'établissements sont possibles :</p>
            <p>
            <ul>
              <li><strong>Mes cartes de suivi</strong> contient les cartes de suivis dont
                vous êtes le créateur ou un des participants.
              </li>
              <li><strong>Toutes les cartes</strong> vous donne accès à toutes les cartes des
                tableaux de suivi auxquels vous pouvez accéder.
              </li>
              <li><strong>Mon suivi sans carte</strong> regroupe les établissements que vous avez souhaité suivre sans
                créer de carte.
              </li>
            </ul>
            <p>
            <p>Plusieurs critères supplémentaires permettent de filtrer la liste de suivi affichée :</p>
            <p/>
            <ul>
              <li><strong>Tableau de suivi</strong> vous permet de limiter la consultation aux tableaux qui vous
                intéressent
              </li>
              <li><strong>Zones Géographiques</strong> vous offre la possibilité de restreindre encore la sélection à
                quelques départements
              </li>
              <li><strong>Statut du suivi</strong> donne la possibilité d'inclure les cartes des colonnes que vous
                choisissez
              </li>
              <li><strong>Étiquettes</strong> permet de sélectionner les cartes en fonction des étiquettes qu'elles
                portent, soit parce qu'elles portent toutes les étiquettes que vous aurez sélectionnées, ou au moins une
                d'entre elles.
              </li>
              <li><strong>Modifiée depuis</strong> sélectionne les cartes qui ont été modifiées depuis la date que vous
                choisissez
              </li>
            </ul>
          </template>
        </Help>
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
              @change="getFollowedEtablissements"
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
              @change="getFollowedEtablissements"
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
              @change="getFollowedEtablissements"
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
              @change="getFollowedEtablissements"
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
                  @click:clear="() => {since=null; getFollowedEtablissements()}"
              ></v-text-field>
            </template>
            <v-date-picker
                v-model="since"
                locale="fr"
                scrollable
                @change="getFollowedEtablissements"
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
        <div v-if="!loading && follow.length === 0 && init === false" id="nodata">
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
        <div v-if="follow.length > 0" class="py-3 px-3 text-center">
          <span v-if="wekanUser && type==='my-cards'"
                class="intro">Vous suivez {{ this.follow.length | pluralizeEtablissement }} associés à des cartes dont vous êtes le créateur ou un des participants selon les filtres sélectionnés.</span>
          <span v-if="wekanUser && type==='all-cards'" class="intro">Le ou les tableaux régionaux auxquels vous êtes habilités référencent {{
              this.follow.length | pluralizeEtablissement
            }} selon les filtres sélectionnés.</span>
          <span v-if="wekanUser && type==='no-card'"
                class="intro">Vous suivez {{ this.follow.length | pluralizeEtablissement }} associés à aucune carte de suivi ou à une carte inaccessible.</span>
          <span v-if="!wekanUser"
                class="intro">Vous suivez {{ this.follow.length | pluralizeEtablissement }}.</span><br/>
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