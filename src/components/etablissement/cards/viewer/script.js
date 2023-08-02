import FollowLabel from '@/components/follow/label/main.vue'
import {useKanbanStore} from "@/stores/kanban";
import {useDialogsStore} from "@/stores/dialogs";

import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/vue-editor';

export default {
  name: 'EtablissementCardsViewer',
  props: ['card', 'denomination', 'codeDepartement', 'siret'],
  components: {FollowLabel, Viewer},
  setup() {
    const kanban = useKanbanStore()
    const dialogs = useDialogsStore()
    return {kanban, dialogs}
  },
  data() {
    return {
      editorOptions: {
        usageStatistics: true,
        hideModeSwitch: true,
      },
    }
  },
  watch: {
    card() {
      if (this.$refs.viewer) {
        this.$refs.viewer.invoke('setMarkdown', this.card.description)
      }
    },
  },
  computed: {
    kanbanConfig() {
      return this.$store.state.kanbanConfig
    },
    labels() {
      const boardID = this.card.boardID
      const board = this.kanbanConfig.boards[boardID]
      if (board) {
        return (this.card['labelIDs'] || []).map((labelID) => {
          return board.labels[labelID]
        })
      }
      return []
    }
  }
}