<template>
  <div>
    <v-card class="mt-3 mb-3" style="height: 310px;">
      <v-card-title class="mb-1 pt-1 pl-3 pr-2" style="height: 42px; border-bottom:1px solid black;">
        {{ etablissement.raison_sociale }}
        <v-spacer/>
        <v-btn class="ml-5" color="indigo" compact outlined small>établissement</v-btn>
        <v-btn class="ml-5" color="indigo" compact outlined small>entreprise</v-btn>
      </v-card-title>
      <v-card-text>
        <v-layout wrap>
          <v-flex
              class="pl-2" md3 xl3 xs6
          >
            <h4 style="text-align: center">Détails</h4>
            <span style="font-family: Oswald; font-weight: 100;">
            Statut: En cours <br/>
            Accompagné depuis le 01/01/2021 <br/>
            Dernière mise à jour: 12/09/2023<br/>
            Pris en charge par Élodie Quezel <br/>
            Avec l'assistance de:
            <ul>
              <li>
                Raphaël Squelbut
              </li>
              <li>Anna Ouhayoun</li>
            </ul>
              <v-btn class="mt-1" small outlined color="indigo">rejoindre</v-btn>
            <p/>
            Catégories:
            <follow-label
                v-for="(label, j) in labels"
                :key="j"
                :label="label"
                small
            />
              <v-btn
                  class="smallbtn"
                  outlined
                  fab
                  color="green darken-2"
              >
                <v-icon size="10px" dark>
                  fa-plus
                </v-icon>
              </v-btn>
            </span>
          </v-flex>
          <v-flex class="pl-2" md5 xl5 xs6>
            <h4 style="text-align: center">Résumé</h4>
            <div class="scrollflex">
              <v-card class="pl-2" outlined>
                <Viewer
                    ref="viewer"
                    initialEditType="wysiwyg"
                    :initialValue="initialValue"
                />
              </v-card>
              <v-card-action>
              </v-card-action>
            </div>
            <div style="width: 100%; text-align: center;">
              <v-btn small outlined @compact color="indigo">modifier</v-btn>
            </div>
          </v-flex>
          <v-flex class="pl-2" md4 xl4 xs6>
            <h4 style="text-align: center">Commentaires</h4>
            <div class="scrollflex">
              <FollowComment v-for="(j, i) in comments" :key="i" :author="j.author" :comment="j.comment"
                             :date="j.date"/>
            </div>
          </v-flex>à

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
import FollowLabel from "@/components/follow/label/main.vue";

export default {
  name: 'FollowWidget',
  components: {FollowLabel, FollowComment, Viewer},
  props: ['etablissement'],
  data() {
    return {
      labels: [{name: 'label a', color: 'blue'}, {name: 'label o', color: 'indigo'}],
      initialValue: "##### une synthèse\n" +
          "et son titre\n" +
          "avec beaucoup\n" +
          "beaucoup\n" +
          "beaucoup\n" +
          "beaucoup\n" +
          "beaucoup\n" +
          "beaucoup\n" +
          "beaucoup\n" +
          "beaucoup\n" +
          "beaucoup\n" +
          "beaucoup\n" +
          "beaucoup\n" +
          "beaucoup\n" +
          "trop de lignes",
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

.smallbtn {
  width: 22px;
  min-width: 22px;
  height: 22px;
  min-width: 22px;
}
</style>