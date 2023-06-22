<template>
  <div style="display: flex;
         min-height: 100%;
        justify-content: center;
        align-items: center;">
    <v-progress-circular
      size="100"
      width="10"
      indeterminate
      color="blue"
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  name: 'Spinner',
}
</script>

<style scoped>

</style>