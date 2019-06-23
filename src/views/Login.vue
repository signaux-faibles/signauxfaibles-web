<template>
  <v-container fluid fill-height>
    <v-layout align-center wrap justify-center>
      <v-alert
        style="position: absolute; top: 15px; z-index: 10;"
        v-model="loginError"
        dismissible
        transition="fade-transition"
        type="error"
      >
        Identification incorrecte
      </v-alert>
      <v-alert
        style="position: absolute; top: 15px; z-index: 10;"
        v-model="connectionEmailError"
        dismissible
        transition="fade-transition"
        type="error"
      >
        Un problème est survenu
      </v-alert>
      <v-alert
        style="position: absolute; top: 15px; z-index: 10;"
        v-model="connectionEmailSuccess"
        dismissible
        transition="fade-transition"
        type="success"
      >
        Un Email vient d'être envoyé avec les instructions pour finaliser votre (ré)inscription.
      </v-alert>
      <v-flex class="login" xs12 sm6 md4>
        <span><img class="center" width="100px" src="../assets/logo_signaux_faibles_cercle.svg"/></span>
        <h1><span class="fblue">Signaux</span>·<span class="fred">Faibles</span></h1>
      </v-flex>

      <v-flex class="login" xs12 sm6 md4>
        <v-tabs
          v-model="active"
          color=#FFF0
          slider-color="indigo"
          xs12 sm6 md6
          fixed-tabs 
        >
        <v-tab>
          CONNEXION
        </v-tab>
        <v-tab>
          INSCRIPTION
        </v-tab>
        
        <v-tab-item>
          <v-form @submit.prevent="login" action="#">
            <v-text-field  prepend-icon="person" label="Adresse électronique" v-model="email"></v-text-field >
            <v-text-field  prepend-icon="lock" label="Mot de Passe" type="password"  v-model="password"></v-text-field>
            <v-btn round color="primary" type="submit">Connexion</v-btn><br/>
            <v-dialog compact v-model="help" max-width="310">
              <a slot="activator">Mot de passe oublié</a>
              <v-card>
                <v-card-title class="headline">Un peu d'aide ?</v-card-title>
                <v-card-text>
                  Vous pouvez à tout moment initialiser un nouveau mot de passe en vous réinscrivant.
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-4" flat @click="help = false">NON MERCI</v-btn>
                  <v-btn color="green darken-4" flat @click="active=1; help = false">
                    SE REINSCRIRE</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-form>
        </v-tab-item>
        <v-tab-item>
          <v-text-field
            style="margin-top: 20px"
            prepend-icon="email" 
            v-model="connectionEmail"
            label="Votre adresse e-mail"
            :rules="emailRules">
          </v-text-field>
          <v-btn 
            round color="success" type="submit"
            :disabled="emailRules[0](connectionEmail) != true"
            @click="getConnectionEmail"
            >
            S'INSCRIRE
          </v-btn>
        </v-tab-item>

      </v-tabs>
    </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      connectionEmail: '',
      email: '',
      password: '',
      help: false,
      connectionEmailError: false,
      connectionEmailSuccess: false,
      emailRules: [ ((v) => /.+@.+/.test(v) || 'Invalid Email address') ],
    }
  },
  computed: {
    loginError() {
      return this.$store.state.loginError
    },
    browserToken() {
      return this.$localStore.browserToken
    },
    active: {
      get() {
        return this.$localStore.state.loginTab
      },
      set(value) {
        this.$localStore.dispatch('setLoginTab', value)
      },
    },
  },
  mounted() {
    if (this.$store.state.token != null) {
      this.$router.push('detection')
    }
  },
  methods: {
    getConnectionEmail() {
      const self = this
      const formData = {
        email: this.connectionEmail,
      }
      this.$axios.post('/connectionEmail', formData).then((response) => {
        self.connectionEmailSuccess = true
        self.email = self.connectionEmail
        self.active = 0
      }).catch((error) => {
        self.connectionEmailError = true
      }).finally(() => {
        self.dialog = false
      })
    },
    login() {
      const formData = {
        email: this.email,
        password: this.password,
        token: this.browserToken,
      }
      this.$axios.post('/login', formData).then((response) => {
        const tokens = {
          token: response.data.access_token,
          refreshToken: response.data.refresh_token,
        }
        this.$store.dispatch('setTokens', tokens)
        this.$router.push('detection')
      }).catch((error) => {
        this.loginError = true
      })
    },
  },
}
</script>

<style scoped>
  .login {
        text-align: center;     
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
