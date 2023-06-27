<template>
  <div class="align-top d-flex justify-start mb-1">
    <div class="pa-2">
      <v-icon large :color="color">{{ arrow }}</v-icon>
    </div>
    <div class="pa-2">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: "Redressement",
  props: {
    up: Boolean,
    down: Boolean,
  },
  computed: {
    arrow() {
      return (this.up)?"mdi-arrow-top-right-bold-outline":(this.down)?"mdi-arrow-bottom-right-bold-outline":"mdi-information-outline"
    },
    color() {
      return (this.up)?"red":(this.down)?"green":"indigo"
    }
  }

}
</script>

<style scoped>

</style>