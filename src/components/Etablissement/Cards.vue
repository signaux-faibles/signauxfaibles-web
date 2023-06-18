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
            À ce jour, aucune fiche d'accompagnement n'a été renseignée pour cet établissement.
          </span>
          <div v-if="canCreateCard && followed" style="margin-right: auto; margin-left: auto; text-align: center">
            <v-btn v-if="followed && canCreateCard" class="pa-2 mt-5" color="indigo" outlined
                   @click="showCreateCardDialog()">
              ajouter une fiche d'accompagnement<br/>
            </v-btn>
          </div>
          <div v-if="canCreateCard && !followed">
            Pour créer une fiche, veuillez d'abord suivre cet établissement.
          </div>
          <div v-if="!canCreateCard">
            Vous avez la possibilité de déclarer une prise en charge.
          </div>
        </v-flex>
        <v-flex md6 xs12>
          <FollowCardEditor :card="currentCard" v-if="currentCard"/>
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
        if (this.cards.length > 0) {
          this.editCardID = this.cards[0].id
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
      get() {
        return this.$store.state.editCardID
      },
      set(value) {
        this.$store.dispatch('setEditCardID', value)
      },
    }
  },
}
</script>

<style>
thead tr {
  text-align: center;
}

thead td {
  font-size: 17px !important;
}
</style>