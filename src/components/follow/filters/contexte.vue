<template>
  <div>
    <v-select
      ref="boardMenu"
      v-model="follow.contextIDs"
      :disabled="follow.type === 'no-card'"
      :items="contextsItems"
      :menu-props="{ maxHeight: 400 }"
      chips
      label="Contexte"
      multiple
      prepend-icon="fab fa-trello"
      @change="notifyFollowUpdate()"
    >
      <template v-slot:selection="{ item, index }">
        <v-chip v-if="index < 3" small>
          {{ item.text }}
        </v-chip>
        <v-chip v-if="index === 3 && follow.contextIDs.length === 4" small>
          {{ item.text }}
        </v-chip>
        <span
          v-if="index === 3 && follow.contextIDs.length > 4"
          class="ml-1 text-grey text-caption align-self-center"
        >
          (+{{ follow.contextIDs.length - 3 }} autres)
        </span>
      </template>
      <template v-slot:prepend-item>
        <v-list-item v-if="!allContextsSelected" @click="selectAll()">
          <v-list-item-action>
            <v-icon>
              mdi-plus-box
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>
            cocher tout
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="allContextsSelected" @click="unselectAll()">
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
    this.follow.contextIDs = this.allContexts
  },
  methods: {
    notifyFollowUpdate() {
      this.$bus.$emit('follow-update')
    },
    unselectAll() {
      this.follow.contextIDs = []
      this.notifyFollowUpdate()
    },
    selectAll() {
      this.follow.contextIDs = this.allContexts
      this.notifyFollowUpdate()
    }
  },
  computed: {
    allContextsSelected() {
      return this.allContexts.length === this.follow.contextIDs.length
    },
    allContexts() {
      return this.contextsItems.map((b) => b.value)
    },
    contextsItems() {
      const contexts = Object.entries(this.$store.state.kanbanConfig.boards || {})
      return contexts.map(([k, c]) => {
        return {
          value: k,
          text: c.title.slice(8),
        }
      }).sort(sortSelect)
    },
  },
}
</script>