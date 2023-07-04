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
        return '<utilisateur non trouvé>' as string
      }
    },
  //   users(): any {
  //     if (this.config.users) {
  //       const users: any = Object.entries(this.config.users)
  //       return users.reduce((m: any, [id, user]: [any, any]) => {
  //         user.id = id
  //         m[user.username] = user
  //         return m
  //       }, {})
  //     }
  //   }
  }
})