import {useDialogsStore} from "@/stores/dialogs";
import Help from "@/components/Help.vue";
import CampaignCardEditor from "@/components/campaigns/cardEditor/main.vue";

export default {
    name: 'DialogCampaignCardEditor',
    components: {CampaignCardEditor, Help},
    setup() {
        const dialogs = useDialogsStore()
        return {dialogs}
    },
}