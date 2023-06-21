import Card from "@/components/card/main.vue";
import FollowCardsDialog from "@/components/follow/cardsDialog/main.vue"
import Etablissement from "@/components/Etablissement/Main.vue";
import Entreprise from "@/components/Entreprise/main.vue";
import Toolbar from "@/components/Toolbar.vue";
import Help from "@/components/Help.vue";
import StatusLabels from "@/assets/campaignStatus.json"
import CampaignsEtablissement from '@/components/campaigns/etablissement/main.vue'

export default {
  name: "CampaignsMyActions",
  components: {Help, Entreprise, Etablissement, Card, Toolbar, FollowCardsDialog, CampaignsEtablissement},
  props: ['cards'],
  data() {
    return {
      myActions: null,
      siret: null,
      denomination: null,
      codeDepartement: null,
      siren: null,
      campaignEtablissementSelectedID: null,
      entrepriseDialog: false,
      etablissementDialog: false,
      successDialog: false,
      successRadio: null,
      cancelDialog: false,
      cancelRadio: null,
    }
  },
  mounted() {
    this.getMyActions(this.campaignSelectedID)
    this.$bus.$on('campaign-message', this.processMessage)
  },
  methods: {
    processMessage(message) {
      this.getMyActions()
      this.$store.dispatch('updateCampaigns')
    },
    showFollowCardsDialog(siret, denomination, codeDepartement) {
      this.siret = siret
      this.denomination = denomination
      this.codeDepartement = codeDepartement
      this.followCardsDialog = true
    },
    showSuccess(id) {
      this.campaignEtablissementSelectedID = id
      this.successDialog = true
    },
    showCancel(id) {
      this.campaignEtablissementSelectedID = id
      this.cancelDialog = true
    },
    hideSuccess() {
      this.successRadio = null
      this.campaignEtablissementSelectedID = null
      this.successDialog = false },
    hideCancel() {
      this.cancelRadio = null
      this.campaignEtablissementSelectedID = null
      this.cancelDialog = false },
    showEtablissement(siret) {
      this.siret = siret
      this.etablissementDialog = true
    },
    hideEtablissement() {
      this.siret = null
      this.etablissementDialog = false
    },
    showEntreprise(siret) {
      this.siren = siret.slice(0,9)
      this.entrepriseDialog = true
    },
    hideEntreprise() {
      this.siret = null
      this.entrepriseDialog = false
    },
    getMyActions(campaignID) {
      this.$axios.get('/campaign/myactions/' + this.campaignsSelectedID)
        .then((r) => {
          this.myActions = r.data
        })
    },
    cancel() {
      this.$axios.post(
        '/campaign/cancel/' + this.campaignsSelectedID + '/' + this.campaignEtablissementSelectedID,
        { detail: this.cancelRadio }
      ).then((r) => {
          this.hideCancel()
          this.getMyActions()
        }
      )
    },
    success() {
      this.$axios.post(
        '/campaign/success/' + this.campaignsSelectedID + '/' + this.campaignEtablissementSelectedID,
        { detail: this.successRadio }
      ).then((r) => {
          this.hideSuccess()
          this.getMyActions()
        }
      )
    }
  },
  computed: {
    followCardsDialog: {
      get() { return this.$store.state.followCardsDialog },
      set(value) { return this.$store.dispatch('setFollowCardsDialog', value)}
    },
    cancelLabels() {
      return StatusLabels.cancel
    },
    successLabels() {
      return StatusLabels.success
    },
    campaignsSelectedID() {
      return this.$store.state.campaignsSelectedID
    }
  }
}