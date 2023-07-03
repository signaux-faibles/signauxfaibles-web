import {defineStore} from 'pinia'

export const useDialogsStore = defineStore('dialogs', {
  state: () => ({
    createCard: false,
    etablissement: false,
    etablissementSiret: null as unknown as string,
    entreprise: false,
    entrepriseSiren: null as unknown as string,
    cards: false,
    cardsSiret: null as unknown as string,
    cardsCodeDepartement: null as unknown as string,
    cardsDenomination: null as unknown as string,
    cardEditor: false,
    cardEditorID: null as unknown as string,
  }),
  persist: true,
  actions: {
    showEtablissement(siret: string) {
      this.hideEntreprise()
      this.etablissement = true
      this.etablissementSiret = siret
    },
    hideEtablissement() {
      this.etablissement = false
      this.etablissementSiret = null as unknown as string
    },
    showEntreprise(siren: string) {
      this.hideEtablissement()
      this.entreprise = true
      this.entrepriseSiren = siren
    },
    hideEntreprise() {
      this.entreprise = false
      this.entrepriseSiren = null as unknown as string
    },
    showCards(siret: string, codeDepartement: string, denomination: string) {
      this.cardsSiret = siret
      this.cardsCodeDepartement = codeDepartement
      this.cardsDenomination = denomination
      this.cards = true
    },
    hideCards() {
      this.cardsSiret = null as unknown as string
      this.cardsCodeDepartement = null as unknown as string
      this.cardsDenomination = null as unknown as string
      this.cards = false
    },
    showCardEditor(cardID: string) {
      this.cardEditorID = cardID
      this.cardEditor = true
    },
  },
})