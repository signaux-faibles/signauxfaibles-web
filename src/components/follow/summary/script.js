import Help from "@/components/Help.vue";
import MarkdownIt from "markdown-it";

import '@toast-ui/editor/dist/toastui-editor.css'
import {Editor} from '@toast-ui/vue-editor'
import '@toast-ui/editor/dist/i18n/fr-fr'

export default {
  name: 'FollowSummary',
  props: ['card', 'denomination'],
  components: {Help, Editor},
  data() {
    return {
      cardMenu: false
    }
  },
  methods: {
    closeCardMenu() {
      console.log('coucou')
      this.cardMenu = false
    },
    unarchiveCard(cardId) {
      this.$axios(`/kanban/unarchive/${this.card.id}`).then(() => {
        this.$bus.$emit('unarchive-card')
      })
    },
  },
  computed: {
    editorOptions() {
      return {
        minHeight: '200px',
        language: 'fr-FR',
        useCommandShortcut: true,
        usageStatistics: false,
        hideModeSwitch: true,
        toolbarItems: [
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
          ['code', 'codeblock'],
          ['scrollSync'],
        ]
      }
    },
    startDate() {
      return new Date(this.card.startAt).toLocaleDateString()
    },
    endDate() {
      return new Date(this.card.endAt).toLocaleDateString()
    },
    lastActivityDate() {
      return new Date(this.card.lastActivity).toLocaleDateString()
    },
    description() {
      return this.card.description
    }
  }
}