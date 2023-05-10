import Toolbar from "@/components/Toolbar.vue";
import CampaignsRightDrawer from "@/views/campaigns/rightdrawer/main.vue";
import CampaignsAppBar from "@/views/campaigns/appbar/main.vue";

export default {
  name: "Campaigns",
  components: {CampaignsRightDrawer, Toolbar, CampaignsAppBar},
  mounted() {
    this.rightDrawer = true
  },
  computed: {
    rightDrawer: {
      get() {
        return this.$store.state.rightDrawer
      },
      set(value) {
        return this.$store.dispatch("setRightDrawer", value)
      }
    }
  },
  data() {
    return {
      campains: {
        campaign1: {
          title: "Signalements Juin 2023",
          due: new Date("2023-09-01"),
          active: true,
          cards: [
            {}, {}, {}, {}, {}, {}
          ]
        },
        campaign2: {
          title: "Signalements Mars 2023",
          due: new Date("2023-06-01"),
          active: false,
          cards: [
            {}, {}, {}, {}, {}, {}
          ]
        }
      }
    }
  }
}