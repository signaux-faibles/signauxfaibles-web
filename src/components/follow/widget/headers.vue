<template>
  <div>
    <h3>{{ kanban.board(card.boardID) }}</h3>
    <h3 class="mb-6">{{ kanban.list(card.boardID, card.listID) }}</h3>
    <div class="mb-3">
    initié le {{ (new Date(card.startAt)).toLocaleDateString() }}<br/>
    par {{ kanban.fullnameFromID(card.creatorID) }}<br/>
    </div>
    mis à jour le {{ (new Date(card.lastActivity)).toLocaleDateString() }} <br/>
    <span v-if="card.endAt">terminé le {{ (new Date(card.endAt)).toLocaleDateString() }}</span>
    <p/>
    <div v-if="(card.labelIDs || []).length > 0">
      Catégories:
      <FollowLabel
        v-for="(label, j) in kanban.labels(card.boardID, card.labelIDs)"
        :key="j"
        :label="label"
        small
      />
    </div>
  </div>
</template>

<script>
import FollowLabel from "@/components/follow/label/main.vue";
import {useKanbanStore} from "@/stores/kanban";

export default {
  name: "FollowWidgetHeaders",
  components: {FollowLabel},
  props: ['card'],
  setup() {
    let kanban = useKanbanStore()
    return {kanban}
  }
}
</script>

<style scoped>
</style>