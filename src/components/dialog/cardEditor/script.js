import {useDialogsStore} from "@/stores/dialogs";
import Help from "@/components/Help.vue";
import FollowCardEditor from "@/components/follow/cardEditor/main.vue";

export default {
    name: 'DialogCardEditor',
    components: {FollowCardEditor, Help},
    setup() {
        const dialogs = useDialogsStore()
        return {dialogs}
    }
}