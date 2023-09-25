import {defineStore} from 'pinia'
import {AxiosInstance} from "axios";

interface withdrawDialogStore {
  visible: boolean,
  campaignID: number | null,
  etablissementID: number | null,
  raisonSociale: string | null,
  radio: string | null,
}

export const useWithdrawDialogStore = defineStore('withdrawDialogs', {
  state: ():withdrawDialogStore => ({
    visible: false,
    campaignID: null,
    etablissementID: null,
    raisonSociale: null,
    radio: null
  }),
  actions: {
    show(campaignID: number, etablissementID: number, raisonSociale: string) {
      this.campaignID = campaignID
      this.etablissementID = etablissementID
      this.raisonSociale = raisonSociale
      this.visible = true
    },
    hide() {
      this.campaignID = null
      this.etablissementID = null
      this.raisonSociale = null
      this.radio = null
      this.visible = false
    },
    withdraw(axios: AxiosInstance) {
      axios.post(
        '/campaign/withdraw/' + this.campaignID + '/' + this.etablissementID,
        { detail: this.radio }
      ).then((r) => {
          this.hide()
        }
      )
    }
  },
})