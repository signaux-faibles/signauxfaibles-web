export default {
  name: "CampaignsAllCards",
  props: ['cards'],
  methods: {
    username(email) {
      const users = {
        "christophe.ninucci@beta.gouv.fr": "Christophe Ninucci",
        "elodie.quezel@finances.gouv.fr": "Élodie Quézel"
      }
      return users[email]
    }
  },
  computed: {
    kanbanConfig() {
      return this.$store.state.kanbanConfig
    },
    doneCards() {
      return this.cards
        .filter((c) => c.done && c.assignee != 'nobody')
        .map((c) => {
          c.username = this.username(c.assignee)
          return c
        })
    },
    canceledCards() {
      return this.cards
        .filter((c) => !c.done && (c.canceled || []).length > 0 && c.assignee == 'nobody')
        .map((c) => {
          c.username = this.username(c.canceled[0])
          return c
        })
    },
    wipCards() {
      return this.cards
        .filter((c) => !c.done && c.assignee != 'nobody')
        .map((c) => {
          c.username = this.username(c.assignee)
          return c
        })
    },
    wipStats() {
      return this.wipCards.reduce((m, c) => {
        m[c.assignee] = (m[c.assignee] || 0) + 1
        return m
      }, {})
    },
    pendingCards() {
      return this.cards
        .filter((c) => !c.done && c.assignee == 'nobody')
    },
    pendingStats() {
      return this.pendingCards.length
    }
  },
  data() {
    return {
      wipHeaders: [
        {
          text: 'Raison Sociale',
          align: 'start',
          value: 'raison_sociale',
        },
        {text: 'Agent', value: 'username'},
        {text: 'siret', value: 'siret'},
      ],
      doneHeaders: [
        {
          text: 'Raison Sociale',
          align: 'start',
          value: 'raison_sociale',
        },
        {text: 'Agent', value: 'username'},
        {text: 'siret', value: 'siret'},
      ],
      canceledHeaders: [
        {
          text: 'Raison Sociale',
          align: 'start',
          value: 'raison_sociale',
        },
        {text: 'Agent', value: 'username'},
        {text: 'siret', value: 'siret'},
      ],
      pendingHeaders: [
        {
          text: 'Raison Sociale',
          align: 'start',
          value: 'raison_sociale',
        },
        {text: 'siret', value: 'siret'},
      ]
    }
  }
}