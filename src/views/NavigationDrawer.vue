<template>
  <v-navigation-drawer class="elevation-6" style="background-color: #ed9121;" width="280" v-model="drawer" app>
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-item>
          <v-list-item-avatar>
            <img src="../assets/logo_signaux_faibles_cercle.svg" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <img height="20" src="../assets/text_signaux_faibles.svg" />
            </v-list-item-title>
            testing mode
          </v-list-item-content>
          <v-list-item-avatar>
            <v-icon @click="closeDrawer()">mdi-backburger</v-icon>
          </v-list-item-avatar>
        </v-list-item>
      </v-list>
    </v-toolbar>
    <v-list class="pt-0" dense>


      <v-divider></v-divider>
      <v-list-item to="/">
        <v-list-item-action>
          <v-icon>search</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Consultation</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/prediction">
        <v-list-item-action>
          <v-icon>mdi-target</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Listes de détection</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/follow">
        <v-list-item-action>
          <v-icon>mdi-star</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Suivi d'établissements</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="roles.includes('wekan')" :href="wekan_url">
        <v-list-item-action>
          <v-icon>fab fa-trello</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Kanban de suivi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item :href="fider_url">
        <v-list-item-action>
          <v-icon>mdi-puzzle</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Contribuer</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/goup" v-if="jwt.goup_path">
        <v-list-item-action>
          <v-icon>cloud_upload</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Envoi de données manuel</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item @click="logout()">
        <v-list-item-action>
          <v-icon>logout</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Se déconnecter</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-footer class="elevation-6" style="color: blue; width:100%; position: fixed; bottom: 0px;">
      <v-btn text icon color="blue" :href="github_url">
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