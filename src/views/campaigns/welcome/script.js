import CampaignsHeader from '@/views/campaigns/header/main.vue'
export default {
    name: "CampaignsWelcome",
    components: {CampaignsHeader},
    computed: {
        campaigns() {return this.$store.state.campaigns}
    }
}