<template>
  <v-select
    v-model="follow.statuts"
    :disabled="follow.type === 'no-card'"
    :items="listsItems"
    :menu-props="{ maxHeight: 400 }"
    chips
    label="Statut"
    multiple
    prepend-icon="mdi-playlist-check"
    @change="notifyFollowUpdate()"
  >
    <template v-slot:selection="{ item, index }">
      <v-chip v-if="index < 3" small>
        {{ item.text }}
      </v-chip>
      <v-chip v-if="index === 3 && follow.statuts.length === 4" small>
        {{ item.text }}
      </v-chip>
      <span
        v-if="index === 3 && follow.statuts.length > 4"
        class="ml-1 text-grey text-caption align-self-center"
      >
          (+{{ follow.statuts.length - 3 }} autres)
        </span>
    </template>
    <template v-slot:prepend-item>
      <v-list-item v-if="!allStatutsSelected" @click="selectAll()">
        <v-list-item-action>
          <v-icon>
            mdi-plus-box
          </v-icon>
        </v-list-item-action>
        <v-list-item-title>
          cocher tout
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="allStatutsSelected" @click="unselectAll()">
        <v-list-item-action>
          <v-icon>
            mdi-close-box-outline
          </v-icon>
        </v-list-item-action>
        <v-list-item-title>
          décocher tout
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-select>

</template>

<script>
import {useFollowStore} from "@/stores/followFilters";
export default {
  name: "FilterStatut",
  setup() {
    const follow = useFollowStore()
    return {follow}
  },
  mounted() {
    this.selectAll()
  },
  methods: {
    selectAll() {
      this.follow.statuts = this.listsItems.map((s) => s.text)
      this.notifyFollowUpdate()
    },
    unselectAll() {
      this.follow.statuts = []
      this.notifyFollowUpdate()
    },
    notifyFollowUpdate() {
      this.$bus.$emit('follow-update')
    },
  },
  computed: {
    allStatutsSelected() {
      return this.listsItems.length === this.follow.statuts.length
    },
    listsItems() {
      const boards = Object
        .entries(this.$store.state.kanbanConfig.boards || {})
        .filter(([boardID, _]) => (this.follow.contextIDs.includes(boardID)))
      const dupItems = boards
        .flatMap(([_, board]) => {
          return Object.values(board.lists)
            .sort((list1, list2) => {
              return (list1.sort < list2.sort) ? -1 : 1
            })
            .map((list) => {
              return list.title
            })
        })
      const items = dupItems
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((item) => {
          return {
            text: item,
          }
        })
        .sort((i1, i2) => (i1.text < i2.text)?-1:1)
      return items
    }
  }
}
</script>