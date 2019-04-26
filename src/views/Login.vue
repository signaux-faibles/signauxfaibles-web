<template>
  <v-container fluid fill-height>
    <v-layout align-center wrap justify-center>
        <v-alert
          style="position: absolute; top: 0px; z-index: 10;"
          v-model="loginError"
          dismissible
          type="error"
        >
          Identification incorrecte
        </v-alert>
      <v-flex class="login" xs12 sm6 md3>
        <span><v-img class="center" max-width="100px" src="/static/logo_signaux_faibles_cercle.svg"></v-img></span>
        <h1><span class="fblue">Signaux</span>·<span class="fred">Faibles</span></h1>
      </v-flex>

      <v-flex class="login" xs12 sm6 md3>
          <v-form @submit="login" action="#">
          <v-text-field  prepend-icon="person" label="Adresse électronique" v-model="email"></v-text-field >
          <v-text-field  prepend-icon="lock" label="Mot de Passe" type="password"  v-model="password"></v-text-field>
          <v-btn round color="primary" type="submit">Connexion</v-btn><br/>
          <div v-if="browserToken">
            <v-dialog
              persistent
              height="400px"
              width="500"
            >
              <a slot="activator" style="font-size: 10px" href='#'>Mot de passe oublié ?</a>
                <v-card >
                  <v-toolbar color="#eef" class="toolbar-widget elevation-1" dense>
                    <v-icon>mdi-lock-question</v-icon>
                    <v-spacer></v-spacer>
                    <span style="font-size: 15px; font-weight: 600">
                      Récupération du compte
                    </span>
                  </v-toolbar>
                </v-card>
              </v-dialog>
            </div>
          </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// import zxcvbn from 'zxcvbn'
export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  computed: {
    loginError() {
      return this.$store.state.loginError
    },
    browserToken() {
      return this.$localStore.browserToken
    },
  },
  methods: {
    login() {
      const formData = {
        email: this.email,
        password: this.password,
        token: this.browserToken,
      }
      this.$axios.post('/login', formData).then((response) => {
        this.$store.dispatch('setToken', response.data.token)
        this.$router.push('prediction')
      })
    },
  },
}
</script>

<style scoped>
  .login {
        text-align: center;     /* will center text in <p>, which is not a flex item */
        align-items: center
  }
  h1 {
    font-family: 'Quicksand', sans-serif;
  }
  .center { 
    display: block;
    margin: 0 auto;
  }
  #toolbar { 
    font-size: 25px;
    color: white; 
  }
  span.fblue {
    font-family: 'Quicksand', sans-serif;
    color: #20459a
  }
  span.fred {
    font-family: 'Quicksand', sans-serif;
    color: #e9222e
  }
  .box {
    background-color: #fff;
  }
</style>
