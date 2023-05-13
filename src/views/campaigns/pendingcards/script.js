import Card from "@/components/card/main"
import ScoreWidget from "@/components/ScoreWidget.vue"

export default {
  name: "CampaignsPendingCards",
  props: ['cards'],
  components: {Card, ScoreWidget},
  methods: {
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