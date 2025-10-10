<template>
  <div>
    <div class="d-flex align-center mb-3">
      <h2 class="ma-0 mr-3">
        Détection Signaux Faibles
      </h2>
      <v-btn
        outlined
        small
        color="primary"
        style="text-transform: none;"
        @click="openDocumentation"
      >
        Comment ça marche ?
      </v-btn>
    </div>
    <v-layout wrap>
      <v-flex xl12 md-6 mb-2> 
        <div class="mb-3">
          <span class="mr-2"><ScoreWidget size="25px" :prediction="summary" class="mr-1" /> {{ dernierBatch.text }}</span>
          <v-tooltip bottom v-if="summary.firstAlert === true">
            <template v-slot:activator="{ on, attrs }">
              <v-chip v-bind="attrs" v-on="on" class="ma-0 mr-1 chip" small color="primary" text-color="white">1re alerte</v-chip>
            </template>
            <span>Cet établissement est pour la première fois en alerte sur une liste de détection</span>
          </v-tooltip>
          <v-tooltip bottom v-if="summary.etatAdministratif == 'F'">
            <template v-slot:activator="{ on, attrs }">
              <v-chip v-bind="attrs" v-on="on" class="ma-0 mr-1 chip" small color="grey darken-4" text-color="white">Fermé</v-chip>
            </template>
            <span>Cet établissement est fermé ou l’activité de l’entreprise a cessé</span>
          </v-tooltip>
        </div>
                 <!-- Rating section -->
                 <div v-if="shouldShowRatingButtons" class="mt-4">
                   <!-- Error message -->
                   <v-alert
                     v-model="showError"
                     type="error"
                     dismissible
                     class="mb-3"
                     @input="clearError"
                   >
                     {{ errorMessage }}
                   </v-alert>
          <!-- Show existing rating status -->
          <div v-if="existingRating" class="mb-3">
            <v-chip 
              :color="existingRating.useful ? 'success' : 'warning'" 
              text-color="white"
              small
            >
              {{ ratingStatusText }}
            </v-chip>
          </div>

          <!-- Show rating buttons when no existing rating -->
          <div v-else-if="canShowRatingUI && !showRatingForm">
            <h3 class="mb-3">Donnez votre avis à l'équipe de Signaux Faibles</h3>
            <div class="d-flex flex-wrap gap-2">
              <v-btn
                color="success"
                :loading="submittingRating"
                @click="submitUsefulRating"
                style="text-transform: none;"
              >
                Détection utile
              </v-btn>
              <v-btn
                color="warning"
                @click="showInutileForm"
                style="text-transform: none;"
              >
                Détection inutile
              </v-btn>
            </div>
          </div>

          <!-- Show inutile rating form -->
          <div v-else-if="showRatingForm">
            <h3 class="mb-3">La détection est inutile :</h3>
            
            <!-- Reasons selection -->
            <v-select
              v-model="selectedReasons"
              :items="ratingReasons"
              item-text="libelle"
              item-value="code"
              label="Sélectionnez les motifs"
              multiple
              chips
              deletable-chips
              outlined
              class="mb-3"
            ></v-select>

            <!-- Comment textarea -->
            <v-textarea
              v-model="ratingComment"
              label="(Facultatif) Précisez les raisons de votre choix"
              outlined
              rows="3"
              class="mb-3"
            ></v-textarea>

            <!-- Form buttons -->
            <div class="d-flex gap-2">
              <v-btn
                color="warning"
                :loading="submittingRating"
                :disabled="selectedReasons.length === 0"
                @click="submitInutileRating"
                style="text-transform: none;"
              >
                Valider votre avis
              </v-btn>
              <v-btn
                outlined
                @click="resetRatingForm"
                style="text-transform: none;"
              >
                Annuler
              </v-btn>
            </div>
          </div>

          <!-- Loading state -->
          <div v-else-if="loadingRating" class="text-center">
            <v-progress-circular indeterminate></v-progress-circular>
          </div>
        </div>
        <Explain :summary="summary" :historique="historique"/>
        <v-btn class="mt-3"
               style="text-transform: none;"
               v-if="permScore && !this.crash && historique.length > 1"
               outlined
               dark
               color="indigo"
               @click="historiqueDialog = true"
        >
          Voir l'historique des alertes
        </v-btn>


      </v-flex>
      <v-dialog v-model="historiqueDialog" @input="historiqueDialog = false" max-width="500px">
        <div>
          <v-card>
            <v-card-title class="headline">
              Historique des alertes
            </v-card-title>
            <v-card-text style="font-size: 17px; font-weight: 800; font-family: 'Oswald', sans;">
              <div v-for="h in historique"
                    :key="h.idListe" 
                    size="25px"
                    class="pa-4">
                <ScoreWidget :prediction="h"/> 
                {{ h.idListe }}
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import ScoreWidget from '@/components/ScoreWidget.vue'
import Explain from '@/components/etablissement/score/explain.vue'
import Help from '@/components/Help.vue'

export default {
  name: 'Historique',
  props: ['historique', 'summary'],
  components: { ScoreWidget, Help, Explain },
  data() {
    return {
      historiqueDialog: false,
      existingRating: null,
      loadingRating: false,
      showRatingForm: false,
      ratingReasons: [],
      selectedReasons: [],
      ratingComment: '',
      submittingRating: false,
      errorMessage: '',
      showError: false,
    }
  },
  mounted() {
    console.log(this.historique)
    console.log(this.summary)
    console.log(this.permScore)
    console.log(this.batches)
    console.log(this.dernierBatch)
    console.log(this.crash)
    console.log(this.currentBatchKey)
    console.log(this.currentBatchDescription)
    
    // Check for existing rating when component mounts
    if (this.shouldShowRatingButtons) {
      this.checkExistingRating()
    }
  },
  methods: {
    handleApiError(error, defaultMessage = 'Une erreur est survenue') {
      this.showError = false // Reset first
      
      if (error.response && error.response.data) {
        const errorData = error.response.data
        
        // Handle structured error response from backend
        if (errorData.error && errorData.hint) {
          this.errorMessage = `${errorData.error}: ${errorData.hint}`
        } else if (errorData.details) {
          // Extract field validation errors
          this.errorMessage = `Erreur de validation: ${errorData.details}`
        } else if (errorData.message) {
          this.errorMessage = errorData.message
        } else {
          this.errorMessage = defaultMessage
        }
      } else if (error.message) {
        this.errorMessage = error.message
      } else {
        this.errorMessage = defaultMessage
      }
      
      this.showError = true
      console.error('API Error:', error)
      
      // Auto-hide error after 8 seconds
      setTimeout(() => {
        this.showError = false
      }, 8000)
    },
    
    clearError() {
      this.showError = false
      this.errorMessage = ''
    },

    async checkExistingRating() {
      if (!this.summary.siret) return
      
      this.loadingRating = true
      try {
        const response = await this.$axios.get(`/ratings/entreprise/${this.summary.siret}`)
        if (response.status === 200 && response.data && response.data.length > 0) {
          this.existingRating = response.data[0]
        }
      } catch (error) {
        if (error.response && (error.response.status === 204 || error.response.status === 404)) {
          // No rating found - this is expected when no rating exists (204 or 404)
          this.existingRating = null
        } else {
          this.handleApiError(error, 'Erreur lors de la vérification du statut d\'évaluation')
        }
      } finally {
        this.loadingRating = false
      }
    },
    
    async fetchRatingReasons() {
      try {
        const response = await this.$axios.get('/ratings/reasons')
        this.ratingReasons = response.data
      } catch (error) {
        this.handleApiError(error, 'Erreur lors du chargement des raisons d\'évaluation')
      }
    },
    
    async submitUsefulRating() {
      if (!this.summary.siret) return
      
      this.clearError() // Clear any previous errors
      this.submittingRating = true
      try {
        const payload = {
          siret: this.summary.siret,
          listLibelle: this.currentBatchKey,
          useful: true
        }
        
        await this.$axios.post('/ratings/entreprise', payload)
        // Refresh the rating status
        await this.checkExistingRating()
      } catch (error) {
        this.handleApiError(error, 'Erreur lors de l\'envoi de l\'évaluation positive')
      } finally {
        this.submittingRating = false
      }
    },
    
    async showInutileForm() {
      this.clearError() // Clear any previous errors
      this.showRatingForm = true
      await this.fetchRatingReasons()
    },
    
    async submitInutileRating() {
      if (!this.summary.siret) return
      
      this.clearError() // Clear any previous errors
      this.submittingRating = true
      try {
        const payload = {
          siret: this.summary.siret,
          listLibelle: this.currentBatchKey,
          useful: false,
          reasons: this.selectedReasons,
          comment: this.ratingComment
        }
        
        await this.$axios.post('/ratings/entreprise', payload)
        // Reset form and refresh rating status
        this.resetRatingForm()
        await this.checkExistingRating()
      } catch (error) {
        this.handleApiError(error, 'Erreur lors de l\'envoi de l\'évaluation négative')
      } finally {
        this.submittingRating = false
      }
    },
    
    resetRatingForm() {
      this.clearError() // Clear any errors when resetting
      this.showRatingForm = false
      this.selectedReasons = []
      this.ratingComment = ''
    },
    
    openDocumentation() {
      window.open('https://signaux-faibles.gitbook.io/guide-dutilisation-et-f.a.q.-de-signaux-faibles/les-listes-de-detection/evaluer-les-detections', '_blank')
    }
  },
  computed: {
    currentBatchKey() {
      return this.$store.state.currentBatchKey
    },
    currentBatchDescription() {
      const batches = this.$store.state.batches
      return (batches.filter((b) => b.id === this.currentBatchKey)[0])?.description || ''
    },
    permScore() {
      return this.summary.hasOwnProperty('permScore') ? this.summary.permScore : true
    },
    batches() {
      const batches = this.$store.getters.batches
      return batches
    },
    dernierBatch() {
      return this.batches[0]
    },
    crash() {
      return this.summary.etatAdministratif === 'F'
        || this.summary.etat_procol === 'redressement' || this.summary.etat_procol === 'liquidation'
    },
    shouldShowRatingButtons() {
      return this.summary.siege === true && 
             this.currentBatchKey === this.dernierBatch?.value &&
             !this.loadingRating
    },
    canShowRatingUI() {
      return this.shouldShowRatingButtons && this.existingRating === null
    },
    ratingStatusText() {
      if (!this.existingRating) return ''
      return this.existingRating.useful 
        ? 'Vous avez remonté à Signaux Faibles que la détection était utile'
        : 'Vous avez remonté à Signaux Faibles que la détection était inutile'
    }
  },
}
</script>
<style scoped>
.chip {
  font-family: "Roboto";
  font-size: 13px;
  font-weight: 400;
  vertical-align: text-bottom;
}

.gap-2 > * {
  margin-right: 8px !important;
  margin-bottom: 8px !important;
}

.gap-2 > *:last-child {
  margin-right: 0 !important;
}
</style>