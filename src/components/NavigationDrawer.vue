<template>
  <v-navigation-drawer
      class="elevation-6"
      width="280"
      transition="scroll-x-transition"
      v-model="drawer"
      :style="tbg"
      app>
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
      <v-list-item v-if="hasCampaigns" to="/campaigns">
          <v-list-item-action>
              <v-icon>mdi-briefcase-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
              <v-list-item-title>Campagnes</v-list-item-title>
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
      <v-list-item v-if="roles.includes('wekan')" :href="wekan_url" target="_blank">
        <v-list-item-action>
          <v-icon>fab fa-trello</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Kanban de suivi</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
          href="https://signaux-faibles.gitbook.io/guide-dutilisation-et-faq/"
          target="_blank">
        <v-list-item-action>
          <v-icon>
              fa-book
          </v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Guide utilisateur et FAQ</v-list-item-title>
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
      {{ mode }}
      <News />
    </v-footer>
  </v-navigation-drawer>
</template>

<script>
import News from '@/components/News.vue'

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
    tbg() {
      return 'background: linear-gradient(45deg, #fff, 13%, ' + this.bgcolor + ' 13%, '+ this.bgcolor + ' 38%, #fff 38%, #fff 63%, ' + this.bgcolor + ' 63%, ' + this.bgcolor + ' 88%, #fff 88%); background-size: 10px 10px; background-position: 5px 5px;"'
    },
    mode() {
      return this.bgcolor == '#ffffff' ? "" : "testing"
    },
    bgcolor() {
      return process.env.VUE_APP_SIDEBAR_BACKGROUND_COLOR
    },
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
    hasCampaigns() {
      return this.$store.state.campaigns.length > 0
    }
  },
}
</script>