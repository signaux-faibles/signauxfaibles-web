import FollowCardEditor from "@/components/follow/cardViewer/main.vue";
import FollowSummary from "@/components/follow/summary/main.vue";
import FollowCreateCard from "@/components/follow/createcard/main.vue";
import FollowCardViewer from "@/components/follow/cardViewer/main.vue";

export default {
  name: 'FollowCards',
  components: {FollowCardViewer, FollowCreateCard, FollowSummary, FollowCardEditor},
  props: ['siret', 'codeDepartement', 'denomination'],
  mounted() {
    this.$bus.$on('create-card', this.getCardPayloads)
    this.$bus.$on('unarchive-card', this.getCardPayloads)
    this.$bus.$on('follow-dialog-if-needed', this.showCreateCardDialog)
    this.editCardID = null
    this.getCardPayloads()
  },
  data() {
    return {
      cards: [],
    }
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
    followed() {
      return this.$parent.followed
    },
    getCardPayloads() {
      this.$axios.get(`/kanban/cards/${this.siret}`).then((response) => {
        this.cards = response.data || []
        this.cards.sort((c1, c2) => ((new Date(c1.lastActivity)).getTime() > (new Date(c2.lastActivity)).getTime())?-1:1 )
        if (this.cards.length > 0) {
          this.editCardID = this.cards[0].id
        }
      })
    },
    showCreateCardDialog() {
      if (this.canCreateCard) {
        this.createCardDialog = true
      }
    },
  },
  computed: {
    kanbanConfig() {
      return this.$store.state.kanbanConfig
    },
    currentCard() {
      return this.cards.find((c) => c.id == this.editCardID)
    },
    canCreateCard() {
      return (this.codeDepartement in this.kanbanConfig.departements)
    },
    createCardDialog: {
      get() {
        return this.$store.state.createCardDialog
      },
      set(value) {
        this.$store.dispatch('setCreateCardDialog', value)
      }
    },
    editCardID: {
      get() {
        return this.$store.state.editCardID
      },
      set(value) {
        this.$store.dispatch('setEditCardID', value)
      },
    }
  }
}