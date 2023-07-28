import FollowLabel from '@/components/follow/label/main.vue'
import MarkdownIt from 'markdown-it';
import {useKanbanStore} from "@/stores/kanban";
import {acceptHMRUpdate} from "pinia";
import {useDialogsStore} from "@/stores/dialogs";

const md = new MarkdownIt()

export default {
  name: 'FollowCardViewer',
  props: ['card', 'denomination', 'codeDepartement', 'siret'
  ],
  components: {FollowLabel},
  setup() {
    const kanban = useKanbanStore()
    const dialogs = useDialogsStore()
    return { kanban, dialogs }
  },
  computed: {
    mdDescription() {
      return md.render(this.card.description || "")
    },
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