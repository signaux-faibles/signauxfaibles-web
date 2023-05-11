export default {
    name: "CampaignsPendingCards",
    props: ['cards'],
    computed: {
        username() {return this.$keycloak.token}
    }
}