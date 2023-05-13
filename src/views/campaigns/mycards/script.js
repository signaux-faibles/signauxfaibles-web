import ScoreWidget from "@/components/ScoreWidget.vue";
import Card from "@/components/card/main";

export default {
  name: "CampaignsMyCards",
  components: {Card, ScoreWidget},
  props: ['cards'],
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
    myCards() {
      return this.cards.filter((c) => c.assignee == this.jwt.email && !c.done )
    }
  }
}