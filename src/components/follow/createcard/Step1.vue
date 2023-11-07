<template>
    <v-card>
        <v-card-title>

        </v-card-title>

        <v-card-text height="300px">
            <h3>À quel titre souhaitez vous prendre en charge cet établissement ?</h3>
          {{ kanbanConfig.departements }}
            <v-radio-group
                    v-model="createCardSwimlaneID"
                    mandatory
                    @change="resetCreateCard"
            >
                <v-radio v-for="swimlane in availableSwimlanes" :key="swimlane.index"
                         :label="swimlane.boardTitle"
                         :value="swimlane.id"
                ></v-radio>
            </v-radio-group>
            <v-alert
                density="compact"
                border="left"
                type="error"
                elevation="3"
                title="Avertissement"
                v-if="cardsForCurrentSwimlaneID"
            >
                Cet établissement est déjà présent dans ce tableau, souhaitez-vous vraiment créer une nouvelle entrée ?
            </v-alert>
            <v-alert
                density="compact"
                type="error"
                elevation="3"
                title="Avertissement"
                v-if="archivedCardsForCurrentSwimlaneID && !cardsForCurrentSwimlaneID"
            >
                Cet établissement a une entrée archivée dans ce tableau, en avez-vous pris connaissance avant de vouloir créer une nouvelle entrée ?
            </v-alert>
            <v-alert
                    colored-border
                    type="info"
            >
                Le choix que vous opérez ici définit l'ensemble des personnes avec lesquelles vous partagez les informations de suivi.
            </v-alert>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="mb-2" color="indigo" outlined @click="closeCreateCardDialog()">
              ne pas créer
            </v-btn>
            <v-btn class="mb-2" color="indigo" dark @click="createCardSequence=2">
              Étape suivante
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: "Step1",
    props: ['codeDepartement', 'cards'],
    methods: {
        boardFromID(boardID) {
            return this.kanbanConfig.boards[boardID]
        },
        resetCreateCard() {
            this.$store.commit('setCreateCardLabels', [])
            this.$store.commit('setCreateCardProblems', [])
            this.$store.commit('setCreateCardActions', [])
        },
        closeCreateCardDialog() {
          this.createCardDialog = false
        },
    },
    computed: {
        createCardSwimlaneID: {
            get() {
                return this.$store.state.createCardSwimlaneID
            },
            set(value) {
                this.$store.commit('setCreateCardSwimlaneID', value)
            }
        },
        createCardDialog: {
          get() { return this.$store.state.createCardDialog },
          set(value) { return this.$store.dispatch('setCreateCardDialog', value)},
        },
        createCardSequence: {
            get() {
                return this.$store.state.createCardSequence
            },
            set(value) {
                this.$store.commit('setCreateCardSequence', value)
            }
        },
        cardsForCurrentSwimlaneID() {
          return this.cards.filter((c) => c.swimlaneID == this.createCardSwimlaneID && !c.archived).length
        },
        archivedCardsForCurrentSwimlaneID() {
            return this.cards.filter((c) => c.swimlaneID == this.createCardSwimlaneID && c.archived).length
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
                    boardID: this.boardFromID(s.boardID).id,
                    title: this.boardFromID(s.boardID).swimlanes[s.swimlaneID].title,
                    id: s.swimlaneID,
                }
            }).sort((s1, s2) => (s1.boardTitle < s2.boardTitle) ? -1 : 1)
        },
    }
}
</script>