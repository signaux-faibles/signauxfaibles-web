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
  campaignWithdrawDialog: boolean,
  campaignWithdrawDialogCampaignID: number | null,
  campaignWithdrawDialogEtablissementID: number | null,
  campaignWithdrawDialogRaisonSociale: string | null,
  etablissementCardEditor: boolean,
  etablissementCardEditorCardID: string | null,
  etablissementCardEditorDescription: string | null,
  etablissementCardEditorDenomination: string | null,
  etablissementCardEditorCodeDepartement: string | null,
  etablissementCardEditorSiret: string | null,
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
    campaignWithdrawDialog: false,
    campaignWithdrawDialogCampaignID: null,
    campaignWithdrawDialogEtablissementID: null,
    campaignWithdrawDialogRaisonSociale: null,
    etablissementCardEditor: false,
    etablissementCardEditorCardID: null,
    etablissementCardEditorDescription: null,
    etablissementCardEditorDenomination: null,
    etablissementCardEditorCodeDepartement: null,
    etablissementCardEditorSiret: null,
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
    showCampaignCardEditor(siret: string, codeDepartement: string, denomination: string, campaignEtablissementID: string, description: string) {
      this.campaignCardEditorSiret = siret
      this.campaignCardEditorCodeDepartement = codeDepartement
      this.capmaignCardEditorDenomination = denomination
      this.campaignCardEditorCampaignEtablissementID = campaignEtablissementID
      this.campaignCardEditorDescription = description
      this.campaignCardEditor = true
    },
    hideCampaignCardEditor() {
      this.campaignCardEditor = false
      this.campaignCardEditorSiret = null
      this.campaignCardEditorCodeDepartement = null
      this.capmaignCardEditorDenomination = null
      this.campaignCardEditorCampaignEtablissementID = null
    },
    showEtablissementCardEditor(siret: string, codeDepartement: string, denomination: string, cardID: string, description: string) {
      this.etablissementCardEditorSiret = siret
      this.etablissementCardEditorCodeDepartement = codeDepartement
      this.etablissementCardEditorDenomination = denomination
      this.etablissementCardEditorCardID = cardID
      this.etablissementCardEditorDescription = description
      this.etablissementCardEditor = true
    },
    hideEtablissementCardEditor() {
      this.etablissementCardEditor = false
      this.etablissementCardEditorSiret = null
      this.etablissementCardEditorCodeDepartement = null
      this.etablissementCardEditorDenomination = null
      this.etablissementCardEditorCardID = null
    },
    showExportStats() {
      this.exportStats = true
    },
    hideExportStats() {
      this.exportStats = false
    }
  },
})