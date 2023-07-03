import {useDialogsStore} from "@/stores/dialogs";
import FollowCardViewer from "@/components/follow/cardViewer/script";
import Help from "@/components/Help.vue";

export default {
    name: 'DialogCardEditor',
    components: {Help, FollowCardViewer},
    setup() {
        const dialogs = useDialogsStore()
        return {dialogs}
    }
}