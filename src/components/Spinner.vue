<template>
  <div id="spinner">
    {{ c }} 
  </div>
</template>

<script>
export default {
  name: 'Spinner',
  data() {
    return {
      c: '.',
      chars: '⠲⠖⠦⠴',
    }
  },
  mounted() {
    this.next()
  },
  methods: {
    next(chars) {
      this.c = this.chars.slice(0, 1)
      this.chars = this.chars.slice(1) + this.chars.slice(0, 1)
      setTimeout(this.next, 200)
    },
  },
}
</script>

<style scoped>
#spinner {
  position: absolute;
  width: 100%;
  height: 250px;
  vertical-align: middle;
  text-align: center;
  font-size: 200px;
  font-family:monospace;
  color: #888;
}
</style>