<template>
  <div class="members">
    <div>
      <span v-if="members.length==0"><b>Cette entreprise n'est pas accompagnée actuellement.</b><br/></span>
      <h3 v-if="members.length > 0">Accompagnants</h3>
      <ul>
        <li v-for="member in this.members" class="mt-2">
          {{ member }}
        </li>
      </ul>
    </div>
    <div class="">
      <v-menu class="ml-0 pl-0" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="indigo"
            class="mt-2 ml-0 pl-0"
            dark
            text
            small
            style="text-transform: none; position: relative; top: -2px"
            v-bind="attrs"
            @click="getMembersHistory"
            v-on="on"
          >
            <v-icon class="ml-2 mr-1" x-small>fa-user-clock</v-icon>
            Historique des accompagnements
          </v-btn>
        </template>
        <v-card class="pa-2" style="font-family: Oswald">
          <div v-if="membersHistory.length > 0">
          <h3>Historique des accompagnements</h3>
          <hr class="mb-3" style="border-color: #eee"/>

          <ul>
            <li class="pb-1" v-for="(history, _) in membersHistory">
              <MailtoUser
                :fullname="history.memberFullname"
                :email="history.memberUsername"
                :subject="'À propos de ' + Object.keys(card)"
              /> depuis le {{ history.from }} <span v-if="history.to"> jusqu'au {{ history.to }}</span>
            </li>
          </ul>
          </div>
          <div v-else>
            Cet établissement n'a jamais été accompagné au sein de Signaux-Faibles.
          </div>
        </v-card>
      </v-menu>
    </div>
    <div class="mt-6">
      <v-btn
        v-if="!isMember"
        class="button"
        color="indigo"
        dark
        small
        @click="joinCard">
        J'accompagne
      </v-btn>

      <v-btn
        v-if="isMember"
        class="button"
        color="indigo"
        outlined
        small
        @click="partCard"
      >
        J'ai terminé
      </v-btn>
      <br/>


    </div>
  </div>

</template>

<style scoped>
.members {
  font-size: 18px;
  font-weight: 400;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.button {
  text-transform: none;
  font-size: 17px;
}

</style>
<script>
import {useKanbanStore} from "@/stores/kanban";
import mailtoUser from "../../mailtoUser.vue";
import MailtoUser from "@/components/mailtoUser.vue";

export default {
  name: 'FollowWidgetMembers',
  components: {MailtoUser},
  props: ['card', 'etablissement'],
  setup() {
    const kanban = useKanbanStore()
    return {kanban}
  },
  data() {
    return {
      membersHistoryPayload: [],
      membersHistoryLoading: true,
    }
  },
  methods: {
    joinCard() {
      this.$axios.get(`/kanban/card/join/${this.card.id}`).then(() => {
        this.$parent.refreshCard()
      })
    },
    partCard() {
      this.$axios.get(`/kanban/card/part/${this.card.id}`).then(() => {
        this.$parent.refreshCard()
      })
    },
    getMembersHistory() {
      this.membersHistoryLoading = true
      this.$axios.get(`/kanban/card/membersHistory/${this.card.id}`).then((r) => {
        this.membersHistoryPayload = (r.data || []).reverse()
        this.membersHistoryLoading = false
        console.log(this.membersHistoryPayload)
      })

    },
  },
  computed: {
    mailtoUser() {
      return mailtoUser
    },
    membersHistory() {
      return this.membersHistoryPayload.map((h) => {
        return {
          memberUsername: this.kanban.usernameFromID(h.memberID),
          memberFullname: this.kanban.fullnameFromID(h.memberID),
          from: new Date(h.from).toLocaleDateString(),
          to: (h.to)?new Date(h.to).toLocaleDateString():undefined,
        }
      }).filter((h) => (h.to != h.from && h.from != '01/01/1970'))
    },
    membersIDs() {
      return (this.card.memberIDs || []).concat(this.card.assigneeIDs || [])
        .filter((memberID, index, array) => {
          return array.indexOf(memberID) === index
        })
    },
    members() {
      let memberNames = this.membersIDs.map((memberID) => {
        return this.kanban.fullnameFromID(memberID)
      })
      memberNames.sort((name1, name2) => {
        return (name1 < name2) ? 1 : -1
      })
      return memberNames
    },
    userID() {
      return this.kanban.config.userID
    },
    isMember() {
      return this.membersIDs.includes(this.userID)
    },
  }
}
</script>