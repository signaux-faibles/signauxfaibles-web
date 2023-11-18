<template>
  <v-layout wrap>
    <v-flex class="mb-3 status" md3 xs6>
      <followWidgetHeaders
        :card="card"
      />
    </v-flex>
    <v-flex class="pl-2 mb-3" md3 xl3 xs3>
      <FollowWidgetMembers
        :card="card"
      />
    </v-flex>
    <v-flex md6 xs12>
      <FollowWidgetSynthese
        :card="card"
        :etablissement="etablissement"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import FollowWidgetMembers from "@/components/follow/widget/members.vue";
import FollowWidgetHeaders from "@/components/follow/widget/headers.vue";
import FollowWidgetSynthese from "@/components/follow/widget/synthese.vue";

export default {
  name: "FollowWidgetCard",
  components: {FollowWidgetSynthese, FollowWidgetHeaders, FollowWidgetMembers},
  props: ['inputCard', 'etablissement'],
  data() {
    return {
      localCard: null
    }
  },
  mounted() {
    this.$bus.$on('edit-card', (cardID) => {
      if (cardID == this.card.id) {
        console.log("match")
        this.refreshCard()
      }
    })
  },
  computed: {
    card() {
      return this.localCard || this.inputCard
    }
  },
  methods: {
    refreshCard() {
      this.$axios.get("/kanban/card/get/" + this.card.id).then(
        (response) => {
          console.log("load")
          this.localCard = response.data
        }
      ).catch(
        (error) => {
          this.localCard = null
        }
      )
    },
  }
}
</script>