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
            class="" md2 xs6
          >
              <h3>{{ kanban.board(card.boardID) }}</h3>
              <h3>Statut: {{ kanban.list(card.boardID, card.listID) }}</h3>
              depuis le {{ (new Date(card.startAt)).toLocaleDateString() }} <br/>
              mis à jour le {{ (new Date(card.startAt)).toLocaleDateString() }}
          </v-flex>
          <v-flex class="pl-2" md3 xl3 xs3>
            Initié par {{ kanban.fullnameFromID(card.creatorID) }}
            <div v-if="card.assigneesID">
              Pris en charge par
              <span v-if="(card.assigneesID || []).length == 1">
                {{ kanban.fullnameFromID(card.assigneesID[0]) }}
                <br/>
              </span>
              <span v-else>
                <ul>
                  <li v-for="assigneeID in card.assigneesID" :key="assignee">
                    {{ kanban.fullnameFromID(assigneeID) }}
                  </li>
                </ul>
              </span>
            </div>
            Participants:
            <ul>
              <li v-for="memberID in card.memberIDs">
                {{ kanban.fullnameFromID(memberID) }}
              </li>
            </ul>
            <p/>
            Catégories:
            <FollowLabel
              v-for="(label, j) in kanban.labels(card.boardID, card.labelIDs)"
              :key="j"
              :label="label"
              small
            />
          </v-flex>
          <v-flex xs6 md6>
            {{ card }}
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
import {useKanbanStore} from "@/stores/kanban";

export default {
  name: 'FollowWidget',
  components: {FollowLabel, FollowComment, Viewer},
  props: ['etablissement'],
  setup() {
    const kanban = useKanbanStore()
    return {kanban}
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>
.scrollflex {
  height: 200px;
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
</style>