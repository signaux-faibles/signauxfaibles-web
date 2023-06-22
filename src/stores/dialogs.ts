import {defineStore} from 'pinia'

export const useDialogsStore = defineStore('dialogs', {
  state: () => ({
    createCard: false,
    etablissement: false,
    etablissementSiret: null as unknown as string,
    entreprise: false,
    entrepriseSiren: null as unknown as string,
    cards: false,
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
  },
})