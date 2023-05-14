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
    }
  },
  methods: {
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
    },
    prediction(siret) {
      return {
        "alert": "Alerte seuil F" + (siret%2 + 1),
        "visible": true,
        "inZone": true,
        "followed": false,
        "followedEntreprise": false,
        "firstAlert": false,
        "siege": true,
        "permUrssaf": true,
        "permDGEFP": true,
        "permScore": true,
        "permBDF": true,
        "secteurCovid": "nonSecteurCovid",
        "etatAdministratif": "A",
        "etatAdministratifEntreprise": "A"
      }
    }
  },
  computed: {
    pendingCards() {
      return this.cards.filter((c) => c.assignee == 'nobody' && !c.done )
    }
  },
}