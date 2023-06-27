import {useDrawersStore} from "@/stores/drawers";

export default {
  name: "CampaignsAppBar",
  data() {
    return {
      loading: false,
    }
  },
  props: ['welcome'],
  setup() {
    const drawers = useDrawersStore()
    return {drawers}
  }
}