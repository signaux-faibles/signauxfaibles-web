<template>
  <div>
    <v-card class="mt-3 mb-3" style="height: 300px;">
      <v-card-title class="mb-1 pt-1 pl-3 pr-2" style="height: 42px; border-bottom:1px solid black;">
        {{ etablissement.raison_sociale }}
        <v-spacer></v-spacer>
        <v-btn class="ml-5" color="indigo" compact outlined small>établissement</v-btn>
        <v-btn class="ml-5" color="indigo" compact outlined small>entreprise</v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout wrap>
          <v-flex class="pa-2" md3 xl3 xs6>
            <h4>Accompagné par Élodie Quezel</h4>
            <h4>Autres participants
            </h4>
            <ul style="font-family: Oswald">
              <li>
                Raphaël Squelbut
              </li>
              <li>Anna Ouhayoun</li>
            </ul>
          </v-flex>
          <v-flex class="pl-2" md5 xl3 xs6>
            <h4>Résumé</h4>
            <div class="scrollflex">
              <v-card class="pl-2" outlined>
                <Viewer
                  ref="viewer"
                  initialEditType="wysiwyg"
                  initialValue="#### une synthèse
et son titre
avec beaucoup
beaucoup
beaucoup
beaucoup
beaucoup
beaucoup
beaucoup
beaucoup
beaucoup
beaucoup
beaucoup
beaucoup
trop de lignes
"
                />
              </v-card>
            </div>
          </v-flex>
          <v-flex class="pl-2" md4 xl3 xs6>
            <h4>Commentaires</h4>
            <div class="scrollflex">
              <FollowComment v-for="(j, i) in comments" :key="i" :author="j.author" :comment="j.comment"
                             :date="j.date"/>
            </div>
          </v-flex>

        </v-layout>
      </v-card-text>
      <!--      <v-card-text>-->
      <!--        {{ etablissement }}-->
      <!--      </v-card-text>-->
    </v-card>
  </div>
</template>

<script>
import {Viewer} from "@toast-ui/vue-editor";
import FollowComment from "@/components/follow/comment/main.vue";

export default {
  name: 'FollowWidget',
  components: {FollowComment, Viewer},
  props: ['etablissement'],
  data() {
    return {
      comments: [
        {
          author: "Raphael Squelbut",
          date: new Date(),
          comment: "##### voilà un commentaire"
        },
        {
          author: "Anna Ouhayoun",
          date: new Date(),
          comment: '' +
            '| Aligné à gauche  | Centré          | Aligné à droite |\n' +
            '| :--------------- |:---------------:| -----:|\n' +
            '| Aligné à gauche  |   ce texte        |  Aligné à droite |\n' +
            '| Aligné à gauche  | est             |   Aligné à droite |\n' +
            '| Aligné à gauche  | centré          |    Aligné à droite |'

        },
        {
          author: "Raphael Squelbut",
          date: new Date(),
          comment: "> On peut aussi faire des citations"
        },
        {
          author: "Raphael Squelbut",
          date: new Date(),
          comment: "**Le markdown c'est pratique**"
        },
      ]
    }
  }
}
</script>

<style scoped>
.scrollflex {
  height: 200px;
  overflow-y: scroll;
}
</style>