<template>
  <div>
    <v-select
      ref="labelMenu"
      v-model="follow.labels"
      :disabled="follow.type === 'no-card'"
      :items="labelItems"
      :menu-props="{ maxHeight: 400 }"
      chips
      label="Étiquettes"
      multiple
      prepend-icon="mdi-label"
      style="margin-bottom: -30px"
      @change="notifyFollowUpdate()"
    >
      <template v-if="follow.labels.length > 0" v-slot:prepend-inner>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" @click="resetLabels()" v-on="on">
              mdi-close
            </v-icon>
          </template>
          Réinitialiser la sélection
        </v-tooltip>
      </template>
      <template v-slot:selection="{ item, index }">
        <v-chip v-if="index < 3" :color="item.background" :text-color="item.front"
                small>
          {{ item.text }}
        </v-chip>
        <v-chip v-if="index === 3 && follow.labels.length === 4" :color="item.background" :text-color="item.front"
                small>
          {{ item.text }}
        </v-chip>
        <span
          v-if="index === 3 && follow.labels.length > 4"
          class="ml-1 text-grey text-caption align-self-center"
        >
        (+{{ follow.labels.length - 3 }} autres)
        </span>
      </template>
      <template v-slot:item="{ active, item, attrs, on }">
        <v-chip :color="item.background" :text-color="item.front">{{ item.text }}</v-chip>
      </template>
    </v-select>
    <div>
      <v-checkbox
        v-model="follow.labelMode"
        false-value="or"
        label="tout l'assortiment"
        true-value="and"
        @change="notifyFollowUpdate()"
      ></v-checkbox>
    </div>
  </div>
</template>

<script>
import {useFollowStore} from "@/stores/followFilters";
import labelColors from "@/assets/labels.json";

export default {
  name: "FilterLabels",
  setup() {
    const follow = useFollowStore()
    return {follow}
  },
  mounted() {
    this.$bus.$on('follow-labels-reset', this.resetLabels)
  },
  data() {
    return {
      labelMenu: false,
    }
  },
  methods: {
    notifyFollowUpdate() {
      this.$bus.$emit('follow-update')
    },
    resetLabels() {
      this.follow.labels = []
    }
  },
  computed: {
    labelItems() {
      const boards = Object
        .entries(this.$store.state.kanbanConfig.boards || {})
        .filter(([boardID, _]) => (this.follow.boardIDs.includes(boardID)))
      const labels = boards.reduce((m, [_, board]) => {
        Object.entries(board.labels).forEach(([_, label]) => {
          if (label.name !== '') {
            m[label.name] = labelColors[label.color]
          }
        })
        return m
      }, {})
      return Object.entries(labels).map(([name, color]) => {
        return {
          text: name,
          background: color.background,
          front: color.front,
          value: name,
        }
      }).sort((label1, label2) => {
        return (label1.background + label1.text.toUpperCase() < label2.background + label2.text.toUpperCase()) ? -1 : 1
      })
    },
  }
}
</script>