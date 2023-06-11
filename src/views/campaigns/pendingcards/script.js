import Card from "@/components/card/main"
import ScoreWidget from "@/components/ScoreWidget.vue"
import Etablissement from "@/components/Etablissement/Main.vue"
import Entreprise from "@/components/Entreprise.vue"
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
    this.subscribe(this.campaignsSelectedID)
  },
  computed: {
    campaignsSelectedID() { return this.$store.state.campaignsSelectedID }
  },
  methods: {
    subscribe(campaignID) {
      const evtSource = new EventSource("/campaign/event/" + campaignID);
    },
    getPendingEtablissements() {
      this.$axios.get('/campaign/pending/' + this.campaignsSelectedID).then((r) => {
        this.pending = r.data
      })
    },
    take(campaignID, id) {
      this.$axios.get('/campaign/take/' + campaignID + '/' + id).then((r) => {
        this.getPendingEtablissements()
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