import Toolbar from "@/components/Toolbar.vue"
import CampaignsRightDrawer from "@/views/campaigns/rightdrawer/main.vue"
import CampaignsAppBar from "@/views/campaigns/appbar/main.vue"
import CampaignsMenu from "@/views/campaigns/menu/main.vue"
import CampaignsWelcome from "@/views/campaigns/welcome/main.vue"
import CampaignsMyCards from "@/views/campaigns/myactions/main.vue"
import CampaignsPendingCards from "@/views/campaigns/pendingcards/main.vue"
import CampaignsAllCards from "@/views/campaigns/allactions/main.vue"

export default {
  name: "Campaigns",
  components: {CampaignsRightDrawer, Toolbar, CampaignsAppBar, CampaignsMenu, CampaignsWelcome, CampaignsMyCards, CampaignsPendingCards, CampaignsAllCards},
  mounted() {
    this.campaignsMenu = 'pending'
    // this.campaignsSelectedID = null
    this.rightDrawer = false
    if (this.urlCampaignID) {
      this.campaignsSelectedID = this.urlCampaignID
      this.rightDrawer = true
    } else {
      this.campaignsSelectedID = null
    }
  },
  props: ['urlCampaignID'],
  watch: {
    urlCampaignID(newID, oldID) {
      console.log(newID)
      this.campaignsSelectedID=newID
    }
  },
  computed: {
    rightDrawer: {
      get() {
        return this.$store.state.rightDrawer
      },
      set(value) {
        return this.$store.dispatch("setRightDrawer", value)
      }
    },
    welcome() { return this.campaignsSelectedID == null },
    campaignsSelectedID: {
      get() {
        return this.$store.state.campaignsSelectedID
      },
      set(value) {
        return this.$store.commit('setCampaignsSelectedID', value)
      },
    },
    campaignsMenu: {
      get() {
        return this.$store.state.campaignsMenu
      },
      set(value) {
        return this.$store.dispatch('setCampaignsMenu', value)
      }
    },
  },
  data() {
    return {
      type: "blank",
    }
  }
}