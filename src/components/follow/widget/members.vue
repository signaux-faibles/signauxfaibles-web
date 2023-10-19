<template>
  <div>
    Initié par {{ kanban.fullnameFromID(card.creatorID) }}<br/>
    <div v-if="card.assigneesID">
      Pris en charge par
      <span v-if="(card.assigneesID || []).length == 1">
                {{ kanban.fullnameFromID(card.assigneesID[0]) }}
                <br/>
              </span>
      <span v-else>
                <ul>
                  <li v-for="assigneeID in card.assigneesID" :key="assigneeID">
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
  </div>
</template>
<script>
export default {
  name: 'FollowWidgetMembers',
  props: ['card'],
  setup() {
    const kanban = useKanbanStore()
    return {kanban}
  }
}
</script>