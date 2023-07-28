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
  campaignCardEditor: boolean,
  campaignCardEditorCampaignEtablissementID: string | null,
  campaignCardEditorDescription: string | null,
  capmaignCardEditorDenomination: string | null,
  campaignCardEditorCodeDepartement: string | null,
  campaignCardEditorSiret: string | null,
  exportStats: boolean,
  exportStatsRangeStart: Date | null,
  exportStatsRangeEnd: Date | null,
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
    campaignCardEditor: false,
    campaignCardEditorCampaignEtablissementID: null,
    campaignCardEditorDescription: null,
    capmaignCardEditorDenomination: null,
    campaignCardEditorCodeDepartement: null,
    campaignCardEditorSiret: null,
    exportStats: false,
    exportStatsRangeStart: null,
    exportStatsRangeEnd: null,
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
      this.campaignCardEditorSiret = siret
      this.campaignCardEditorCodeDepartement = codeDepartement
      this.capmaignCardEditorDenomination = denomination
      this.campaignCardEditorCampaignEtablissementID = id
      this.campaignCardEditorDescription = description
      this.campaignCardEditor = true
    },
    hideCardEditor() {
      this.campaignCardEditorSiret = null
      this.campaignCardEditorCodeDepartement = null
      this.capmaignCardEditorDenomination = null
      this.campaignCardEditorCampaignEtablissementID = null
      this.campaignCardEditor = false
    },
    showExportStats() {
      this.exportStats = true
    },
    hideExportStats() {
      this.exportStats = false
    }
  },
})