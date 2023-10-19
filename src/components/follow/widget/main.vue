<template>
  <div>
    <v-card class="mt-3 mb-3 elevation-3">
      <v-card-title
        class="pt-1 pl-4 pr-2 header"
        style="height: 41px"
      >
        {{ etablissement.raison_sociale }}
        <v-spacer/>
        <v-btn class="ml-2" color="indigo" compact dark small>établissement</v-btn>
        <v-btn class="ml-2" color="indigo" compact dark small>entreprise</v-btn>
      </v-card-title>
      <v-card-text
        v-for="card in etablissement.cards" :key="card.id"
        class="pt-3 body"
        style="font-family: Oswald; border-top: 2px solid darkgrey;"
      >
        <v-layout wrap>
          <v-flex
            class="mb-3" md3 xs6
          >
            <h3>{{ kanban.board(card.boardID) }}</h3>
            <h3>Statut: {{ kanban.list(card.boardID, card.listID) }}</h3>
            depuis le {{ (new Date(card.startAt)).toLocaleDateString() }} <br/>
            mis à jour le {{ (new Date(card.startAt)).toLocaleDateString() }}
            <p/>
            <div v-if="(card.labelIDs || []).length > 0">
              Catégories:
              <FollowLabel
                v-for="(label, j) in kanban.labels(card.boardID, card.labelIDs)"
                :key="j"
                :label="label"
                small
              />
            </div>
          </v-flex>
          <v-flex class="pl-2 mb-3" md3 xl3 xs3>
            <FollowWidgetMembers
              :card="card"
            />
          </v-flex>
          <v-flex md6 xs12>
            <v-card height="300px" outlined>
              <v-card-title class="pa-0 pl-2 elevation-1 synthese">
                synthèse
              </v-card-title>
              <v-card-text class="mr-0 pr-0">
                <Viewer
                  :initialValue="card.description"
                  class="scroll mr-0 pa-0"
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
                    />
                  </v-card-text>
                </v-card>
              </v-menu>
            </div>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {Viewer} from "@toast-ui/vue-editor";
import FollowComment from "@/components/follow/comment/main.vue";
import FollowLabel from "@/components/follow/label/main.vue";
import FollowWidgetMembers from "@/components/follow/widget/members.vue"
import {useKanbanStore} from "@/stores/kanban";

export default {
  name: 'FollowWidget',
  components: {FollowLabel, FollowComment, Viewer, FollowWidgetMembers},
  props: ['etablissement'],
  setup() {
    const kanban = useKanbanStore()
    return {kanban}
  },
  methods: {
    date(isodate) {
      return new Date(isodate).toLocaleDateString()
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
.scroll {
  height: 266px;
  overflow-y: scroll;
}

.smallbtn {
  width: 24px;
  min-width: 24px;
  height: 24px;
  min-width: 24px;
}

.header {
  background: linear-gradient(90deg, #aaba, rgba(180, 162, 240, 0.15) 0.3%, #0000 99.6%, #aaba);
}

.body {
  background: linear-gradient(90deg, #aaba, rgba(140, 140, 255, 0.05) 0.3%, #0000 99.6%, #aaba);;
}

.synthese {
  height: 32px;
  border-bottom: 1px solid #ccc;
  background: linear-gradient(0deg, #eee, #fff);
}
</style>