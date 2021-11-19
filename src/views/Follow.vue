<template>
  <div>
    <Toolbar title="Suivi d'établissements" drawer />
    <v-toolbar
      height="35px"
      class="toolbar elevation-12"
      color="#ffffff"
      extension-height="48px"
      app
    >
      <v-icon
        @click="openLeftDrawer()"
        class="fa-rotate-180"
        v-if="!leftDrawer"
        color="#ffffff"
        key="toolbar"
      >mdi-backburger</v-icon>

      <div
        style="width: 100%; text-align: center;"
        class="toolbar_titre"
      >
        Suivi d'établissements
        <Help v-if="wekanUser" titre="Suivi d'établissements" ref="followHelp" :dark="true" :big="true">
          <template>
            <p>Compte tenu de votre niveau d'habilitation, trois types de suivi d'établissements sont possibles :</p>
            <p>
              <ul>
                <li><strong>Mes cartes de suivi</strong> regroupe les établissements associés à des cartes de suivis dont vous êtes le créateur ou un des participants.</li>
                <li><strong>Toutes les cartes</strong> regroupe les établissements associés à toutes les cartes des tableaux régionaux dont vous êtes utilisateur.</li>
                <li><strong>Mon suivi sans carte</strong> regroupe les établissements associés à aucune carte de suivi ou à une carte inaccessible.</li>
              </ul>
            </p>
            <p>Deux critères supplémentaires permettent de filtrer la liste de suivi affichée :</p>
            <p>
              <ul>
                <li><strong>Statut du suivi</strong> correspond aux listes (colonne) de votre ou de vos kanbans de suivi.</li>
                <li><strong>Zone Géographique</strong> correspond aux tableaux pour les régions ou aux couloirs (lignes) des tableaux pour les départements.</li>
              </ul>
            </p>
          </template>
        </Help>
      </div>
      <v-spacer></v-spacer>
      <v-icon
        :class="loading?'rotate':''"
        color="#ffffff"
        v-if="wekanUser && !rightDrawer"
        @click="openRightDrawer()"
      >mdi-target</v-icon>
    </v-toolbar>
    <div style="width:100%">
      <v-navigation-drawer
        :class="((rightDrawer)?'elevation-6':'') + ' rightDrawer'"
        transition="no-transition"
        v-model="rightDrawer"
        right
        app
      >
        <v-toolbar flat class="transparent" height="40">
          <v-icon :class="loading?'rotate':''" @click="closeRightDrawer()">mdi-target</v-icon>
        </v-toolbar>
        <div class="mt-2" style="display: flex; flex-direction: column; vertical-align: middle; padding: 0 15px;">
          <span style="font-size: 15px;">Statut du suivi</span>
          <v-select
            :disabled="type == 'no-card'"
            ref="statut" 
            v-model="statut"
            :items="statutItems"
            :menu-props="{ maxHeight: 400 }"
            v-on:change="getFollowedEtablissements"
            multiple
            chips
          >
            <template v-slot:append-item>
              <div class="text-xs-center my-2">
                <v-btn @click="$refs.statut.isMenuActive = false" color="primary">OK</v-btn>
              </div>
            </template>
          </v-select>
        </div>
        <v-divider class="mb-3" />
        <div class="mt-2" style="display: flex; flex-direction: column; vertical-align: middle; padding: 0 15px;">
          <span style="font-size: 15px;">Étiquettes</span>
          <v-select
            :disabled="type == 'no-card'"
            ref="statut" 
            v-model="labels"
            :items="labelsItems"
            :menu-props="{ maxHeight: 400 }"
            v-on:change="getFollowedEtablissements"
            multiple
            chips
          >
            <template v-slot:append-item>
              <div class="text-xs-center my-2">
                <v-btn @click="$refs.statut.isMenuActive = false" color="primary">OK</v-btn>
              </div>
            </template>
          </v-select>
        </div>
        <v-divider class="mb-3" />
        <div style="display: flex; flex-direction: row; vertical-align: middle; padding: 0 15px;">
          <v-select
          :items="subzones"
          v-on:change="getFollowedEtablissements"
          v-model="zone"
          label="Zone Géographique"
          ></v-select>
        </div>
        <v-divider class="mb-3" />
      </v-navigation-drawer>
    </div>
    <v-layout column fill-height style="font-weight: normal">
      <v-flex v-if="wekanUser" pt-3 text-xs-center shrink>
        <v-btn-toggle mandatory v-model="type" v-on:change="getFollowedEtablissements">
          <v-btn flat value="my-cards">Mes cartes de suivi</v-btn>
          <v-btn flat value="all-cards">Toutes les cartes</v-btn>
          <v-btn flat value="no-card">Mon suivi sans carte</v-btn>
        </v-btn-toggle>
      </v-flex>
      <v-flex px-2 grow>
        <div id="nodata" v-if="!loading && follow.length == 0 && init == false">
          <div v-if="wekanUser">
            Vous ne suivez aucun établissement ou aucun établissement suivi ne correspond à vos critères de filtrage.<br />
          </div>
          <div v-else>Vous ne suivez pour le moment aucun établissement.<br />Pour ce faire,
          rendez-vous sur la fiche d'un établissement et appuyez sur le bouton
          Suivre.<br />Pour un import massif d'établissements, contactez-nous par email :<br />
          <a href="mailto:contact@signaux-faibles.beta.gouv.fr?subject=Import massif d'établissements" target="_blank"><code>contact@signaux-faibles.beta.gouv.fr</code></a></div>
        </div>
        <div class="pt-3 px-3 text-xs-center" v-if="follow.length > 0">
          <span v-if="wekanUser && type=='my-cards'" class="intro">Vous suivez {{this.follow.length | pluralizeEtablissement}} associés à des cartes dont vous êtes le créateur ou un des participants selon les filtres sélectionnés.</span>
          <span v-if="wekanUser && type=='all-cards'" class="intro">Le ou les tableaux régionaux auxquels vous êtes habilités référencent {{this.follow.length | pluralizeEtablissement}} selon les filtres sélectionnés.</span>
          <span v-if="wekanUser && type=='no-card'" class="intro">Vous suivez {{this.follow.length | pluralizeEtablissement}} associés à aucune carte de suivi ou à une carte inaccessible.</span>
          <span v-if="!wekanUser" class="intro">Vous suivez {{this.follow.length | pluralizeEtablissement}}.</span><br/>
          <v-btn outline color="indigo" @click="exportXSLX" :dark="!exportXSLXLoading" :loading="exportXSLXLoading" :disabled="loading || exportXSLXLoading" class="ml-4"><v-icon small class="mr-2">fa-file-excel</v-icon>Exporter en XLSX (Excel)</v-btn>
          <v-btn outline color="indigo" @click="exportDOCX" :dark="!exportDOCXLoading" :loading="exportDOCXLoading" :disabled="loading || exportDOCXLoading"><v-icon small class="mr-2">fa-file-word</v-icon>Exporter en DOCX (Word)</v-btn>
          <v-alert :value="alertExport" type="error" transition="scale-transition" dismissible>Un problème est survenu lors de l’export des établissements suivis.</v-alert>
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
            La sélection a été tronquée à 100 établissements pour des raisons de performance d'affichage, utilisez <a @click="openRightDrawer()">les filtres</a> pour affiner votre sélection.
          </v-alert>
        </div>
      </v-flex>
    </v-layout>
    <v-snackbar v-if="wekanUser" v-model="snackbar" :bottom="true" :timeout="0">
      Le suivi d'établissements a beaucoup évolué !
      <v-btn color="primary" flat @click="showFollowHelp()">En savoir plus</v-btn>
      <v-btn icon @click="snackbar = false"><v-icon>clear</v-icon></v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import PredictionWidget from '@/components/PredictionWidget'
import Toolbar from '@/components/Toolbar'
import Help from '@/components/Help.vue'

export default {
  name: 'Follow',
  components: { PredictionWidget, Toolbar, Help },
  data() {
    return {
      init: true,
      loading: false,
      follow: [],
      snackbar: true,
      exportXSLXLoading: false,
      exportDOCXLoading: false,
      alertExport: false,
      statutItems: ['A définir', 'Veille', 'Suivi en cours', 'Suivi terminé'],
    }
  },
  mounted() {
    this.getFollowedEtablissements()
  },
  methods: {
    showFollowHelp() {
      this.$refs.followHelp.clickButton()
    },
    getFollowedEtablissements() {
      this.loading = true
      if (this.wekanUser) {
        this.$axios.post('/follow', this.params).then((response) => {
          if (response.status === 200) {
            this.follow = response.data
          } else {
            this.follow = []
          }
        }).finally(() => {
          this.init = false
          this.loading = false
          this.followStateChanged = false
      }) } else {
        this.$axios.get('/follow').then((response) => {
          if (response.status === 200) {
            this.follow = response.data
          } else {
            this.follow = []
          }
        }).finally(() => {
          this.init = false
          this.loading = false
          this.followStateChanged = false
        })
      }
    },
    openLeftDrawer() {
      this.trackMatomoEvent('general', 'ouvrir_menu')
      this.leftDrawer = !this.leftDrawer
    },
    openRightDrawer() {
      this.rightDrawer = true
    },
    closeRightDrawer() {
      this.rightDrawer = false
    },
    download(response, defaultFilename) {
      const blob = new Blob([response.data])
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      const filename = response.headers['content-disposition'] ? response.headers['content-disposition'].split('filename=')[1] : defaultFilename
      if (filename) {
        link.setAttribute('download', filename)
      }
      link.click()
      link.remove()
    },
    exportXSLX() {
      this.trackMatomoEvent('suivi', 'extraire', 'xlsx')
      this.exportXSLXLoading = true
      this.alertExport = false
      this.$axios.post('/export/xlsx/follow', this.params, {responseType: 'blob', timeout: 120000}).then((response) => {
        this.download(response, 'export-suivi.xlsx')
        this.exportXSLXLoading = false
      }).catch((error) => {
        this.exportXSLXLoading = false
        this.alertExport = true
      })
    },
    exportDOCX() {
      this.trackMatomoEvent('suivi', 'extraire', 'docx')
      this.exportDOCXLoading = true
      this.alertExport = false
      this.$axios.post('/export/docx/follow', this.params, {responseType: 'blob', timeout: 120000}).then((response) => {
        this.download(response, 'export-suivi.zip')
        this.exportDOCXLoading = false
      }).catch((error) => {
        this.exportDOCXLoading = false
        this.alertExport = true
      })
    },
  },
  computed: {
    params() {
      const params = {}
      if (this.wekanUser) {
        params.type = this.type
        if (this.statut.length < this.statutItems.length) {
          params.statut = this.statut
        }
        if (this.zone.length > 0) {
          params.zone = this.zone
        }
        if (this.labels.length > 0) {
          params.labels = this.labels
        }
      }
      return params
    },
    etablissements() {
      return this.follow.map((f) => f.etablissementSummary)
    },
    leftDrawer: {
      get() {
        return this.$store.state.leftDrawer
      },
      set(val) {
        this.$store.dispatch('setLeftDrawer', val)
      },
    },
    rightDrawer: {
      get() {
        return this.$store.state.followRightDrawer && this.wekanUser
      },
      set(val) {
        this.$store.dispatch('setFollowRightDrawer', val)
      },
    },
    wekan_url() {
      return process.env.VUE_APP_WEKAN_URL
    },
    type: {
      get() { return this.$localStore.state.typeSuivi },
      set(value) { this.$localStore.commit('setTypeSuivi', value) },
    },
    statut: {
      get() { return this.$localStore.state.statutSuivi },
      set(value) { this.$localStore.commit('setStatutSuivi', value) },
    },
    zone: {
      get() { return this.$localStore.state.zoneSuivi },
      set(value) { this.$localStore.commit('setZoneSuivi', value) },
    },
    labels: {
      get() { return this.$localStore.state.labelsSuivi },
      set(value) { this.$localStore.commit('setLabelsSuivi', value) },
    },    
    subzones() {
      let all = [
        {
          text: 'Toute zone',
          value: [],
        },
      ]
      const region = Object.keys(this.$store.state.region).map((r) => {
        return {
          text: r,
          value: this.$store.state.region[r],
        }
      }).sort((r1, r2) => r1.text > r2.text)
      all = all.concat(region)
      const departement = Object.keys(this.$store.state.departements).map((d) => {
        return {
          text: d + ' ' + this.$store.state.departements[d],
          value: [d],
        }
      }).sort((d1, d2) => d1.value[0] > d2.value[0])
      all = all.concat(departement)
      return all
    },
    wekanUser() {
      return this.roles.includes('wekan')
    },
    labelsItems() {
      let boards = this.$store.state.wekanConfig.boards
      let labels = Object.keys(boards).reduce((m, b) => {
        boards[b].labels.forEach(l => {
          if (l.name != "") {
            m[l.name] = true
          }
        })
        return m
      }, {})
      return Object.keys(labels)
    },
  },
  filters: {
    pluralizeEtablissement(count) {
      if (count === 1) {
        return '1 établissement'
      } else {
        return count + ' établissements'
      }
    },
  },
}
</script>

<style scoped>
#nodata {
  width: 80%;
  max-width: 100%;
  height: 400px;
  margin: 200px 10%;
  position: absolute;
  vertical-align: middle;
  text-align: center;
  font-size: 24px;
}
.intro {
  font-size: 18px;
}
</style>