<template>
  <v-dialog v-model="unfollowDialog" @input="closeUnfollowDialog()" max-width="500px">
    <v-card>
      <v-card-title>
        <div>
          <div class="headline">Ne plus suivre {{ denomination }} {{ commune }} ?</div>
          <span class="grey--text">(siret {{ siret }})</span>
        </div>
      </v-card-title>
      <v-card-text>
        Des actions ont-elles été menées auprès de cet établissement ?
        <v-radio-group v-model="unfollowCategory" :mandatory="true">
          <v-radio key="actions" value="actions"><template slot="label"><span class="text-pre-wrap"><strong>OUI</strong>, une ou plusieurs actions</span></template></v-radio>
          <v-radio key="aucune-action" value="aucune_action"><template slot="label"><span class="text-pre-wrap"><strong>NON</strong>, aucune</span></template></v-radio>
        </v-radio-group>
        <v-textarea v-show="unfollowCategory" v-model="unfollowComment" solo :placeholder="unfollowCommentPlaceholder"></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="closeUnfollowDialog()">Annuler</v-btn>
        <v-btn dark color="indigo" @click="unfollowEtablissement()">Ne plus suivre</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      unfollowCategory: '',
      unfollowComment: '',
      unfollowCommentPlaceholder: '',
      followAlertError: '',
      followAlert: '',
    }
  },
  methods: {
    isUnfollowValid() {
      return this.unfollowCategory === 'actions'
        || this.unfollowCategory === 'aucune_action'
    },
    unfollowEtablissement() {
      this.trackMatomoEvent('etablissement', 'ne_plus_suivre', this.siret)
      if (this.isUnfollowValid()) {
        const params = {}
        params.unfollowCategory = this.unfollowCategory
        params.unfollowComment = this.unfollowComment
        this.$axios.delete(`/follow/${this.siret}`, { data: params }).then((response) => {
          if (response.status === 200 ) {
            this.$parent.followed = false
            this.unfollowCategory = ''
            this.unfollowComment = ''
            this.unfollowDialog = false
            this.followAlertError = ''
            this.followAlert = false
            this.getEtablissement()
            this.$emit('unfollow-etablissement')
          }
        }).catch((error) => {
          this.followAlertError = 'Une erreur est survenue lors du suivi'
          this.followAlert = true
        })
      } else {
        this.followAlertError = 'Veuillez indiquer si des actions ont été menées'
        this.followAlert = true
      }
    },
    closeUnfollowDialog() {
      this.unfollowCategory = ''
      this.unfollowComment = ''
      this.unfollowDialog = false
      this.followAlertError = ''
      this.followAlert = false
    },
  },

  computed: {
    siret() {return this.$parent.siret},
    unfollowDialog: {
      get() {
        return this.$parent.unfollowDialog
      },
      set(val) {
        this.$parent.unfollowDialog = val
      },
    },
    commune() {return this.$parent.commune},
    denomination() {return this.$parent.denomination},
  },
  watch: {
    unfollowCategory(val) {
      if (this.unfollowCategory === 'actions') {
        this.unfollowCommentPlaceholder = 'Précisez la nature des actions si nécessaire'
      } else {
        this.unfollowCommentPlaceholder = 'Dites-nous pourquoi ; en particulier, s\'il s\'agissait selon vous d\'une erreur de détection'
      }
    },
  },
}
</script>