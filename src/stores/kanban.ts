import {defineStore} from 'pinia'
import {AxiosInstance} from "axios";
import {Store} from 'vuex'
import {KanbanConfig, KanbanUser} from "@/lib/kanban";

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    config: {} as any,
  }),
  actions: {
    // récupère la configuration kanban auprès de l'API toutes les 5 minutes et l'injecte
    // dans le store Vuex pour rester compatible avec le code legacy
    getConfig(axios: AxiosInstance, store: Store<any>) {
      axios.get('/kanban/config').then((r) => {
        this.config = r.data
        // TODO: supprimer la dépendance à Vuex
        store.dispatch('updateKanbanConfig', this.config)
      })
      setTimeout(() => {this.getConfig(axios, store)}, 5*60*1000)
    },
  },
  getters: {
    fullnameFromID() {
      return (userID: string) => {
        if (this.config.users) {
          return (this.config.users[userID] || {}).fullname
        }
      }
    },
    fullname() {
      return (username: string) => {
        if (this.config.users) {
          for (const userID in this.config.users) {
            if (this.config.users[userID].username == username) {
              return (this.config.users[userID] || {}).fullname
            }
          }
        }
        return username as string
      }
    },
    board() {
      return (boardID: string) => {
        return this.config.boards[boardID].title
      }
    },
    list() {
      return (boardID: string, listID: string) => {
        return this.config.boards[boardID].lists[listID].title
      }
    },
    visibleWekan(): boolean {
      const visibleWekanRegExp = new RegExp(process.env.VUE_APP_WEKAN_VISIBILITY_REGEXP)
      return  Object.values(this.config.boards || {}).findIndex((b: any) => visibleWekanRegExp.exec(b.slug)) != -1
    },
    labels() {
      return (boardID: string, labelIDs: string[]) => {
        return (labelIDs || []).map((labelID: string) => {
          return this.config.boards[boardID].labels[labelID]
        })
      }
    }
  }
})

