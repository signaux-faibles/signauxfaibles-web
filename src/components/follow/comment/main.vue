<template>
  <div>
    <v-card class="pa-2 mb-2" outlined>
      <h5>{{ kanban.fullnameFromID(comment.authorID) }}, le {{ date(comment.createdAt) }}</h5>
      <v-card-text>
        <Viewer
          ref="viewer"
          :initialValue="comment.comment"
          initialEditType="wysiwyg"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
</style>

<script>
import {Viewer} from "@toast-ui/vue-editor";
import {useKanbanStore} from "@/stores/kanban";

export default {
  name: "FollowComment",
  props: ["comment"],
  components: {Viewer},
  setup() {
    const kanban = useKanbanStore()
    return {kanban}
  },
  methods: {
    date(isodate) {
      return new Date(isodate).toLocaleDateString()
    }
  }
}
</script>