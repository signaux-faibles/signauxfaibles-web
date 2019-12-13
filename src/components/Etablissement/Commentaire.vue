<template>
  <div style="text-align: left">
    <div style="">
      <h2>
        <span v-if="thread.length > 0">commentaires 
          <a
            fab
            flat
            small
            @click="viewChild=!viewChild; viewComment=false;"
            >
            <v-icon color="black">mdi-{{ viewChild ? 'minus' : 'plus' }}</v-icon>
          </a> 
        </span>
        <span v-if="thread.length == 0">
          il n'y a encore aucun commentaire, <a @click="viewChild=true; viewComment=true">créer le premier ?</a>
        </span>
        <hr style="color: #eee;"/>
      </h2>
    </div>

    <div v-if="viewChild">
      <div v-for="t in thread" :key="JSON.stringify(t.key)" style="text-align: left;border-bottom: 1px dotted #bbb; padding: 0px">
        <Thread :thread="t" :load="load"/>
      </div>
  
      <a v-if="!viewComment" @click="viewComment=!viewComment">Créer un nouveau fil de commentaire</a>
      <NewComment v-if="viewComment" style="text-align: left; margin-top: 5px;" :siret="this.siret" :load="load"/>
    </div>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
import Thread from '@/components/Etablissement/Thread.vue'
import NewComment from '@/components/Etablissement/NewComment.vue'

export default {
  components: { Help, Thread, NewComment },
  props: [ 'siret' ],
  data() {
    return {
      text: '',
      thread: [],
      viewComment: false,
      viewChild: false,
    }
  },
  mounted() {
    this.load()
  },
  computed: {
    jwt() {
      return this.$keycloak.tokenParsed || {resource_access: { signauxfaibles: {roles: []}}}
    },
    roles() {
      return this.jwt.resource_access.signauxfaibles.roles
    },
  },
  methods: {
    load() {
      let loading = true
      const params = {
        key: {
          siret: this.siret,
        },
      }
      this.$axios.post('/data/get/comment', params).then((d) => {
        const comments = d.data.sort((c1, c2) => c1.value.date < c2.value.date)
        this.thread = this.tree(comments, null)
        this.loading = false
      })
    },
    tree(comments, id) {
      return comments.reduce((m, c) => {
        if ((c.key.follows || '') === (id || '')) {
          c.thread = this.tree(comments, c.key.uuid)
          c.count = c.thread.reduce((m, h) => {
            return m+1
          }, 0)
          m.push(c)
        }
        return m
      }, [])
    },
  },
}
</script>

