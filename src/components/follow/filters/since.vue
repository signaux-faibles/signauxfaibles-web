<template>
  <v-dialog
    ref="menuSince"
    v-model="menuSince"
    :return-value.sync="follow.since"
    persistent
    width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="sinceDate"
        clearable

        label="Modifiée depuis"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
        @click:clear="() => {follow.since=null; notifyFollowUpdate()}"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="follow.since"
      locale="fr"
      scrollable
      :limits="limit"
    >
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        text
        @click="menuSince = false"
      >
        ANNULER
      </v-btn>
      <v-btn
        color="primary"
        text
        @click="$refs.menuSince.save(follow.since); notifyFollowUpdate()"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
import {useFollowStore} from "@/stores/followFilters";

export default {
  name: "FilterSince",
  setup() {
    const follow = useFollowStore()
    return {follow}
  },

  methods: {
    notifyFollowUpdate() {
      this.$bus.$emit('follow-update')
    },
  },
  computed: {
    sinceDate: {
      get() {
        if (this.follow.since) {
          return (new Date(this.follow.since)).toLocaleDateString('fr')
        }
      },
      set() {

      }
    },
  }
  ,
  data() {
    return {
      menuSince: false,
      limit: {max: (new Date()).toLocaleDateString()}
    }
  }
}
</script>