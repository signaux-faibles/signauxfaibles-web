<template>
  <v-app id="app">
    <Security v-if="!securityConsent" />
    <v-content v-if="securityConsent">
      <NavigationDrawer v-if="login && leftDrawer" />
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import NavigationDrawer from '@/views/NavigationDrawer'
import Security from '@/views/Security'

export default {
  components: { NavigationDrawer, Security },
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
  },
  computed: {
    securityConsent() {
      const refDate = new Date('2019-10-22')
      const securityConsent = new Date(this.$localStore.state.securityConsent)
      return securityConsent.getTime() >= refDate.getTime()
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
    leftDrawer: {
      get() {
        return this.$store.state.leftDrawer
      },
      set(val) {
        this.$store.dispatch('setLeftDrawer', val)
      },
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
  },
  name: 'App',
}
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Abel");
@import url("https://fonts.googleapis.com/css?family=Oswald");
@import url("https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap");

body {
  font-family: "Roboto", sans-serif;
}
.toolbar {
  background-color: #222;
  text-shadow: 0px 0px 2px rgb(0, 0, 0), 0px 0px 1px rgb(255, 255, 255);
  background: linear-gradient(0deg, #272629, #ffffff00 7%, transparent),
    radial-gradient(
      ellipse at top,
      rgb(164, 155, 189),
      #70658a 35%,
      #3a3b4b 75%,
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
#app {
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
span.fblue {
  font-family: "Quicksand", sans-serif;
  color: #20459a;
}
span.fred {
  font-family: "Quicksand", sans-serif;
  color: #e9222e;
}
</style>
