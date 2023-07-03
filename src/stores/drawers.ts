import {defineStore} from 'pinia'

export const useDrawersStore = defineStore('drawers', {
    state: () => ({
        left: true,
        right: true,
    }),
    actions: {
        showLeft() {
            this.left = true
        },
        hideLeft() {
            this.left = false
        },
        showRight() {
            this.right = true
        },
        hideRight() {
            this.right = false
        },
    },
})