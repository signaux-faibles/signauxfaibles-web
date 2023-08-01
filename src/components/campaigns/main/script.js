import Toolbar from "@/components/Toolbar.vue"
import CampaignsRightDrawer from "@/components/campaigns/rightdrawer/main.vue"
import CampaignsAppBar from "@/components/campaigns/appbar/main.vue"
import CampaignsMenu from "@/components/campaigns/menu/main.vue"
import CampaignsWelcome from "@/components/campaigns/welcome/main.vue"
import CampaignsMyActions from "@/components/campaigns/myactions/main.vue"
import CampaignsPendingActions from "@/components/campaigns/pendingActions/main.vue"
import CampaignsTakenActions from "@/components/campaigns/takenactions/main.vue"
import {fetchEventSource} from "@microsoft/fetch-event-source";
import Entreprise from "@/components/entreprise/main.vue";
import Etablissement from "@/components/etablissement/Main.vue";
import {useDrawersStore} from "@/stores/drawers";
import {useCampaignsStore} from "@/stores/campaigns";

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
        CampaignsMyActions,
        CampaignsPendingActions,
        CampaignsTakenActions
    },
    setup() {
        const drawers = useDrawersStore()
        const campaigns = useCampaignsStore()
        return {drawers, campaigns}
    },
    mounted() {
        this.watchSSE(this.$bus)
        this.drawers.hideRight()
        this.campaigns.selectedID = this.urlCampaignID
        this.campaigns.getCampaigns(this.$axios)
        this.$bus.$on('campaign-message', () => {this.campaigns.getCampaigns(this.$axios)})
    },
    props: ['urlCampaignID'],
    watch: {
        urlCampaignID(newID) {
            this.campaigns.selectedID = newID
        }
    },
    beforeDestroy() {
        this.SSESignal.abort()
    },
    methods: {
        async watchSSE(bus) {
            await fetchEventSource(process.env.VUE_APP_DATAPI_BASE_URL + `campaign/stream`, {
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
            return this.campaigns.selectedID == null
        },
    },
    data() {
        return {
            type: "blank",
            SSESignal: new AbortController()
        }
    }
}