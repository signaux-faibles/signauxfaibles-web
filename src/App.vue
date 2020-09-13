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
  // TODO: full css review
}
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Quicksand");
@import url("https://fonts.googleapis.com/css?family=Abel");
@import url("https://fonts.googleapis.com/css?family=Oswald");
@import url("https://fonts.googleapis.com/css?family=Source+Serif+Pro");
@import url("https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap");

body {
  font-family: "Quicksand", sans-serif;
}
.task {
  background: linear-gradient(0deg, #111216, #21222b);
}
.tasktext {
  color: white;
  background: linear-gradient(
    90deg,
    #ffffff60 0px,
    #00000060 2px,
    #ffffff00 4px
  );
}
.tasktitle {
  color: white;

  background: radial-gradient(
    ellipse at top,
    #a49bbd70,
    #716a8170 35%,
    #3a3b4b70 75%,
    #21213b70 100%
  );
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
.toolbar-widget {
  color: #fff;
  font-family: "Quicksand", sans-serif;
  text-shadow: 0px 0px 2px rgb(146, 146, 146), 0px 0px 1px rgb(255, 255, 255);
  background-color: #222;
  /* background: linear-gradient(0deg, #b6b6b6, #6e6e6e00 7%, transparent),
    radial-gradient(
      ellipse at top,
      #ffffff,
      #e4e4e4 35%,
      #c9c9cc 80%,
      #afafcc 100%,
      transparent,
    ); */
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
</style>
