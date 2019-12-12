<template>
  <div>
    <v-toolbar dark color='indigo darken-5'>
      <v-toolbar-title class="localtoolbar">
        Commentaires au sujet de l'entreprise
      </v-toolbar-title>
      <v-spacer/>
      <Help titre="Cotisations et impayés URSSAF">
        <template>
          Cet espace permet d'enregister des commentaires dans l'application qui seront visibles de tous les utilisateurs.
          Il convient de ne pas enregistrer dans cet espace de données à caractère personnel.
        </template>
      </Help>
    </v-toolbar>
    <v-card>
      <v-card-text>
        <div v-for="t in thread" :key="JSON.stringify(t.key)" style="text-align: left;border-bottom: 1px dotted #bbb;  border-left: 1px solid #bbb; padding: 0px">
          <Thread :thread="t" :load="load"/>
        </div>
      </v-card-text>
      <v-card-actions>
        <NewComment :siret="this.siret" :load="load"/>
      </v-card-actions>
    </v-card>  
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
      const params = {
        key: {
          siret: this.siret,
        },
      }
      this.$axios.post('/data/get/comment', params).then((d) => {
        const comments = d.data.sort((c1, c2) => c1.value.date > c2.value.date)
        this.thread = this.tree(comments, null)
      })
    },
    tree(comments, id) {
      return comments.reduce((m, c) => {
        if ((c.key.follows || '') === (id || '')) {
          c.thread = this.tree(comments, c.key.uuid)
          m.push(c)
        }
        return m
      }, [])
    },
  },
}
</script>

