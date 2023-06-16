import Card from "@/components/card/main.vue"
import ScoreWidget from "@/components/ScoreWidget.vue"
import Etablissement from "@/components/Etablissement/Main.vue"
import Entreprise from "@/components/Entreprise/main.vue"
export default {
  name: "CampaignsPendingCards",
  props: ['cards'],
  components: {Card, ScoreWidget, Etablissement, Entreprise},
  data() {
    return {
      dialogEtablissement: false,
      dialogEntreprise: false,
      siret: null,
      siren: null,
      pending: [],
    }
  },
  mounted() {
    this.getPendingEtablissements()
    this.$bus.$on('campaign-message', this.processMessage)
  },
  beforeDestroy() {
    console.log()
    this.$bus.$off()
  },
  computed: {
    campaignsSelectedID() { return this.$store.state.campaignsSelectedID }
  },
  methods: {
    processMessage(message) {
      this.getPendingEtablissements()
      this.$store.dispatch('updateCampaigns')
    },
    getPendingEtablissements() {
      this.$axios.get('/campaign/pending/' + this.campaignsSelectedID).then((r) => {
        this.pending = r.data
      })
    },
    take(campaignID, id) {
        this.$axios.get('/campaign/take/' + campaignID + '/' + id).then((r) => {
      })
    },
    etablissements() {
      return this.pending.etablissements
    },
    showEtablissement(siret) {
      this.siret = siret
      this.dialogEtablissement = true
    },
    hideEtablissement() {
      this.siret = null
      this.dialogEtablissement = false
    },
    showEntreprise(siret) {
      this.siren = siret.slice(0,9)
      this.dialogEntreprise = true
    },
    hideEntreprise() {
      this.siret = null
      this.dialogEntreprise = false
    }
  },
}