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
    fullname() {
      return (username: string) => {
        if (this.config.users) {
          for (const id in this.config.users) {
            if (this.config.users[id].username == username) {
              return this.config.users[id].fullname
            }
          }
        }
        return username as string
      }
    },
    visibleWekan(): boolean {
      const visibleWekanRegExp = new RegExp(process.env.VUE_APP_WEKAN_VISIBILITY_REGEXP)
      return  Object.values(this.config.boards || {}).findIndex((b: any) => visibleWekanRegExp.exec(b.slug)) != -1
    }
  }
})

