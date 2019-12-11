<template>
  <div>
    <div style="padding: 8px">
      
      <a :href="'mailto:' + thread.key.author.trim()">
        <v-avatar color="indigo" size="24">
          <span class="white--text">{{ avatar }}</span>
        </v-avatar>
      </a> 
      <!-- , le {{ displayDate(thread.value.date) }}: --> {{ thread.value.text }} 
      
      <div v-for="t in thread.thread" :key="JSON.stringify(t.key)" style="text-align: left; border-left: 1px solid #bbb; padding: 0px">
        <Thread :thread="t" :follows="thread.key.uuid" :load="load"/>
      </div>
      <NewComment :follows="thread.key.uuid" :siret="thread.key.siret" :load="load" :class="commentClass"/>
      <a @click="viewComment=!viewComment">répondre</a>

    </div>
  </div>
</template>

<script>
  import Thread from '@/components/Etablissement/Thread.vue'
  import NewComment from '@/components/Etablissement/NewComment.vue'

  export default {
    name: 'Thread',
    props: [ 'thread', 'follows', 'load' ],
    components: { NewComment, Thread },
    data() {
      return {
        viewComment: false,
      }
    },
    computed: {
      commentClass() {
        return this.viewComment?'visibleComment':'hiddenComment'
      },
      avatar() {
        const name = this.thread.value.name.trim()
        return name.split(' ').reduce((m,c) => {
          m += c[0]
          return m
        }, '')
      },
    },
    methods: {
      displayDate(date) {
        const d = new Date(date)
        return d.getDate().toString(10).padStart(2, '0') + '/'+
               d.getMonth().toString(10).padStart(2, '0') + '/' +
               d.getFullYear().toString(10).padStart(4, '0') + ' à ' +
               d.getHours().toString(10).padStart(2, '0') + ':' +
               d.getMinutes().toString(10).padStart(2, '0') + ':' +
               d.getSeconds().toString(10).padStart(2, '0')
      },
    },
  }
</script>

<style scoped>
  .visibleComment {
    visibility:visible;
    position:relative;
  }
  .hiddenComment {
    visibility:hidden;
    position:absolute;
  }
</style>