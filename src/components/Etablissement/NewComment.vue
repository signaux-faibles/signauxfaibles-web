<template>
  <div>
    <v-text-field
      style="width: 300px"
      outline
      v-model="text"
      label=""
    ></v-text-field>
    <v-btn @click="send">Envoyer</v-btn>
  </div>
</template>

<script>
const uuidv1 = require('uuid/v1');

export default {
  name: 'NewComment',
  props: [ 'follows', 'siret', 'load' ],
  data() {
    return {
      text: '',
    }
  },
  computed : {
    jwt() {
      return this.$keycloak.tokenParsed || {resource_access: { signauxfaibles: {roles: []}}}
    },
  },
  methods: {
    send() {
      const params = [{
        key: {
          siret: this.siret,
          siren: this.siret.substring(0, 9),
          author: this.jwt.email,
          uuid: uuidv1(),
          follows: this.follows,
        },
        value: {
          date: new Date(),
          name: this.jwt.name,
          text: this.text,
        },
      }]

      this.$axios.post('/data/put/comment', params).then((r) => {
        this.text = ''
        this.load()
      })
    },
  },
}
</script>