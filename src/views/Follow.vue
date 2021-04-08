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
      </div>
      <v-spacer></v-spacer>
      <v-btn v-if="roles.includes('wekan')" dark icon :href="wekan_url" target="_blank" rel="noopener">
        <v-icon>fab fa-trello</v-icon>
      </v-btn>
    </v-toolbar>
    <div id="nodata" v-if="!loading && follow.length == 0 && init == false">
      Vous ne suivez pour le moment aucun établissement.<br />Pour ce faire,
      rendez-vous sur la fiche d'un établissement et appuyez sur le bouton
      Suivre.<br />Pour un import massif d'établissements, contactez-nous par email :<br />
      <a href="mailto:contact@signaux-faibles.beta.gouv.fr?subject=Import massif d'établissements" target="_blank"><code>contact@signaux-faibles.beta.gouv.fr</code></a>
    </div>
    <div class="pt-3 pl-3 text-xs-center" v-if="follow.length > 0">
      <span class="intro">Vous suivez {{this.follow.length | pluralizeEtablissement}}.</span>
      <v-btn outline color="indigo" @click="download" class="ml-4">
        <v-icon small class="mr-2">fa-file-download</v-icon>
        Exporter
      </v-btn>
    </div>
    <PredictionWidget
      v-for="e in etablissements"
      :key="e.siret"
      :prediction="e"
      @follow-etablissement="getFollowedEtablissements"
      @unfollow-etablissement="getFollowedEtablissements"
    />
    <v-snackbar v-model="snackbar" :bottom="true" :timeout="0" v-if="follow.length > 0">
      <v-icon dark class="mr-2">move_to_inbox</v-icon>Besoin d'un import massif ?
      <v-btn color="primary" flat href="mailto:contact@signaux-faibles.beta.gouv.fr?subject=Import massif d'établissements" target="_blank" rel="noopener">Contactez-nous</v-btn>
      <v-btn icon @click="snackbar = false"><v-icon>clear</v-icon></v-btn> 
    </v-snackbar>
  </div>
</template>
<script>
import PredictionWidget from '@/components/PredictionWidget'
import Toolbar from '@/components/Toolbar'

export default {
  components: { PredictionWidget, Toolbar },
  data() {
    return {
      init: true,
      loading: false,
      follow: [],
      snackbar: true,
    }
  },
  mounted() {
    this.getFollowedEtablissements()
  },
  methods: {
    getFollowedEtablissements() {
      this.$axios.get('/follow').then((response) => {
        if (response.status === 200) {
          this.follow = response.data
        } else {
          this.follow = []
        }
      }).finally(() => {
        this.init = false
      })
    },
    download() {
      this.trackMatomoEvent('suivi', 'extraire')
      this.$axios(
        {
          url: `/follow/xls`,
          method: 'get',
          responseType: 'arraybuffer',
        },
      ).then((r) => {
        const url = window.URL.createObjectURL(new Blob([r.data]))
        const element = document.createElement('a')
        element.setAttribute('href',  url)
        element.setAttribute('download', 'extract-suivi.xlsx')
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      })
    },
    openLeftDrawer() {
      this.trackMatomoEvent('general', 'ouvrir_menu')
      this.leftDrawer = !this.leftDrawer
    },
  },
  computed: {
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
    wekan_url() {
      return process.env.VUE_APP_WEKAN_URL
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