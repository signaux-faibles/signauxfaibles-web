import {defineStore} from 'pinia'
import {AxiosInstance} from "axios";

export const useCampaignsStore = defineStore('campaigns', {
  state: () => ({
    campaigns: [] as any,
    selectedID: null as any as number,
    selectedDepartement: null as any as string,
    myActions: {etablissements: []},
    menu: 'pendingActions',
  }),
  actions: {
    getCampaigns(axios: AxiosInstance) {
      axios.get('/campaign/list').then((r) => {
        this.campaigns = r.data
      })
    },
  },
  getters: {
    campaign(): any {
      return this.campaigns.find((c: any) => c.id == this.selectedID) || {}
    },
    hasCampaigns(): boolean {
      return this.campaigns.length > 0
    }
  }
})