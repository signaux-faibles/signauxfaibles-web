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
      return (this.up)?"fa-arrow-trend-up":(this.down)?"fa-arrow-trend-down":"far fa-circle-info"
    },
    color() {
      return (this.up)?"red":(this.down)?"green":"indigo"
    }
  }

}
</script>

<style scoped>

</style>