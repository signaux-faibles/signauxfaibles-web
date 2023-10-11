<template>
  <div>
    <v-select
      v-model="follow.boardIDs"
      :disabled="follow.type === 'no-card'"
      :items="boardsItems"
      :menu-props="{ maxHeight: 400 }"
      chips
      label="Tableaux"
      multiple
      prepend-icon="fab fa-trello"
      @change="notifyFollowUpdate()"
    >
      <template v-slot:selection="{ item, index }">
        <v-chip v-if="index < 3" small>
          {{ item.text }}
        </v-chip>
        <v-chip v-if="index === 3 && follow.boardIDs.length === 4" small>
          {{ item.text }}
        </v-chip>
        <span
          v-if="index === 3 && follow.boardIDs.length > 4"
          class="ml-1 text-grey text-caption align-self-center"
        >
          (+{{ follow.boardIDs.length - 3 }} autres)
        </span>
      </template>
      <template v-slot:no-data
      <template v-slot:prepend-item>
        <v-list-item v-if="!allBoardsSelected" @click="selectAll()">
          <v-list-item-action>
            <v-icon>
              fa-square-plus
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>
            tout sélectionner
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="allBoardsSelected" @click="unselectAll()">
          <v-list-item-action>
            <v-icon>
              fa-square-xmark
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>
            vider la sélection
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-select>
  </div>
</template>

<script>
import {useFollowStore} from "@/stores/followFilters";
import {sortSelect} from "@/lib/select";

export default {
  name: "FilterTableaux",
  setup() {
    const follow = useFollowStore()
    return {follow}
  },
  mounted() {
    if (this.follow.boardIDs.length == 0) {
      this.follow.boardIDs = this.allBoards
    }
  },
  methods: {
    notifyFollowUpdate() {
      this.$bus.$emit('follow-labels-reset')
      this.$bus.$emit('follow-departement-reset')
      this.$bus.$emit('follow-statut-reset')
      this.$bus.$emit('follow-update')
    },
    unselectAll() {
      this.follow.boardIDs = []
      this.notifyFollowUpdate()
    },
    selectAll() {
      this.follow.boardIDs = this.allBoards
      this.notifyFollowUpdate()
    }
  },
  computed: {
    allBoardsSelected() {
      return this.allBoards.length === this.follow.boardIDs.length
    },
    allBoards() {
      return this.boardsItems.map((b) => b.value)
    },
    boardsItems() {
      const boards = Object.entries(this.$store.state.kanbanConfig.boards || {})
      return boards.map(([k, c]) => {
        return {
          value: k,
          text: c.title.slice(8),
        }
      }).sort(sortSelect)
    },
  },
}
</script>