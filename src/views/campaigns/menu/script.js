export default {
    name: "CampaignsMenu",
    computed: {
        campaignsMenu: {
            get() {
                return this.$store.state.campaignsMenu
            },
            set(value) {
                return this.$store.dispatch('setCampaignsMenu', value)
            }
        },
        campaignsSelectedID() {
            return this.$store.state.campaignsSelectedID
        },
        campaigns() {
            return this.$store.state.campaigns
        },
        campaign() {
            return this.campaigns.find((c) => c.id == this.campaignsSelectedID)
        }
    }
}