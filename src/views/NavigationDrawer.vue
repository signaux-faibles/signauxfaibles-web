<template>
  <v-navigation-drawer class="elevation-6" v-model="drawer" app>
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="../assets/logo_signaux_faibles_cercle.svg">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title><span class="fblue">Signaux</span>·<span class="fred">Faibles</span></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-avatar>
            <v-icon @click="drawer=!drawer">mdi-backburger</v-icon>
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

        <v-list-tile to="/prediction" v-if="roles.includes('detection')">
          <v-list-tile-action>
            <v-icon>mdi-target</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Listes de détection</v-list-tile-title>
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
      <v-btn
        flat
        icon
        color="blue"
        :href="github_url">
        <v-icon>fab fa-github</v-icon>
      </v-btn>
      <v-spacer/>
      <News/>
    </v-footer>
  </v-navigation-drawer>

</template>

<script>
import News from '@/views/News.vue'

export default {
  components: { News },
  methods: {
    logout() {
      this.$keycloak.logoutFn()
      this.$router.push('/')
    },
  },
  computed: {
    fider_url() {
      return process.env.VUE_APP_FIDER_URL
    },
    github_url() {
      return process.env.VUE_APP_GITHUB_ORGANIZATION
    },
    jwt() {
      return this.$keycloak.tokenParsed
    },
    roles() {
      return this.jwt.resource_access.signauxfaibles.roles
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

<style scoped>
  span.fblue {
    font-family: 'Quicksand', sans-serif;
    color: #20459a
  }
  span.fred {
    font-family: 'Quicksand', sans-serif;
    color: #e9222e
  }
</style>
