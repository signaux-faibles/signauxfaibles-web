<template>
  <v-navigation-drawer class="elevation-6" v-model="drawer" app>
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="../assets/logo_signaux_faibles_cercle.svg" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <img height="20" src="../assets/text_signaux_faibles.svg" />
            </v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-avatar>
            <v-icon @click="closeDrawer()">mdi-backburger</v-icon>
          </v-list-tile-avatar>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <v-list class="pt-0" dense>
      <v-divider></v-divider>

      <v-list-tile to="/">
        <v-list-tile-action>
          <v-icon>search</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Consultation</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile to="/prediction">
        <v-list-tile-action>
          <v-icon>mdi-target</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Listes de détection</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile to="/follow">
        <v-list-tile-action>
          <v-icon>mdi-star</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Suivi d'établissements</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile v-if="roles.includes('wekan')" :href="wekan_url">
        <v-list-tile-action>
          <v-icon>fab fa-trello</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Kanban de suivi</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile :href="fider_url">
        <v-list-tile-action>
          <v-icon>mdi-puzzle</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Contribuer</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile to="/goup" v-if="jwt.goup_path">
        <v-list-tile-action>
          <v-icon>cloud_upload</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Envoi de données manuel</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-divider></v-divider>

      <v-list-tile @click="logout()">
        <v-list-tile-action>
          <v-icon>logout</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Se déconnecter</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-footer class="elevation-6" style="color: blue; width:100%; position: fixed; bottom: 0px;">
      <v-btn flat icon color="blue" :href="github_url">
        <v-icon>fab fa-github</v-icon>
      </v-btn>
      <v-spacer />
      <News />
    </v-footer>
  </v-navigation-drawer>
</template>

<script>
import News from '@/views/News.vue'

export default {
  components: { News },
  methods: {
    logout() {
      this.trackMatomoEvent('general', 'se_deconnecter')
      this.createNewMatomoVisit()
      this.$keycloak.logoutFn()
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    },
    closeDrawer() {
      this.trackMatomoEvent('general', 'fermer_menu')
      this.drawer = !this.drawer
    },
    createNewMatomoVisit() {
      if (window._paq) {
        window._paq.push(['resetUserId'])
        window._paq.push(['appendToTrackingUrl', 'new_visit=1'])
        window._paq.push(['trackPageView'])
        window._paq.push(['appendToTrackingUrl', ''])
      }
    },
  },
  computed: {
    fider_url() {
      return process.env.VUE_APP_FIDER_URL
    },
    github_url() {
      return process.env.VUE_APP_GITHUB_ORGANIZATION
    },
    wekan_url() {
      return process.env.VUE_APP_WEKAN_URL
    },
    drawer: {
      get() {
        return this.$store.state.leftDrawer
      },
      set(val) {
        this.$store.dispatch('setLeftDrawer', val)
      },
    },
  },
}
</script>