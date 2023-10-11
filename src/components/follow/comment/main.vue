<template>
  <div>
    <v-card outlined class="pa-2 mb-2">
    <h5>{{ author }}, le {{ date.toLocaleString() }}</h5>
      <v-card-text>
    <Viewer
      ref="viewer"
      :initialValue="comment"
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

export default {
  name: "FollowComment",
  props: ["date", "author", "comment"],
  components: {Viewer}
}
</script>