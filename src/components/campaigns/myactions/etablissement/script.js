import Card from '@/components/card/main.vue'
import ScoreWidget from "@/components/ScoreWidget.vue";
import {useDialogsStore} from "@/stores/dialogs";
import StatusLabels from "@/assets/campaignStatus.json";

export default {
  name: 'CampaignEtablissement',
  props: ['etablissement'],
  components: { Card, ScoreWidget },
  setup() {
    const dialogs = useDialogsStore()
    return { dialogs }
  },
  methods: {
    showCardEditor() {
      this.dialogs.showCardEditor(
        this.etablissement.siret,
        this.etablissement.codeDepartement,
        this.etablissement.raisonSociale,
        this.etablissement.id,
        this.etablissement.description)
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
    cancel() {
      this.$axios.post(
          '/campaign/cancel/' + this.etablissement.campaignID + '/' + this.etablissement.id,
          { detail: this.cancelRadio }
      ).then((r) => {
            this.hideCancel()
          }
      )
    },
    success() {
      this.$axios.post(
          '/campaign/success/' + this.etablissement.campaignID + '/' + this.etablissement.id,
          { detail: this.successRadio }
      ).then((r) => {
            this.hideSuccess()
          }
      )
    }
  },
  computed: {
    cancelLabels() {
      return StatusLabels.cancel
    },
    successLabels() {
      return StatusLabels.success
    },
  },
  data() {
    return {
      show: false,
      successDialog: false,
      cancelDialog: false,
      successRadio: null,
      cancelRadio: null,
    }
  }
}