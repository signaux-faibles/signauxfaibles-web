import {defineStore} from 'pinia'
import {AxiosInstance} from "axios";
import {Store} from 'vuex'
import {KanbanConfig, KanbanList, KanbanUser, KanbanBoard} from "@/lib/kanban";

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    config: {} as KanbanConfig,
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
    },
    boardIDFromSwimlaneID () {
      const boards = Object.entries(this.config.boards)
      return function(swimlaneID: string) {
        const board = boards.find(([boardID, board]) => {
          return swimlaneID in board.swimlanes
        })
        return (board)?board[0]:undefined
      }
    },
    isCampaignBoardID() {
      const boards = this.config.boards
      return function(boardID: string) {
        const lists = (Object.values(boards[boardID].lists) || [] as KanbanList[])
        const analyseLists = lists.filter((list) => {return list.title == 'Analyse en cours'})
        return analyseLists.length > 0
      }
    },
    availableSwimlanes() {
      const config = this.config
      return function(codeDepartement: string) {
        const swimlanes = config.departements[codeDepartement]
        return swimlanes.map((swimlane: any) => {
          return {
            boardTitle: config.boards[swimlane.boardID].title,
            boardSlug: config.boards[swimlane.boardID].slug,
            boardID: swimlane.boardID,
            id: swimlane.swimlaneID,
          }
        }).sort((s1: any, s2: any) => (s1.boardTitle < s2.boardTitle) ? -1 : 1)
      }
    },
    boardType() {
      const config = this.config
      return function (boardID: string) {
        const typeRegexp = /^((tableau|actions)-.*)-.*/
        const match = config.boards[boardID].slug.match(typeRegexp) || []
        return (match.length > 1) ? match[1] : null as unknown as string
      }
    },
  }
})

