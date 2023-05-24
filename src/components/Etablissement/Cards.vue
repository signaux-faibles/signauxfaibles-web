<template>
    <div>
        <NewCardDialog v-if="codeDepartement" :siret="siret" :codeDepartement="codeDepartement" :cards="cards"/>
        <h2>
            Prise en charge de l'établissement
            <Help titre="Prise en charge de l'établissement">
                <template>

                </template>
            </Help>
        </h2>
        <v-simple-table v-if="cards.length>0">
            <tbody>
                <CardSummary v-for="card in cards" :key="card.id" :card="card" :denomination="denomination"/>
            </tbody>
        </v-simple-table>

        <span v-if="cards.length==0">
            Aucune prise en charge de cet établissement pour le moment.
        </span>
        <div v-if="canCreateCard && followed">
            <v-btn v-if="followed && canCreateCard" class="pa-2" color="indigo" outlined @click="showCreateCardDialog()">
                nouvelle prise en charge<br/>
            </v-btn>
        </div>
        <div v-if="canCreateCard && !followed">
            Pour déclarer une prise en charge, veuillez suivre cet établissement.
        </div>
        <div v-if="!canCreateCard">
            Vous avez la possibilité de déclarer une prise en charge
        </div>
    </div>
</template>

<style lang="scss" scoped>
tbody {
  tr:hover {
    background-color: transparent !important;
    border: none;
  }

  td {
    border: none;
  }
}
</style>

<script>
import Help from '@/components/Help.vue'
import CardSummary from '@/components/Etablissement/CardSummary.vue'
import NewCardDialog from "@/components/Etablissement/CreateCardDialog/CreateCardDialog.vue";

export default {
    name: 'Cards',
    props: ['siret', 'denomination', 'codeDepartement'],
    components: {NewCardDialog, Help, CardSummary},
    data() {
        return {
            cards: []
        }
    },
    methods: {
        showCreateCardDialog() {
            if (this.canCreateCard) {
                this.createCardDialog = true
            }
        },
        getCardPayloads() {
            this.$axios.get(`/kanban/cards/${this.siret}`).then((response) => {
                this.cards = response.data || []
                const myBoardIds = this.boards.filter((b) => b.isMember).map((b) => b.id)
                if (myBoardIds.length > 0 && !myBoardIds.includes(this.currentBoard)) {
                    this.currentBoard = myBoardIds[0]
                }
            }).catch((_) => {
                this.cards = []
            })
        },
    },
    mounted() {
        this.$bus.$on('create-card', this.getCardPayloads)
        this.$bus.$on('unarchive-card', this.getCardPayloads)
        this.$bus.$on('follow-dialog-if-needed', this.showCreateCardDialog)
        this.getCardPayloads()
    },
    computed: {
        canCreateCard() {
            return (this.codeDepartement in this.kanbanConfig.departements)
        },
        kanbanConfig() {
            return this.$store.state.kanbanConfig
        },
        followed() {
            return this.$parent.followed
        },
        createCardDialog: {
            get() {
                return this.$store.state.createCardDialog
            },
            set(value) {
                this.$store.dispatch('setCreateCardDialog', value)
            }
        },
    },
}
</script>
