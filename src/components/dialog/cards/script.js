import {useDialogsStore} from "@/stores/dialogs";
import Help from "@/components/Help.vue";
import FollowCards from "@/components/etablissement/cards/main.vue";

export default {
    name: "DialogCards",
    components: {FollowCards, Help},
    setup() {
        const dialogs = useDialogsStore()
        return {dialogs}
    }
}