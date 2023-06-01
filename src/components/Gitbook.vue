<template>
  <div>
    <v-btn
        :small="icon"
        :dark="icon"
        :outlined="!icon"
        :icon="icon"
        :color="(icon)?'white':'indigo'"
        class="ml-4"
        target="_blank"
        :href="gitbookPath('ROOT') + target">
      <v-icon>fa-book</v-icon><span v-if="!icon"> {{ caption || "En savoir plus" }}</span>
    </v-btn>
<!--    <v-btn v-if="icon"-->
<!--           icon-->
<!--           target="_blank"-->
<!--           :href="gitbookPath('ROOT') + target">-->
<!--      <v-icon color="white">fa-book</v-icon>-->
<!--    </v-btn>-->
  </div>
</template>

<script>
export default {
  props: {
    caption: String,
    target: String,
    icon: Boolean,
  }
}
</script>