<template>
  <div>
    <v-app-bar app
               class="toolbar elevation-12"
               color="#ffffff"
               extension-height="48px"
               height="35px"
    >
      <v-icon
        v-if="!drawers.left"
        key="toolbar"
        class="fa-rotate-180"
        color="#ffffff"
        @click="drawers.showLeft()"
      >fa-bars
      </v-icon>
      <div
        class="toolbar_titre"
        style="width: 100%; text-align: center;"
      >
        <span style="display: inline-flex">
          Accompagnement
          <Gitbook :target="gitbookPath('SUIVI')" icon/>
        </span>
      </div>
      <v-spacer></v-spacer>
      <v-icon
        v-if="wekanUser && !drawers.right"
        :class="loading?'rotate':''"
        color="#ffffff"
        @click="drawers.showRight()"
        small
      >fa-filter
      </v-icon>
    </v-app-bar>
    <div style="width:100%">
      <FollowRightDrawer :loading="loading"/>
    </div>
    <v-layout column fill-height style="font-weight: normal">
      <v-flex v-if="wekanUser" pt-3 shrink text-center>
        <v-btn-toggle v-model="follow.type" mandatory @change="getFollowedEtablissements">
          <v-btn text value="my-cards">Mes accompagnements</v-btn>
          <v-btn text value="all-cards">Tous les accompagnements</v-btn>
<!--          <v-btn text value="no-card">Mes favoris</v-btn>-->
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
          <span v-if="wekanUser && follow.type==='my-cards'" class="intro">
            Les filtres sélectionnés produisent un résultat de
            {{ this.followPayload.stats.count | pluralizeEtablissement }} que vous accompagnez<br/>
          </span>
          <span v-if="wekanUser && follow.type==='all-cards'" class="intro">
            Les filtres sélectionnés produisent un résultat de
            {{ this.followPayload.stats.count | pluralizeEtablissement }}
            pour lesquels des informations d'accompagnement sont disponibles
          </span>
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
        <div style="position: absolute; top: 300px; width: 100%">
          <spinner v-show="loading"/>
        </div>
        <div :class="'maindiv ' + loadingClass()" style="min-height: 50vh">
          <FollowWidget
            v-for="e in uniqEtablissements"
            :key="e.siret"
            :etablissement="e"
          />
        </div>
        <div v-if="etablissements.length >= 100">
          <v-alert
            :value="true"
            color="warning"
            icon="info"
          >
            La sélection a été tronquée à 100 établissements pour des raisons de performance d'affichage, utilisez <a
            @click="drawers.showRight()">les filtres</a> pour affiner votre sélection.
          </v-alert>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>
<script src="./script.js"/>
<style src="./style.css"/>