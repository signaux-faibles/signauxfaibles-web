import {defineStore} from 'pinia'

const STORE_NAME = 'follow'
export const useFollowStore = defineStore(STORE_NAME, {
    state: () => ({
        boardIDs: [],
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
                params.boardIDs = this.boardIDs
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
    },
    persist: {
        storage: localStorage, // data in sessionStorage is cleared when the page session ends.
    },
})