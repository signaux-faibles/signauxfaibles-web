import Card from "@/components/card/main.vue"
import ScoreWidget from "@/components/ScoreWidget.vue"
import Etablissement from "@/components/Etablissement/Main.vue"
import Entreprise from "@/components/Entreprise/main.vue"
import {useDialogsStore} from "@/stores/dialogs";
export default {
  name: "CampaignsPendingCards",
  props: ['cards'],
  components: {Card, ScoreWidget, Etablissement, Entreprise},
  setup() {
    const dialogs = useDialogsStore()
    return { dialogs }
  },
  data() {
    return {
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
    processMessage() {
      this.getPendingEtablissements()
      this.$store.dispatch('updateCampaigns')
    },
    getPendingEtablissements() {
      this.$axios.get('/campaign/pending/' + this.campaignsSelectedID).then((r) => {
        this.pending = r.data
      })
    },
    take(campaignID, id) {
        this.$axios.get('/campaign/take/' + campaignID + '/' + id).then(() => {
      })
    },
    etablissements() {
      return this.pending.etablissements
    },
  },
}