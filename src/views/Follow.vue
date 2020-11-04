<template>
  <div>
    <Toolbar title="Suivi d'établissements" drawer />
    <div id="nodata" v-if="!loading && follow.length == 0 && init == false">
      Vous ne suivez pour le moment aucun établissement.<br />Pour ce faire,
      rendez-vous sur la fiche d'un établissement et appuyez sur le bouton
      Suivre.<br />Pour un import massif d'établissements, contactez-nous par email :<br />
      <a href="mailto:contact@signaux-faibles.beta.gouv.fr?subject=Import massif d'établissements" target="_blank"><code>contact@signaux-faibles.beta.gouv.fr</code></a>
    </div>
    <PredictionWidget
      v-for="e in etablissements"
      :key="e.siret"
      :prediction="e"
      @follow-etablissement="getFollowedEtablissements"
      @unfollow-etablissement="getFollowedEtablissements"
    />
    <v-snackbar v-model="snackbar" :bottom="true" :timeout="0" v-if="follow.length > 0">
      <v-icon dark class="mr-2">move_to_inbox</v-icon>Besoin d'un import massif ?
      <v-btn color="primary" flat href="mailto:contact@signaux-faibles.beta.gouv.fr?subject=Import massif d'établissements" target="_blank">Contactez-nous</v-btn>
      <v-btn icon @click="snackbar = false"><v-icon>clear</v-icon></v-btn> 
    </v-snackbar>
  </div>
</template>
<script>
import PredictionWidget from '@/components/PredictionWidget'
import Toolbar from '@/components/Toolbar'

export default {
  components: { PredictionWidget, Toolbar },
  data() {
    return {
      init: true,
      loading: false,
      follow: [],
      snackbar: true,
    }
  },
  mounted() {
    this.getFollowedEtablissements()
  },
  methods: {
    getFollowedEtablissements() {
      this.$axios.get('/follow').then((response) => {
        if (response.status === 200) {
          this.follow = response.data
        } else {
          this.follow = []
        }
      }).finally(() => {
        this.init = false
      })
    },
  },
  computed: {
    etablissements() {
      return this.follow.map((f) => f.etablissementSummary)
    },
    leftDrawer: {
      get() {
        return this.$store.state.leftDrawer
      },
      set(val) {
        this.$store.dispatch('setLeftDrawer', val)
      },
    },
    rightDrawer: {
      get() {
        return this.$store.state.rightDrawer
      },
      set(val) {
        this.$store.dispatch('setRightDrawer', val)
      },
    },
  },
}
</script>

<style scoped>
#nodata {
  width: 80%;
  max-width: 100%;
  height: 400px;
  margin: 200px 10%;
  position: absolute;
  vertical-align: middle;
  text-align: center;
  font-size: 24px;
}
</style>