import ScoreWidget from "@/components/ScoreWidget.vue";
import Card from "@/components/card/main";
import Etablissement from "@/components/Etablissement/Main.vue";
import Entreprise from "@/components/Entreprise.vue";
import Toolbar from "@/components/Toolbar.vue";
import Help from "@/components/Help.vue";

export default {
  name: "CampaignsMyCards",
  components: {Help, Entreprise, Etablissement, Card, ScoreWidget, Toolbar},
  props: ['cards'],
  data() {
    return {
      dialogEntreprise: false,
      dialogEtablissement: false,
      dialogSuccess: false,
      dialogFailed: false,
      successRadio: null,
      successLabels: [
        {label: "L'entreprise a besoin d'être accompagnée", value: "need"},
        {label: "L'entreprise ne souhaite pas être prise en charge", value: "refus"},
        {label: "L'entreprise n'a pas besoin de prise en charge", value: "non fondé"}
      ],
      failedRadio: null,
      failedLabels: [
        {label: "J'ai changé d'avis, car je n'aurai pas le temps", value: "no-time"},
        {label: "Il n'est pas nécessaire de prendre attache de cette entreprise", value: "need"},
        {label: "J'ai fait une erreur en sélectionnant cette entreprise", value: "non fondé"}
      ]
    }
  },
  methods: {
    showSuccess() { this.dialogSuccess = true },
    showFailed() { this.dialogFailed = true },
    hideSuccess() { this.dialogSuccess = false },
    hideFailed() { this.dialogFailed = false },
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
}