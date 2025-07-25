<template>
  <v-slide-x-transition>
    <v-navigation-drawer
        v-show="show"
        v-model="drawers.left"
        :style="tbg"
        app
        class="elevation-6"
        width="280">
      <v-toolbar class="transparent" flat>
        <v-list class="pa-0">
          <v-list-item>
            <v-list-item-avatar>
              <img src="../assets/logo_signaux_faibles_cercle.svg"/>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <img height="20" src="../assets/text_signaux_faibles.svg"/>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-avatar>
              <v-icon @click="closeDrawer()">fa-angles-left</v-icon>
            </v-list-item-avatar>
          </v-list-item>
        </v-list>
      </v-toolbar>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
         <v-list-item to="/">
          <v-list-item-action>
            <v-icon>fa-magnifying-glass</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Consultation</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="campaigns.hasCampaigns" to="/campaigns">
          <v-list-item-action>
            <v-icon>fa-phone</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Campagnes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!['dreets'].includes(this.segment)" to="#">
          <v-list-item-action>
            <v-icon>fa-people-pulling</v-icon>
          </v-list-item-action>
          <v-list-item-content @click="redirectToRails">
            <v-list-item-title>Accompagnements</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/prediction">
          <v-list-item-action>
            <v-icon>fa-satellite-dish</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Listes de détection</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="roles.includes('wekan') && kanban.visibleWekan" :href="wekan_url" target="_blank">
          <v-list-item-action>
            <v-icon>fab fa-trello</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Kanban de suivi</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="ma-2"></v-divider>
        <v-list-item
            href="https://signaux-faibles.gitbook.io/guide-dutilisation-et-faq/"
            target="_blank">
          <v-list-item-action>
            <v-icon>
              fa-book
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Aide en ligne</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="roles.includes('stats')" @click="dialogs.showExportStats">
          <v-list-item-action>
            <v-icon>
              fa-file-excel
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Extraction des statistiques</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout()">
          <v-list-item-action>
            <v-icon>fa-right-from-bracket</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Se déconnecter</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-footer class="elevation-6" style="color: blue; width:100%; position: fixed; bottom: 0px;">
        <v-btn :href="github_url" color="blue" icon text>
          <v-icon>fab fa-github</v-icon>
        </v-btn>
        <v-spacer/>
        {{ mode }}
        <News/>
      </v-footer>
    </v-navigation-drawer>
  </v-slide-x-transition>
</template>

<script>
import News from '@/components/news.vue'
import {useDrawersStore} from "@/stores/drawers";
import {useCampaignsStore} from "@/stores/campaigns";
import {useDialogsStore} from "@/stores/dialogs";
import {useKanbanStore} from "@/stores/kanban";

export default {
  components: {News},
  data() {
    return {
      show: false,
      sforUrl: process.env.VUE_APP_SFOR_URL,
    }
  },
  setup() {
    const drawers = useDrawersStore()
    const campaigns = useCampaignsStore()
    const dialogs = useDialogsStore()
    const kanban = useKanbanStore()
    return {drawers, campaigns, dialogs, kanban}
  },
  mounted() {
    this.show = true
  },
  methods: {
    redirectToRails() {
      const token = this.$keycloak.token;

      // Passerelle avec Rails (on passe le token de keycloak à Rails pour que le back-end de rails puisse vérifier le token)
      this.$axios.post(`${this.sforUrl}/users/sign_in`, { token }, { withCredentials: true })
        .then(response => {
          window.open(`${this.sforUrl}/accompagnements`, '_blank'); // Open in a new tab
        })
        .catch(error => {
          console.error('Erreur lors de la redirection:', error);
        });
      },
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
      this.drawers.hideLeft()
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
      return 'background: linear-gradient(45deg, #fff, 13%, ' + this.bgcolor + ' 13%, ' + this.bgcolor + ' 38%, #fff 38%, #fff 63%, ' + this.bgcolor + ' 63%, ' + this.bgcolor + ' 88%, #fff 88%); background-size: 10px 10px; background-position: 5px 5px;"'
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
  }
}
</script>