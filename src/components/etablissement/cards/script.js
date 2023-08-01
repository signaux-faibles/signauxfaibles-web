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
        const cards = response.data || []
        if (cards.length > 0) {
          cards.sort(this.sortCards)
          this.cards = cards
          this.editCardID = cards[0].id
        }
      })
    },
    sortCards(c1, c2) {
      const member1 = (c1.userIsBoardMember)?1:0
      const member2 = (c2.userIsBoardMember)?1:0
      const time1 = (new Date(c1.lastActivity)).getTime()
      const time2 = (new Date(c2.lastActivity)).getTime()
      return (member2 - member1) || (time2 - time1)
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