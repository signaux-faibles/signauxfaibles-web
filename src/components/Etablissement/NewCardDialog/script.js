import Help from '@/components/Help.vue'
import Step1 from './Step1.vue'
import Step2 from './Step2.vue'
import Step3 from './Step3.vue'
import Step4 from './Step4.vue'
import Step5 from './Step5.vue'

export default {
    components: {Help, Step1, Step2, Step3, Step4, Step5},
    name: 'NewCardDialog',
    props: ['codeDepartement', 'siret'],
    data() {
        return {
            boardAlert: false,
            boardAlertError: '',
            boardError: '',
            creatingCard: false,
        }
    },
    methods: {
        createNewFollowCard() {
            this.trackMatomoEvent('etablissement', 'creer_carte_suivi', this.siret)
            this.creatingCard = true
            const params = {
                description: this.formattedDescription,
                boardId:     this.currentBoard,
            }
            this.$axios.post(`/wekan/cards/${this.siret}`, params).then((response) => {
                this.problems = []
                this.actions = []
                this.boardDialog = false
                this.boardAlertError = ''
                this.boardAlert = false
                this.$parent.getBoards()
            }).catch((error) => {
                this.boardAlertError = 'Une erreur est survenue lors de la création de la carte de suivi'
                this.boardAlert = true
            }).finally(() => {
                this.creatingCard = false
            })
        },
        closeCreateCardDialog() {
            this.createCardProblems = []
            this.createCardActions = []
            this.createCardDialog = false
            this.createCardSequence = 1
            this.boardAlertError = ''
            this.boardAlert = false
        },
        boardFromID(boardID) {
            return this.kanbanConfig.boards[boardID]
        }
    },
    computed: {
        createCardSequence: {
            get() {
                return this.$store.state.createCardSequence
            },
            set(value) {
                this.$store.dispatch('setCreateCardSequence', value)
            }
        },
        createCardDialog: {
            get() {
                return this.$store.state.createCardDialog
            },
            set(value) {
                this.$store.commit('setCreateCardDialog', value)
            }
        },
        createCardProblems: {
            get() {
                return this.$store.state.createCardProblems
            },
            set(value) {
                this.$store.commit('setCreateCardProblems', value)
            }
        },
        createCardActions: {
            get() {
                return this.$store.state.createCardActions
            },
            set(value) {
                this.$store.commit('setCreateCardActions', value)
            }
        },
        kanbanConfig() {
          return this.$store.state.kanbanConfig
        },
        availableSwimlanes() {
          const swimlanes = this.kanbanConfig.departements[this.codeDepartement]
            return swimlanes.map((s) => {
                return {
                    boardTitle: this.boardFromID(s.boardID).title,
                    boardSlug: this.boardFromID(s.boardID).slug,
                    title: this.boardFromID(s.boardID).swimlanes[s.swimlaneID].title,
                    id: s.swimlaneID,
                }
            })
        },
        boards() {

        },
        // formattedDescription() {
        //     let formattedDescription = '**Difficultés :**\n'
        //     this.problems.forEach((p, i) => {
        //         formattedDescription += '- ' + p + '\n'
        //     })
        //     formattedDescription += '\n'
        //     formattedDescription += '**Actions :**\n'
        //     this.actions.forEach((a, i) => {
        //         formattedDescription += '- ' + a + '\n'
        //     })
        //     return formattedDescription
        // },
        // followCardConfig() {
        //     const board = this.boards.filter((b) => b.id === this.currentBoard)[0]
        //     if (board) {
        //         const base = board.slug.split('-')
        //         return followCardConfigBase[base[0] + '-' + base[1]]
        //     }
        //     return {
        //         problemHelpContent: {},
        //     }
        // },
        // currentBoard: {
        //     get() {
        //         return this.$parent.currentBoard
        //     },
        //     set(val) {
        //         this.$parent.currentBoard = val
        //     },
        // },
        // currentBoardHasCard() {
        //     return this.boards.filter(b => b.id == this.currentBoard && (b.cards || []).filter(c => !c.archived).length > 0).length > 0
        // },
        // currentBoardHasArchive() {
        //     return this.boards.filter(b => b.id == this.currentBoard && (b.cards || []).filter(c => c.archived).length > 0).length > 0
        // },
        // siret: {
        //     get() {
        //         return this.$parent.siret
        //     },
        //     set(val) {
        //         this.$parent.currentBoard = val
        //     },
        // },
    },
}
