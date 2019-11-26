<template>
  <div>
    {{ jwt }}
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
      <v-card-title>
        Enregistrer un nouveau commentaire
      </v-card-title>
      <v-card-content>
        <v-textarea
        model="text"
        hint="Votre commentaire…"/>
      </v-card-content>
      <v-card-action>
        <v-btn @click="send">Envoyer</v-btn>
      </v-card-action>
    </v-card>  
    
  </div>
</template>

<script>
import Help from '@/components/Help.vue'

export default {
  components: { Help },
  data: {
    text: '',
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
    send() {
      const params = [{
        key: {
          test: "test"
        },
        value: {
          test: "this is a test"
        }
      }]
      this.$axios.post('/data/put/comment', params)
    }
  }
}
</script>

