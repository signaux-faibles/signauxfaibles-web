<template>
  <div>
    <NewCardDialog v-if="codeDepartement" :cards="cards" :codeDepartement="codeDepartement" :siret="siret"/>
    <v-toolbar class="mr-1"
               color='indigo'
               dark>
      <v-toolbar-title class="localtoolbar">
        Fiches d'accompagnement
      </v-toolbar-title>
    </v-toolbar>

    <v-container>
      <v-layout>
        <v-flex md6>
          <v-simple-table v-if="cards.length>0" class="pr-4">
            <thead>
            <tr>
              <td></td>
              <td>Statut</td>
              <td>Début</td>
              <td>Fin</td>
            </tr>
            </thead>
            <tbody>
            <follow-summary v-for="card in cards" :key="card.id" :card="card" :denomination="denomination"/>
            </tbody>
          </v-simple-table>

          <span v-if="cards.length==0">
            Aucune prise en charge de cet établissement pour le moment.
          </span>
          <div v-if="canCreateCard && followed">
            <v-btn v-if="followed && canCreateCard" class="pa-2" color="indigo" outlined
                   @click="showCreateCardDialog()">
              nouvelle prise en charge<br/>
            </v-btn>
          </div>
          <div v-if="canCreateCard && !followed">
            Pour déclarer une prise en charge, veuillez suivre cet établissement.
          </div>
          <div v-if="!canCreateCard">
            Vous avez la possibilité de déclarer une prise en charge
          </div>
        </v-flex>
        <v-flex md6 xs12>
          <FollowCardEditor v-if="currentCard" :card="currentCard"/>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
import FollowSummary from '@/components/follow/summary/main.vue'
import NewCardDialog from "@/components/follow/createcard/CreateCardDialog.vue";
import FollowCardEditor from "@/components/follow/cardEditor/main.vue";

export default {
  name: 'Cards',
  props: ['siret', 'denomination', 'codeDepartement'],
  components: {FollowCardEditor, NewCardDialog, Help, FollowSummary},
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
      }).catch((_) => {
        this.cards = []
      })
    },
  },
  mounted() {
    this.$bus.$on('create-card', this.getCardPayloads)
    this.$bus.$on('unarchive-card', this.getCardPayloads)
    this.$bus.$on('follow-dialog-if-needed', this.showCreateCardDialog)
    this.editCardID = null
    this.getCardPayloads()
  },
  computed: {
    currentCard() {
      return this.cards.find((c) => c.id == this.editCardID)
    },
    canCreateCard() {
      return (this.codeDepartement in this.kanbanConfig.departements)
    },
    boards() {

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
    editCardID: {
      get() { return this.$store.state.editCardID },
      set(value) { this.$store.dispatch('setEditCardID', value)},
    }
  },
}
</script>
