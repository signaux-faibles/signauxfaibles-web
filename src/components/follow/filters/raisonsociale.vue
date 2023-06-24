<template>
  <v-text-field
    v-model="follow.raisonSociale"
    label="raison sociale"
    @input="notifyFollowUpdate()"
  />
</template>
<script>
import {useFollowStore} from "@/stores/followFilters";

export default {
  name: "FilterRaisonSociale",
  setup() {
    const follow = useFollowStore()
    return {follow}
  },
  methods: {
    notifyFollowUpdate() {
      this.$bus.$emit('follow-update')
    },
  },
}
</script>