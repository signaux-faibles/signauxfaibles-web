import CampaignsHeader from '@/components/campaigns/header/main.vue'
import '@toast-ui/editor/dist/toastui-editor.css';
import {useCampaignsStore} from "@/stores/campaigns";

export default {
    name: "CampaignsWelcome",
    components: {CampaignsHeader},
    setup() {
        const campaigns = useCampaignsStore()
        return {campaigns}
    },
    data() {
        return {
            editorOptions: {
                minHeight: '200px',
                language: 'fr',
                useCommandShortcut: true,
                usageStatistics: false,
                hideModeSwitch: true,
                initialEditType: "wysiwyg",
                toolbarItems: [
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol', 'task', 'indent', 'outdent'],
                    ['table', 'link'],
                    ['code', 'codeblock'],
                    ['scrollSync'],
                ]
            }
        }
    }
}