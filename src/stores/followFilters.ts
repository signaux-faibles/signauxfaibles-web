import {defineStore} from 'pinia'

const STORE_NAME = 'follow'
export const useFollowStore = defineStore(STORE_NAME, {
    state: () => ({
        contextIDs: [],
        departements: [],
        statuts: [],
        since: null,
        type: 'my-cards',
        labelMode: 'or',
        labels: [],
        raisonSociale: '',
    }),
    actions: {
    },
    getters: {
        params() {
            const params = {} as any
            params.type = this.type
            params.zone = this.departements
            params.raisonSociale = this.raisonSociale

            if (params.type != 'no-card') {
                params.boardIDs = this.contextIDs
                params.lists = this.statuts

                if (this.labels.length > 0) {
                    params.labelMode = this.labelMode
                    params.labels = this.labels
                }
                if (this.since) {
                    params.since = new Date(this.since)
                }
            }
            return params
        }
    }
})