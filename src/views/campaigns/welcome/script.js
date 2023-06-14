import CampaignsHeader from '@/views/campaigns/header/main.vue'
export default {
    name: "CampaignsWelcome",
    components: {CampaignsHeader},
    computed: {
        campaigns() {return this.$store.state.campaigns},
        rightDrawer: {
            get() { return this.$store.state.rightDrawer },
            set(value) { return this.$store.dispatch("setRightDrawer") },
        }
    },
    mounted() {
        this.rightDrawer = false
    }
}