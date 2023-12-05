import '@toast-ui/editor/dist/toastui-editor.css';
import {Editor} from '@toast-ui/vue-editor';
import {useDialogsStore} from "@/stores/dialogs";

export default {
  name: "EtablissementCardsEditor",
  components: {Editor},
  setup() {
    const dialogs = useDialogsStore()
    return {dialogs}
  },
  props: ['siret'],
  methods: {
    saveCard() {
      const description = this.$refs.editor.invoke('getMarkdown')
      if (this.dialogs.campaignCardEditorDescription == description) {
        this.dialogs.hideEtablissementCardEditor()
        return
      }

      const params = {
        description: description,
        cardID: this.dialogs.etablissementCardEditorCardID,
      }

      this.$axios.post("/kanban/updateCard", params)
        .then(() => {
          this.$bus.$emit('edit-card', this.dialogs.etablissementCardEditorCardID)
          this.dialogs.hideEtablissementCardEditor()
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
        initialValue: this.dialogs.campaignCardEditorDescription,
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