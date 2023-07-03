<template>
  <v-dialog v-model="followDialog" @input="closeFollowDialog()" max-width="500px">
    <v-card>
      <v-card-title>
        <div>
          <div class="headline">Suivre {{ denomination }} {{ commune }} ?</div>
          <span class="grey--text">(siret {{ siret }})</span>
        </div>
      </v-card-title>
      <v-card-text>
        Pour quel motif souhaitez-vous suivre cet établissement ?
        <v-radio-group v-model="followCategory" :mandatory="false">
          <v-radio key="detection" value="detection"><template slot="label"><span class="text-pre-wrap">L'établissement fait partie d'une <strong>liste de détection</strong></span></template></v-radio>
          <v-radio key="source_externe" value="source_externe"><template slot="label"><span class="text-pre-wrap">J'ai eu connaissance de difficultés par l'<strong>ecosystème local</strong> ou <strong>la presse</strong></span></template></v-radio>
          <v-radio key="source_interne" value="source_interne"><template slot="label"><span class="text-pre-wrap">J'ai été contacté par l'<strong>entreprise</strong> ou un <strong>partenaire direct</strong>  (expert comptable, client, fournisseur, etc.)</span></template></v-radio>
          <v-radio key="autre" value="autre"><template slot="label"><span class="text-pre-wrap">Je souhaite suivre cet établissement pour un <strong>autre motif</strong></span></template></v-radio>
        </v-radio-group>
        <v-textarea v-show="followCategory === 'autre'" v-model="followComment" solo placeholder="Résumez en une phrase vos motivations"></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeFollowDialog()">Annuler</v-btn>
        <v-btn
            :dark="followCategory!=''"
            color="indigo"
            :disabled="followCategory==''"
            @click="followEtablissement()">
        <v-icon left class="mr-2" style="top:-1px" small>far fa-star</v-icon>Suivre</v-btn>
      </v-card-actions>
      <v-alert :value="followAlert" type="error" transition="scale-transition">{{ followAlertError }}</v-alert>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      followAlert: false,
      followAlertError: '',
      followCategory: '',
      followComment: '',
    }
  },
  methods: {
    closeFollowDialog() {
      this.followAlert = false
      this.followAlertError = ''
      this.followCategory = ''
      this.followComment = ''
      this.$parent.followDialog = false
    },
    followEtablissement() {
      this.trackMatomoEvent('etablissement', 'suivre', this.siret)
      if (this.isFollowValid()) {
        const params = {}
        params.category = this.followCategory
        params.comment = this.followComment
        this.$axios.post(`/follow/${this.siret}`, params).then((response) => {
          if (response.status === 201 || response.status === 204) {
            this.followCategory = ''
            this.followComment = ''
            this.followDialog = false
            this.followAlertError = ''
            this.followAlert = false
            this.$parent.getEtablissement()
            this.$bus.$emit("follow-dialog-if-needed")
          }

        }).catch((error) => {
          this.followAlertError = 'Une erreur est survenue lors du suivi'
          this.followAlert = true
        })
      } else {
        this.followAlertError = 'Un motif de suivi doit être indiqué'
        this.followAlert = true
      }
    },
    isFollowValid() {
      return this.followCategory === 'detection'
        || this.followCategory === 'source_externe'
        || this.followCategory === 'source_interne'
        || (this.followCategory === 'autre' && this.followComment.trim().length > 0)
    },
  },
  computed: {
    followDialog: {
      get() {
        return this.$parent.followDialog
      },
      set(val) {
        this.$parent.followDialog = val
      },
    },
    siret() {return this.$parent.siret},
    commune() {return this.$parent.commune},
    denomination() {return this.$parent.denomination},
  },
}
</script>

