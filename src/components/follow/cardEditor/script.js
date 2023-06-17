import '@toast-ui/editor/dist/toastui-editor.css'
import {Editor, Viewer} from '@toast-ui/vue-editor'
import '@toast-ui/editor/dist/i18n/fr-fr'

export default {
  name: "FollowCardEditor",
  components: {Editor, Viewer},
  props: ['card'],
  data() {
    return {
      edit: false,
    }
  },
  mounted() {
    this.$refs.viewer.invoke('focus', 'click', this.toggleEditor)
  },
  watch: {
    card() { this.redraw() }
  },
  methods: {
    redraw() {
      this.$refs.viewer.invoke('setMarkdown', this.card.description)
    },
    nullFunction(evt) {return evt},
    hideEditor(evt) {
      this.edit = false
      return evt
    },
    showEditor(evt) {
      this.edit = true
      return evt
    },
    // getMarkdown() {
    //   let markdown = this.$refs.toastuiEditor.invoke('getMarkdown');
    //   return markdown
    // },
    editorOptions() {
      return {
        minHeight: '400px',
        language: 'fr-FR',
        useCommandShortcut: true,
        usageStatistics: false,
        hideModeSwitch: true,
        toolbarItems: [
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'link'],
          ['scrollSync'],
        ]
      }
    }
  }
}