import FollowLabel from '@/components/follow/label/main.vue'
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt()

export default {
  name: 'FollowCardViewer',
  props: ['card', 'denomination'],
  components: {FollowLabel},
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