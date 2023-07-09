import {defineStore} from 'pinia'

interface dialogStore {
  createCard: boolean,
  etablissement: boolean,
  etablissementSiret: string | null,
  entreprise: boolean,
  entrepriseSiren: string | null,
  cards: boolean,
  cardsSiret: string | null
  cardsCodeDepartement: string | null,
  cardsDenomination: string | null,
  cardEditor: boolean,
  cardEditorCampaignEtablissementID: string | null,
  cardEditorDescription: string | null,
  cardEditorDenomination: string | null,
  cardEditorCodeDepartement: string | null,
  cardEditorSiret: string | null,
}

export const useDialogsStore = defineStore('dialogs', {
  state: ():dialogStore => ({
    createCard: false,
    etablissement: false,
    etablissementSiret: null,
    entreprise: false,
    entrepriseSiren: null,
    cards: false,
    cardsSiret: null,
    cardsCodeDepartement: null,
    cardsDenomination: null,
    cardEditor: false,
    cardEditorCampaignEtablissementID: null,
    cardEditorDescription: null,
    cardEditorDenomination: null,
    cardEditorCodeDepartement: null,
    cardEditorSiret: null,
  }),
  actions: {
    showEtablissement(siret: string) {
      this.hideEntreprise()
      this.etablissement = true
      this.etablissementSiret = siret
    },
    hideEtablissement() {
      this.etablissement = false
      this.etablissementSiret = null
    },
    showEntreprise(siren: string) {
      this.hideEtablissement()
      this.entreprise = true
      this.entrepriseSiren = siren
    },
    hideEntreprise() {
      this.entreprise = false
      this.entrepriseSiren = null
    },
    showCards(siret: string, codeDepartement: string, denomination: string) {
      this.cardsSiret = siret
      this.cardsCodeDepartement = codeDepartement
      this.cardsDenomination = denomination
      this.cards = true
    },
    hideCards() {
      this.cardsSiret = null
      this.cardsCodeDepartement = null
      this.cardsDenomination = null
      this.cards = false
    },
    showCardEditor(siret: string, codeDepartement: string, denomination: string, id: string, description: string) {
      this.cardEditorSiret = siret
      this.cardEditorCodeDepartement = codeDepartement
      this.cardEditorDenomination = denomination
      this.cardEditorCampaignEtablissementID = id
      this.cardEditorDescription = description
      this.cardEditor = true
    },
    hideCardEditor() {
      this.cardEditorSiret = null
      this.cardEditorCodeDepartement = null
      this.cardEditorDenomination = null
      this.cardEditorCampaignEtablissementID = null
      this.cardEditor = false
    }
  },
})