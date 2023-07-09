import '@toast-ui/editor/dist/toastui-editor.css';
import {Editor} from '@toast-ui/vue-editor';
import {useDialogsStore} from "@/stores/dialogs";

export default {
  name: "FollowCardEditor",
  components: {Editor},
  setup() {
    const dialogs = useDialogsStore()
    return {dialogs}
  },
  methods: {
    saveCard() {
      const description = this.$refs.editor.invoke('getMarkdown')
      if (this.dialogs.cardEditorDescription == description) {
        this.dialogs.hideCardEditor()
        return
      }

      const params = {
        description: description,
        campaignEtablissementID: this.dialogs.cardEditorCampaignEtablissementID,
      }

      this.$axios.post("/campaign/upsertcard", params)
        .then(() => {
          this.dialogs.hideCardEditor()
        }).catch(e => {
        this.createCardFailedError = "Un problème est survenu lors de l'enregistrement."
      })
    },
  },
  computed: {
    options() {
      return {
        minHeight: '400px',
        language: 'fr',
        initialValue: this.dialogs.cardEditorDescription,
        useCommandShortcut: true,
        usageStatistics: false,
        hideModeSwitch: true,
        toolbarItems: [
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task'],
          ['link', 'table'],
        ]
      }
    },
  },
  data() {
    return {
      createCardFailedError: null,
    }
  }
}