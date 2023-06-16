import Help from '@/components/Help.vue'
import Step1 from './Step1.vue'
import Step2 from './Step2.vue'
import Step3 from './Step3.vue'
import Step4 from './Step4.vue'
import Step5 from './Step5.vue'

export default {
    components: {Help, Step1, Step2, Step3, Step4, Step5},
    name: 'NewCardDialog',
    props: ['codeDepartement', 'siret', 'cards'],
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
    },
    computed: {
        wekanUser() {
            return this.roles.includes('wekan')
        },
        kanbanConfig() {
            return this.$store.state.kanbanConfig
        },
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
    },
}
