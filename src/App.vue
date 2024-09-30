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
      <v-banner lines="two" color="blue lighten-5" :stacked="false">
        <v-banner-text>
          <span>
            Formations « Signaux Faibles » : Les prochaines sessions de formation se tiendront les mardi 1er et 8 octobre de 15h à 16h30, inscrivez-vous <a href="https://resana.numerique.gouv.fr/public/information/consulterAccessUrl?cle_url=1369001049VT8FZQENUGwAbQlvAG5WdlZoCTQAIQRtBG8CPwdmWmAGPFJvVDZQPAY9CDtRYw==" target="_blank">ici</a>
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
    if (this.roles.includes('wekan')) {
      this.kanban.getConfig(this.$axios, this.$store)
      this.$store.dispatch('updateKanbanConfig', this.kanban.config)
    }
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
