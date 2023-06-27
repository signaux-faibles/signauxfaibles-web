import CampaignsHeader from '@/components/campaigns/header/main.vue'
import '@toast-ui/editor/dist/toastui-editor.css';


export default {
    name: "CampaignsWelcome",
    components: {CampaignsHeader},
    computed: {
        campaigns() {return this.$store.state.campaigns},
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