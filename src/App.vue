<template>
  <v-app>
    <div id="base"></div>
    <v-dialog v-model="expiredSession" max-width="500px" persistent>
      <v-card>
        <v-card-title class="headline">Votre session a expiré</v-card-title>
        <v-card-text>
          Vous avez été inactif pendant une trop longue période.
          <br/>Veuillez vous reconnecter pour accéder de nouveau au service.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="reconnect()">Se reconnecter</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Dialogs/>
    <Security v-if="!securityConsent"/>
    <v-main v-if="securityConsent">
      <v-banner v-if="!isDatapiUp" class="text-center" lines="two" color="orange lighten-7" :stacked="false">
        <v-banner-text>
         <span>
           🛠️ Signaux Faibles rencontre actuellement quelques difficultés et certaines fonctionnalités peuvent être endommagées.</br>
           Nos équipes font de leur mieux pour réparer cet incident dans les plus brefs délais.
         </span>
        </v-banner-text>
      </v-banner>
      <v-banner lines="two" color="blue lighten-5" :stacked="false">
        <v-banner-text name="empty-cache">
          <span>
            Si aucune entreprise ne s'affiche dans la liste de janvier 2026, nous vous invitons à vider à votre cache  (Tutoriel <a href="https://support.microsoft.com/fr-fr/microsoft-edge/afficher-et-supprimer-l-historique-du-navigateur-dans-microsoft-edge-00cf7943-a9e1-975a-a33d-ac10ce454ca4#:~:text=S%C3%A9lectionnez%20Param%C3%A8tres%20et%20plus%20%3E%20Param%C3%A8tres,plage%20horaire%20dans%20la%20liste." target="_blank">Edge</a> ou <a href="https://support.mozilla.org/fr/kb/comment-vider-cache-firefox" target="_blank">Firefox</a>) ou bien à nous contacter à l'adresse : esther.spindler@beta.gouv.fr
          </span>
        </v-banner-text>
      </v-banner>
      <NavigationDrawer v-if="login && drawers.left"/>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import Security from '@/components/Security.vue'
import Dialogs from '@/components/dialog/main/main.vue'
import {useDrawersStore} from '@/stores/drawers';
import {useCampaignsStore} from '@/stores/campaigns';
import {useKanbanStore} from "@/stores/kanban";

export default {
  components: {NavigationDrawer, Security, Dialogs},
  setup() {
    const drawers = useDrawersStore()
    const campaigns = useCampaignsStore()
    const kanban = useKanbanStore()
    return {drawers, campaigns, kanban}
  },
  methods: {
    handleResize() {
      this.height = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0,
      )
    },
    handleScrolling(event) {
      this.scrollTop = event.pageY || window.scrollY
    },
    reconnect() {
      this.$keycloak.login()
    },
    checkHealth() {
      this.$axios.get('/healthcheck')
        .then((response) => {
          const { goroutines } = response.data;
          this.$store.dispatch('setDatapiStatus', goroutines <= 35);
        })
        .catch(() => {
          this.$store.dispatch('setDatapiStatus', false);
        });
    }
  },
  computed: {
    securityConsent() {
      const securityConsent = new Date(this.$localStore.state.securityConsent)
      const limitConsent = new Date(securityConsent.setMonth(securityConsent.getMonth() + 2));
      return limitConsent.getTime() >= Date.now()
    },
    height: {
      get() {
        return this.$store.state.height
      },
      set(height) {
        this.$store.dispatch('setHeight', height)
      },
    },
    scrollTop: {
      get() {
        return this.$store.state.scrollTop
      },
      set(scrollTop) {
        this.$store.dispatch('setScrollTop', scrollTop)
      },
    },
    isDatapiUp: {
      get() {
        return this.$store.state.isDatapiUp
      },
      set(isDatapiUp) {
        this.$store.dispatch('setDatapiStatus', isDatapiUp)
      },
    },
    login() {
      return this.$keycloak.authenticated
    },
    expiredSession() {
      return this.$localStore.state.expiredSession
    },
  },
  mounted() {
    document.onscroll = this.handleScrolling
    window.onresize = this.handleResize
    this.height = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0,
    )
    this.$store.dispatch('updateReference')
    this.campaigns.getCampaigns(this.$axios)

    this.checkHealth();
    setInterval(this.checkHealth, 30000);
  },
  name: 'App',
}
</script>
<style>

@font-face {
  font-family: "Roboto";
  font-weight: 300;
  src: url(./fonts/Roboto-Medium.ttf) format("truetype");
}

@font-face {
  font-family: "Roboto Mono";
  src: url(./fonts/RobotoMono-Regular.ttf) format("truetype");
}

@font-face {
  font-family: "Oswald";
  font-style: normal;
  font-weight: 350;
  src: local("Oswald"),
  url(./fonts/SairaCondensed-Medium.ttf) format("truetype");
}

@font-face {
  font-family: "Abel";
  src: local("Abel"),
  url(./fonts/Abel-Regular.ttf) format("truetype");
}
body {
  font-family: "Roboto", sans-serif;
}
.toolbar {
  background-color: #222;
  text-shadow: 0px 0px 2px rgb(0, 0, 0), 0px 0px 1px rgb(255, 255, 255);
  background: linear-gradient(0deg, #272629, #ffffff00 7%, transparent),
  radial-gradient(
    ellipse at top,
    rgb(184, 175, 209),
    #70658a 10%,
    #3a3b4b 55%,
    #21213b 100%,
    transparent
  );
}

.toolbar_titre {
  color: #fff;
  font-family: "Abel", sans-serif;
  font-weight: 800;
  font-size: 22px;
}

#base {
  height: 100vh;
  width: 100vw;
  position: fixed;
  background: radial-gradient(
    circle at center,
    rgb(255, 255, 255),
    rgb(233, 232, 232) 75%,
    rgb(187, 187, 187) 100%
  );
}

.rightDrawer {
  position: fixed;
  right: 0px;
}

.span {
  max-height: 10px;
}
</style>
