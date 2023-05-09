<template>
  <v-btn
      outlined
      color="indigo"
      class="ml-4"
      target="_blank"
      :href="'https://signaux-faibles.gitbook.io/guide-dutilisation-et-faq/' + target">
    <v-icon>fa-book</v-icon> En savoir plus
  </v-btn>
</template>

<script>
export default {
  props: ['target']
}
</script>