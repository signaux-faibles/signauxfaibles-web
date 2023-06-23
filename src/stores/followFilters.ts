import {defineStore} from 'pinia'

const STORE_NAME = 'follow'
export const useFollowStore = defineStore(STORE_NAME, {
    state: () => ({
        contextIDs: [],
        type: 'my-card',
    }),
    actions: {
    },
})