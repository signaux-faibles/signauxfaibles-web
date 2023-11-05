<template>
  <div>
    <v-card class="mt-3 mb-3 elevation-3">
      <v-card-title
        class="pt-2 pl-4 pr-6 header"
        style="height: 47px;"
      >
        <span style="font-family: Abel; font-size: 24px; font-weight: 800;">
          {{ etablissement.raison_sociale }}
        </span>
        <v-spacer/>
        <v-btn
          class="button"
          color="white"
          compact
          outlined
          small
          @click="dialogs.showEtablissement(etablissement.siret)"
        >
          Fiche établissement
        </v-btn>
        <v-btn
          class="ml-3 button"
          color="white"
          compact
          outlined
          small
        @click="dialogs.showEntreprise(etablissement.siret.slice(0,9))"
        >
          Fiche entreprise
        </v-btn>
      </v-card-title>
      <v-card-text
        v-for="card in etablissement.cards" :key="card.id"
        class="pt-3 body"
        style="font-family: Oswald; border-top: 2px solid darkgrey;"
      >
        <v-layout wrap>
          <v-flex
            class="mb-3 status" md3 xs6
          >
            <h3>{{ kanban.board(card.boardID) }}</h3>
            <h3>{{ kanban.list(card.boardID, card.listID) }}</h3>
            depuis le {{ (new Date(card.startAt)).toLocaleDateString() }} <br/>
            mis à jour le {{ (new Date(card.lastActivity)).toLocaleDateString() }} <br/>
            <span v-if="card.endAt">terminé le {{ (new Date(card.endAt)).toLocaleDateString() }}</span>
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
              <v-card-title style="display: block" class="pt-1 pr-2 pl-2 elevation-1 synthese">
                <span style="float: left;">synthèse
                </span>
                <span v-if="isMember(card)" style="float: right">
                  <v-btn
                  color="indigo"
                  dark
                  small
                  outlined
                  @click="dialogs.showEtablissementCardEditor(etablissement.siret, etablissement.codeDepartement, etablissement.raisonSociale, card.id, card.description)"
                  >
                  modifier
                    </v-btn>
                </span>
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
import {useDialogsStore} from "@/stores/dialogs";

export default {
  name: 'FollowWidget',
  components: {FollowLabel, FollowComment, Viewer, FollowWidgetMembers},
  props: ['etablissement'],
  setup() {
    const kanban = useKanbanStore()
    const dialogs = useDialogsStore()
    return {kanban, dialogs}
  },
  methods: {
    date(isodate) {
      return new Date(isodate).toLocaleDateString()
    },
    isMember(card) {
      console.log(card)
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
  data() {
    return {}
  },
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
  background-color: #3F51B5;
  color: white;
}

.body {
  background: linear-gradient(90deg, #aaba, rgba(140, 140, 255, 0.05) 0.3%, #0000 99.6%, #aaba);;
}

.synthese {
  display: block;
  height: 45px;
  font-size: 24px;
  border-bottom: 1px solid #ccc;
  background: linear-gradient(0deg, #eee, #fff);
}

.button {
  text-transform: none;
}

.status {
  line-height: 30px;
  font-size: 18px;
}
</style>