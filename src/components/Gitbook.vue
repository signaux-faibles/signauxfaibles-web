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
        style="text-transform: none"
        :href="gitbookPath('ROOT') + target">
      <v-icon size="20px" style="top: -1px" class="mr-1">fa-book</v-icon><span v-if="!icon"> {{ caption || "En savoir plus" }}</span>
    </v-btn>
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