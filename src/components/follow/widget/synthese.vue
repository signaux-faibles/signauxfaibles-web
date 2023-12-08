<template>
  <div>
    <h3 class="mb-2" style="font-size: 21px">Synthèse
      <v-btn
        class="localbtn"
        :disabled="!isMember(card)"
        color="indigo"
        :dark="isMember(card)"
        small
        @click="dialogs.showEtablissementCardEditor(etablissement.siret, etablissement.codeDepartement, etablissement.raison_sociale, card.id, card.description)"
      >
        Je complète
      </v-btn>
      {{ etablissement }}
    </h3>
    <v-card height="300px" outlined>
      <v-card-text class="mr-0 pr-0 pt-0">
        <Viewer
          ref="viewer"
          :initialValue="card.description"
          class="scroll mr-0 pr-2 pa-0 mt-0 pt-0"
        />
      </v-card-text>
    </v-card>

    <div v-if="card.comments.length > 0">
      <v-menu
        class="scroll"
        max-height="300px"
        max-width="500px"
        offset-y
      >
        <template v-slot:activator="{ attrs, on }">
          <div>
            le {{ date(card.comments[0].createdAt) }},
            {{ kanban.fullnameFromID(card.comments[0].authorID) }} a apporté des précisions
          </div>
          <v-btn
            color="indigo"
            outlined
            v-bind="attrs"
            v-on="on">
            consulter
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <followComment
              v-for="comment in card.comments"
              :key="comment.id"
              :comment="comment"
              :hook="$parent.refreshCard"
            />
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </div>
</template>
<script>
import {Viewer} from "@toast-ui/vue-editor";
import FollowComment from "@/components/follow/comment/main.vue";
import {useKanbanStore} from "@/stores/kanban";
import {useDialogsStore} from "@/stores/dialogs";

export default {
  name: "FollowWidgetSynthese",
  components: {FollowComment, Viewer},
  props: ['card', 'etablissement'],
  setup() {
    let dialogs = useDialogsStore()
    let kanban = useKanbanStore()
    return {dialogs, kanban}
  },
  methods: {
    date(isodate) {
      return new Date(isodate).toLocaleDateString()
    },
    isMember(card) {
      return [card.creatorID]
        .concat(card.memberIDs || [])
        .concat(card.assigneeIDs || []).includes(this.userID)
    },
  },
  computed: {
    userID() {
      return this.kanban.config.userID
    },
  },
  watch: {
    card() {
      if (this.$refs.viewer) {
        this.$refs.viewer.invoke('setMarkdown', this.card.description)
      }
    },
  },
}
</script>

<style scoped>
.localbtn {
  text-transform: none;
  margin-left: 20px;
  font-size: 17px;
  top: -3px;
}

.scroll {
  height: 294px;
  overflow-y: scroll;
}
</style>