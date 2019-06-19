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
        Un Email vient d'être envoyé avec les instructions pour réinitialiser votre mot de passe.
      </v-alert>
      <v-flex class="login" xs12 sm6 md3>
        <span><img class="center" width="100px" src="../assets/logo_signaux_faibles_cercle.svg"/></span>
        <h1><span class="fblue">Signaux</span>·<span class="fred">Faibles</span></h1>
      </v-flex>

      <v-flex class="login" xs12 sm6 md3>
        <v-form @submit="login" action="#">
        <v-text-field  prepend-icon="person" label="Adresse électronique" v-model="email"></v-text-field >
        <v-text-field  prepend-icon="lock" label="Mot de Passe" type="password"  v-model="password"></v-text-field>
        <v-btn round color="primary" type="submit">Connexion</v-btn><br/>
        <div>
          <v-dialog
            v-model="dialog"
            height="400px"
            width="500"
          >
            <a slot="activator" style="font-size: 10px" href='#'>Première connexion / Mot de passe perdu</a>
              <v-card>
                <v-toolbar color="#eef" class="toolbar-widget elevation-1" dense>
                  <v-icon>mdi-lock-question</v-icon>
                  <v-spacer></v-spacer>
                  <span style="font-size: 15px; font-weight: 600">
                    Votre adresse email ?
                  </span>
                </v-toolbar>
                <div style="margin: 0 20px; text-align: center">
                  <v-text-field 
                    v-model="connectionEmail"
                    label="exemple@domaine.com"
                    :rules="emailRules">
                  </v-text-field>
                  <v-btn 
                  :disabled="emailRules[0](connectionEmail) != true"
                  @click="getConnectionEmail"
                  >continuer</v-btn>
                </div>
              </v-card>
            </v-dialog>
          </div>
        </v-form>
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
      loginError: false,
      dialog: false,
      connectionEmailError: false,
      connectionEmailSuccess: false,
      emailRules: [ (v => /.+@.+/.test(v) || 'Invalid Email address') ],
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
    getConnectionEmail() {
      const self = this
      const formData = {
        email: this.connectionEmail,
      }
      this.$axios.post('/connectionEmail', formData).then((response) => {
        self.connectionEmailSuccess = true
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
