<template>
  <v-navigation-drawer
    v-model="drawers.right"
    :class="((drawers.right)?'elevation-6':'') + ' rightDrawer'"
    app
    right
  >
    <v-toolbar class="transparent" flat height="40">
      <v-icon :class="loading?'rotate':''" @click="drawers.hideRight()" small>fa-star</v-icon>
    </v-toolbar>
    <v-divider class="mb-1"/>
    <div class="mt-2 filter">
      <FilterTableaux v-if="follow.type != 'no-card'"/>
    </div>
    <v-divider v-if="follow.type != 'no-card'" class="mb-1"/>
    <div class="mt-2 filter">
      <FilterDepartement/>
    </div>
    <v-divider class="mb-1"/>
    <div class="mt-2 filter">
      <FilterStatut v-if="follow.type != 'no-card'"/>
    </div>
    <v-divider v-if="follow.type != 'no-card'" class="mb-1"/>
    <div v-if="follow.type != 'no-card'" class="mt-2 filter">
      <FilterLabels/>
    </div>
    <v-divider v-if="follow.type != 'no-card'" class="mb-1 filter"/>
    <div class="filter">
      <FilterRaisonSociale/>
    </div>
    <v-divider class="mb-3"/>
    <div v-if="follow.type != 'no-card'" class="filter">
      <FilterSince/>
    </div>
  </v-navigation-drawer>
</template>

<script>
import {useFollowCardsStore} from "@/stores/followCards";
import FilterTableaux from "@/components/follow/filters/boards.vue";
import FilterLabels from "@/components/follow/filters/labels.vue";
import FilterRaisonSociale from "@/components/follow/filters/raisonsociale.vue";
import FilterSince from "@/components/follow/filters/since.vue";
import FilterStatut from "@/components/follow/filters/statut.vue";
import FilterDepartement from "@/components/follow/filters/departement.vue";
import {useDrawersStore} from "@/stores/drawers";

export default {
  name: "FollowRightDrawer",
  components: {FilterDepartement, FilterStatut, FilterSince, FilterRaisonSociale, FilterLabels, FilterTableaux},
  props: ['loading'],
  setup() {
    const follow = useFollowCardsStore()
    const drawers = useDrawersStore()

    return {follow, drawers}
  }
}
</script>