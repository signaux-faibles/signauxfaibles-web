<template>
  <div>
    <v-select
      v-model="follow.departements"
      :items="zoneItems"
      label="Départements"
      multiple
      prepend-icon="mdi-map-marker"
      @change="notifyFollowUpdate()"
    >
      <template v-slot:selection="{ item, index }">
        <v-chip small v-if="index < 3">
          {{ item.short }}
        </v-chip>
        <v-chip small v-if="index === 3 && follow.departements.length === 4">
          {{ item.short }}
        </v-chip>
        <span
          v-if="index === 3 && follow.departements.length > 4"
          class="text-grey text-caption align-self-center"
        >
        (+{{ follow.departements.length - 3 }} autres)
        </span>
      </template>
      <template v-slot:prepend-item>
        <v-list-item v-if="!allDepartementsSelected" @click="selectAll()">
          <v-list-item-action>
            <v-icon>
              mdi-plus-box
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>
            cocher tout
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="allDepartementsSelected" @click="unselectAll()">
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

export default {
  name: "FilterDepartement",
  setup() {
    const follow = useFollowStore()
    return {follow}
  },
  mounted() {
    this.selectAll()
  },
  methods: {
    unselectAll() {
      this.follow.departements = []
    },
    selectAll() {
      this.follow.departements = this.zoneItems.map((z) => z.value)
    },
    notifyFollowUpdate() {
      this.$bus.$emit('follow-update')
    },
  },
  computed: {
    departements() {
      return this.$store.state.departements
    },
    allDepartementsSelected() {
      return this.zoneItems.length == this.follow.departements.length
    },
    zoneItems() {
      return Object.entries(this.$store.state.kanbanConfig.departements || {})
        .map(([codeDepartement, departement]) => {
          return {
            codeDepartement,
            boardIDs: departement.map((d) => d.boardID)
          }
        })
        .filter((departement) => departement.boardIDs.some((d) => this.follow.contextIDs.includes(d)))
        .map((d) => {
          return {
            text: `${d.codeDepartement} - ${this.departements[d.codeDepartement]}`,
            value: d.codeDepartement,
            short: this.departements[d.codeDepartement],
          }
        }).sort((z1, z2) => (z1.text < z2.text) ? -1 : 1)
    }
  }
}
</script>