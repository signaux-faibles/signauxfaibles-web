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
    <div class="mt-6">
      <v-btn
        v-if="!isMember"
        class="button"
        color="indigo"
        @click="joinCard"
        small
        dark>
        J'accompagne
      </v-btn>
      <v-btn
        v-if="isMember"
        class="button"
        color="indigo"
        @click="partCard"
        small
        outlined
      >
        J'ai terminé
      </v-btn>
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

export default {
  name: 'FollowWidgetMembers',
  props: ['card'],
  setup() {
    const kanban = useKanbanStore()
    return {kanban}
  },
  methods: {
    joinCard() {
      this.$axios.get("/kanban/card/join/" + this.card.id).then(() => {
        this.$parent.refreshCard()
      })
    },
    partCard() {
      this.$axios.get("/kanban/card/part/" + this.card.id).then(() => {
        this.$parent.refreshCard()
      })
    }
  },
  computed: {
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
      memberNames.sort((name1, name2) => {return (name1<name2)?1:-1})
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