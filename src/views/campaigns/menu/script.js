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
        }
    }
}