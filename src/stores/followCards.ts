import {defineStore} from 'pinia'
import {AxiosInstance} from "axios";

interface followCardsStore {
  cards: any[]
  currentCardID: number | null
}

function sortCards(c1: any, c2: any) {
  const member1 = (c1.userIsBoardMember)?1:0
  const member2 = (c2.userIsBoardMember)?1:0
  const time1 = (new Date(c1.lastActivity)).getTime()
  const time2 = (new Date(c2.lastActivity)).getTime()
  return (member2 - member1) || (time2 - time1)
}

export const useFollowCardsStore = defineStore('followCards', {
  state: ():followCardsStore => ({
    cards: [] as any,
    currentCardID: null,
  }),
  actions: {
    reset() {
      this.cards = []
      this.currentCardID = null
    },
    getCardPayloads(axios :AxiosInstance, siret :string) {
      this.reset()
      axios.get(`/kanban/cards/${siret}`).then((response) => {
        const cards = response.data || []
        if (cards.length > 0) {
          cards.sort(sortCards)
          this.cards = cards
          this.currentCardID = cards[0].id
        }
      })
    },
  },
  getters: {
    currentCard():any {
      return this.cards.find((c:any) => c.id == this.currentCardID)
    }
  }
})