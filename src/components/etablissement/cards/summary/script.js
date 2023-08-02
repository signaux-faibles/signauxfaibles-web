import Help from "@/components/Help.vue";
import FollowCardEditor from "@/components/etablissement/cards/viewer/main.vue";

import '@toast-ui/editor/dist/toastui-editor.css'
import {Editor} from '@toast-ui/vue-editor'
import '@toast-ui/editor/dist/i18n/fr-fr'

export default {
  name: 'EtablissementCardsSummary',
  props: ['card', 'denomination', 'siret', 'currentCardID'],
  components: {FollowCardEditor, Help, Editor},
  data() {
    return {
      cardMenu: false
    }
  },
  mounted() {
  },
  methods: {
    trClass() {
      return (this.card.id == this.currentCardID)?"selectedCard":null
    },
    closeCardMenu() {
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
        minHeight: '300px',
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
      if (this.card.endAt) {
        return new Date(this.card.endAt).toLocaleDateString()
      } else {
        return '-'
      }
    },
    lastActivityDate() {
      return new Date(this.card.lastActivity).toLocaleDateString()
    },
    description() {
      return this.card.description
    }
  }
}