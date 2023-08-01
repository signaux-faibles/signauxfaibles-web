import FollowCardEditor from "@/components/follow/cardViewer/main.vue";
import FollowSummary from "@/components/follow/summary/main.vue";
import FollowCreateCard from "@/components/follow/createcard/main.vue";
import FollowCardViewer from "@/components/follow/cardViewer/main.vue";
import {useKanbanStore} from "@/stores/kanban";
import {useFollowCardsStore} from "@/stores/followCards";

export default {
  name: 'FollowCards',
  components: {FollowCardViewer, FollowCreateCard, FollowSummary, FollowCardEditor},
  props: ['siret', 'codeDepartement', 'denomination'],
  setup() {
    const kanban = useKanbanStore()
    const followCards = useFollowCardsStore()
    return { kanban, followCards }
  },
  mounted() {
    this.$bus.$on('create-card', this.getCardPayloads)
    this.$bus.$on('unarchive-card', this.getCardPayloads)
    this.$bus.$on('follow-dialog-if-needed', this.showCreateCardDialog)
    this.followCards.getCardPayloads(this.$axios, this.siret)
  },
  watch: {
    siret(newval,oldval) {
      if (newval) {
        this.getCardPayloads()
      } else {
        this.cards = []
      }
    },
  },
  methods: {
    getCardPayloads() {
      this.followCards.getCardPayloads(this.$axios, this.siret)
    },
    followed() {
      return this.$parent.followed
    },
    showCreateCardDialog() {
      if (this.canCreateCard) {
        this.createCardDialog = true
      }
    },
  },
  computed: {
    canCreateCard() {
      return (this.codeDepartement in this.kanban.config.departements)
    },
    createCardDialog: {
      get() {
        return this.$store.state.createCardDialog
      },
      set(value) {
        this.$store.dispatch('setCreateCardDialog', value)
      }
    },
  }
}