import {useCampaignsStore} from "@/stores/campaigns";

export default {
    name: "CampaignsMenu",
    setup() {
      const campaigns = useCampaignsStore()
      return { campaigns }
    },
}