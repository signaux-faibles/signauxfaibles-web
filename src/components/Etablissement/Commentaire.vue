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
        <Thread :thread="comments"/>
      </v-card-text>
      <v-card-actions>
        <v-text-field
        rounded
        outline
        v-model="text"
        label="Votre commentaire…"/>
        <v-btn @click="send">Envoyer</v-btn>
      </v-card-actions>
    </v-card>  
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
import Thread from '@/components/Etablissement/Thread.vue'

export default {
  components: { Help, Thread },
  props: [ 'siret' ],
  data() {
    return {
      text: '',
      comments: [],
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
      this.$axios.post("/data/get/comment", params).then((d) => {
        this.comments = d.data.sort((c1, c2) => c1.key.date > c2.key.date)
      })
    },
    send() {
      const params = [{
        key: {
          siret: this.siret,
          siren: this.siret.substring(0, 9),
          author: this.jwt.email,
          date: new Date(),
        },
        value: {
          name: this.jwt.name,
          text: this.text,
        },
      }]
      this.$axios.post('/data/put/comment', params).then((r) => {
        this.load()
      })
    },
  },
}
</script>

