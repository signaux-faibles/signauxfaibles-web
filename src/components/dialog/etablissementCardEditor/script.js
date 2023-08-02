import {useDialogsStore} from "@/stores/dialogs";
import Help from "@/components/Help.vue";
import EtablissementCardEditor from "@/components/etablissement/cards/editor/main.vue";

export default {
    name: 'DialogEtablissementCardEditor',
    components: {EtablissementCardEditor, Help},
    setup() {
        const dialogs = useDialogsStore()
        return {dialogs}
    },
}