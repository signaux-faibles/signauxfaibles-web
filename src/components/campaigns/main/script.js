import Toolbar from "@/components/Toolbar.vue"
import CampaignsRightDrawer from "@/components/campaigns/rightdrawer/main.vue"
import CampaignsAppBar from "@/components/campaigns/appbar/main.vue"
import CampaignsMenu from "@/components/campaigns/menu/main.vue"
import CampaignsWelcome from "@/components/campaigns/welcome/main.vue"
import CampaignsMyCards from "@/components/campaigns/myactions/main.vue"
import CampaignsPendingCards from "@/components/campaigns/pending/main.vue"
import CampaignsAllCards from "@/components/campaigns/allactions/main.vue"
import {fetchEventSource} from "@microsoft/fetch-event-source";
import Entreprise from "@/components/Entreprise/main.vue";
import Etablissement from "@/components/Etablissement/Main.vue";
import {useDrawersStore} from "@/stores/drawers";

export default {
    name: "Campaigns",
    components: {
        Etablissement,
        Entreprise,
        CampaignsRightDrawer,
        Toolbar,
        CampaignsAppBar,
        CampaignsMenu,
        CampaignsWelcome,
        CampaignsMyCards,
        CampaignsPendingCards,
        CampaignsAllCards
    },
    setup() {
        const drawers = useDrawersStore()
        return {drawers}
    },
    mounted() {
        this.campaignsMenu = 'pending'
        // this.campaignsSelectedID = null
        if (this.urlCampaignID) {
            this.campaignsSelectedID = this.urlCampaignID
        } else {
            this.campaignsSelectedID = null
        }
        this.drawers.hideRight()

        this.watchSSE(this.$bus)
        this.$bus.$on('campaign-message', this.updateCampaigns)
    },
    props: ['urlCampaignID'],
    watch: {
        urlCampaignID(newID) {
            this.campaignsSelectedID = newID
        }
    },
    beforeDestroy() {
        this.SSESignal.abort()
    },
    methods: {
        updateCampaigns() {
            this.$store.dispatch('updateCampaigns')
        },
        async watchSSE(bus) {
            await fetchEventSource(`http://localhost:3000/campaign/stream`, {
                method: "GET",
                headers: {
                    Accept: "text/event-stream",
                    Authorization: `Bearer ${this.$keycloak.token}`
                },
                signal: this.SSESignal.signal,
                onopen(res) {
                    if (res.ok && res.status === 200) {
                        console.log("Connection made ", res);
                    } else if (
                        res.status >= 400 &&
                        res.status < 500 &&
                        res.status !== 429
                    ) {
                        console.log("Client side error ", res);
                    }
                },
                onmessage(event) {
                    const message = JSON.parse(event.data)
                    bus.$emit("campaign-message", message)
                },
                onclose() {
                    console.log("Connection closed by the server");
                },
                onerror(err) {
                    console.log("There was an error from server", err);
                },
            });
        }
    },
    computed: {
        welcome() {
            return this.campaignsSelectedID == null
        },
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
            SSESignal: new AbortController()
        }
    }
}