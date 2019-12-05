<template>
  <div>
    <div v-for="t in thread" :key="JSON.stringify(t.key)">
      <a :href="'mailto:' + t.key.author.trim()" >{{ t.value.name.trim() }}</a>, le {{ displayDate(t.key.date) }}: {{ t.value.text }}
    </div>
  </div>
</template>

<script>
  import Thread from '@/components/Etablissement/Thread.vue'

  export default {
    name: 'Thread',
    props: [ 'thread' ],
    methods: {
      lpad(string, pad, len) {
        str1.padStart(2, '0')
      },
      displayDate(date) {
        const d = new Date(date)
        return d.getDate().toString(10).padStart(2, '0') + '/'+ 
               d.getMonth().toString(10).padStart(2, '0') + '/' + 
               d.getFullYear().toString(10).padStart(4, '0') + ' à ' + 
               d.getHours().toString(10).padStart(2, '0') + ':' + 
               d.getMinutes().toString(10).padStart(2, '0') + ':' + 
               d.getSeconds().toString(10).padStart(2, '0')
      }
    }
  }
</script>