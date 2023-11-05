<template>
  <div class="members">
    <div>
      Initié par {{ kanban.fullnameFromID(card.creatorID) }}<br/>
    </div>
    <div v-if="card.assigneeIDs">
      Pris en charge par
      <span v-if="(card.assigneeIDs || []).length == 1">
                {{ kanban.fullnameFromID(card.assigneeIDs[0]) }}
                <br/>
              </span>
      <span v-else>
                <ul>
                  <li v-for="assigneeID in card.assigneeIDs" :key="assigneeID">
                    {{ kanban.fullnameFromID(assigneeID) }}
                  </li>
                </ul>
              </span>
    </div>
    <div v-if="(card.memberIDs || []).length > 0">
      Participants:
      <ul>
        <li v-for="memberID in card.memberIDs">
          {{ kanban.fullnameFromID(memberID) }}
        </li>
      </ul>
    </div>
    <div class="button">
      <v-btn v-if="!isMember" color="indigo" dark>
        je participe
      </v-btn>
      <v-btn v-if="isMember && !isLeader" color="green darken-2" dark>
        je prends en charge
      </v-btn>
      <v-btn v-if="isLeader" color="amber darken-3" dark>
        j'ai terminé
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
  display: inline;
  width: 100%;
  height: 100%;
  vertical-align: bottom;
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
  computed: {
    userID() {
      return this.kanban.config.userID
    },
    isMember() {
      return [this.card.creatorID]
        .concat(this.card.memberIDs || [])
        .concat(this.card.assigneeIDs || []).includes(this.userID)
    },
    isLeader() {
      return (this.card.assigneeIDs || []).includes(this.userID)
    },
  }
}
</script>