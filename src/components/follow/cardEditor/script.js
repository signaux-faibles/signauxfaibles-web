import '@toast-ui/editor/dist/toastui-editor.css';
import {Editor} from '@toast-ui/vue-editor';
// import fr from '@toast-ui/editor/dist/i18n/fr-fr'

export default {
  name: "FollowCardEditor",
  components: {Editor},
  data() {
    return {
      options: {
        minHeight: '200px',
        language: 'fr',
        useCommandShortcut: true,
        usageStatistics: false,
        hideModeSwitch: true,
        toolbarItems: [
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task'],
          ['link'],

        ]
      }
    }
  }
}