<template>
  <v-app-bar app
    height="35px"
    class="toolbar elevation-12"
    color="#ffffff"
    extension-height="48px"
  >
    <v-icon
      @click="openLeftDrawer()"
      class="fa-rotate-180"
      v-if="!leftDrawer"
      color="#ffffff"
      key="toolbar"
    >
      mdi-backburger
    </v-icon>

    <div style="width: 100%; text-align: center;" class="toolbar_titre">
      {{ title }}
    </div>
    <v-spacer></v-spacer>
    <v-icon
      
      color="#ffffff" v-if="!rightDrawer && drawer" @click="rightDrawer=!rightDrawer">{{ icon }}</v-icon>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    icon: String,
    title: String,
    drawer: Boolean,
  },
  methods: {
    openLeftDrawer() {
      this.trackMatomoEvent('general', 'ouvrir_menu')
      this.leftDrawer = !this.leftDrawer
    },
  },
  computed: {
    leftDrawer: {
      get() {
        return this.$store.state.leftDrawer
      },
      set(drawer) {
        this.$store.dispatch('setLeftDrawer', drawer)
      },
    },
    rightDrawer: {
      get() {
        return this.$store.state.rightDrawer
      },
      set(drawer) {
        this.$store.dispatch('setRightDrawer', drawer)
      },
    },
  },
}
</script>