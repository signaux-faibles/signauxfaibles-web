<template>
  <v-app-bar app
    height="35px"
    class="toolbar elevation-12"
    color="#ffffff"
    extension-height="48px"
  >
    <v-icon
      @click="drawers.showLeft()"
      class="fa-rotate-180"
      v-if="!drawers.left"
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
      
      color="#ffffff" v-if="!drawers.right && drawer" @click="drawers.showRight()">{{ icon }}</v-icon>
  </v-app-bar>
</template>

<script>
import {useDrawersStore} from "@/stores/drawers";

export default {
  props: {
    icon: String,
    title: String,
    drawer: Boolean,
  },
  setup() {
    const drawers = useDrawersStore()
    return {drawers}
  },
  computed: {

  },
}
</script>