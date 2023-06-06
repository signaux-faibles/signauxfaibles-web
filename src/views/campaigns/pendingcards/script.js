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
      etablissements: [],
    }
  },
  methods: {
    getPendingEtablissements() {
      this.$axios.get('/campaign/pending/1').then((r) => {
        this.etablissements = r.data
      })
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