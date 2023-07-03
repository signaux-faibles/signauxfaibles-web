import {useDialogsStore} from "@/stores/dialogs";
import FollowCardViewer from "@/components/follow/cardViewer/script";

export default {
    name: 'DialogCardEditor',
    components: {FollowCardViewer},
    setup() {
        const dialogs = useDialogsStore()
        return {dialogs}
    }
}