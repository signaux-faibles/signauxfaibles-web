<template>
  <div>
    <v-card class="mt-3 mb-3 elevation-3">
      <v-card-title
        class="pt-0 pl-4 pr-3 header"
        style="height: 47px;"
      >
        <div style="width: 100%; height: 40px; display: flex">
          <div class="ma-0 pa-0"
               style="font-family: Abel; font-size: 24px; font-weight: 800;overflow:hidden;height:50px;line-height:50px;">
            {{ etablissement.raison_sociale }}
          </div>
          <v-spacer/>
          <div class="mt-2 mr-0 pr-0" style="min-width: 299px">
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
              class="ml-3 mr-0 button"
              color="white"
              compact
              outlined
              small
              @click="dialogs.showEntreprise(etablissement.siret.slice(0,9))"
            >
              Fiche entreprise
            </v-btn>
          </div>
        </div>
      </v-card-title>
      <v-card-text
        v-for="card in etablissement.cards" :key="card.id"
        class="pt-3 body"
        style="font-family: Oswald; border-top: 2px solid darkgrey;"
      >
        <FollowWidgetCard :etablissement="etablissement" :inputCard="card"/>
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
import FollowWidgetHeaders from "@/components/follow/widget/headers.vue";
import FollowWidgetSynthese from "@/components/follow/widget/synthese.vue";
import FollowWidgetCard from "@/components/follow/widget/card.vue"

export default {
  name: 'FollowWidget',
  components: {
    FollowWidgetSynthese,
    FollowWidgetHeaders,
    FollowLabel,
    FollowComment,
    Viewer,
    FollowWidgetMembers,
    FollowWidgetCard
  },
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