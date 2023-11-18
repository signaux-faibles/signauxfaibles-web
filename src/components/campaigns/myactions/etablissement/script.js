import Card from '@/components/card/main.vue'
import ScoreWidget from "@/components/ScoreWidget.vue";
import {useDialogsStore} from "@/stores/dialogs";
import StatusLabels from "@/assets/campaignStatus.json";

export default {
    name: 'CampaignEtablissement',
    props: ['etablissement'],
    components: {Card, ScoreWidget},
    setup() {
        const dialogs = useDialogsStore()
        return {dialogs}
    },
    methods: {
        showCampaignCardEditor() {
            this.dialogs.showCampaignCardEditor(
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
            this.successDialog = false
        },
        hideCancel() {
            this.cancelRadio = null
            this.campaignEtablissementSelectedID = null
            this.cancelDialog = false
        },
        cancel() {
            this.$axios.post(
                '/campaign/cancel/' + this.etablissement.campaignID + '/' + this.etablissement.id,
                {detail: this.cancelRadio}
            ).then((r) => {
                    this.hideCancel()
                }
            )
        },
        success() {
            let params = {
                detail: this.successRadio,
            }
            if (this.currentLabel.effect) {
                params['effect'] = {type: this.currentLabel.effect, cardID: this.etablissement.cardID}
            }
            this.$axios.post(
                '/campaign/success/' + this.etablissement.campaignID + '/' + this.etablissement.id,
                params
            ).then((r) => {
                    this.hideSuccess()
                }
            )
        },
        successHook(successRadio) {
            console.log(StatusLabels)
        }
    },
    computed: {
        statusLabels() {
            return StatusLabels
        },
        cancelLabels() {
            return StatusLabels.cancel
        },
        successLabels() {
            return StatusLabels.success
        },
        currentLabel() {
            return this.successLabels[this.successRadio]
        }
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