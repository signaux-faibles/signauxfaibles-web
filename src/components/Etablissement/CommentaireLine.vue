<template>
  <div>
    <div v-for="t in thread" :key="t.key">
      {{ t }}
    </div>
  </div>
</template>

<script>
  import Thread from '@/components/Etablissement/Thread.vue'

export default {
  name: 'Thread',
  props: [ 'thread' ],
}
</script>