<template>
  <v-dialog v-model="dialog" width="800px">
    <template v-slot:activator="{ on }">
      <v-btn 
        :class="(newsToRead>0)?'pulse':'inerte'" 
        flat 
        round
        v-on="on">
        Nouveautés ({{ newsToRead }})
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Journal des changements</span>
        <v-spacer/>
        <v-btn color="primary" text @click="newsread">ok</v-btn>
      </v-card-title>
      <v-card-text>
        <ul>
          <li v-for="n in news" :key="n.date.getTime()">
            <b>{{ n.date.toLocaleDateString() }}:</b>
            <ul>
              <li v-for="l in n.news" :key="l">{{ l }}</li>
            </ul>
          </li>

        </ul>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "News",
  methods: {
    newsread() {
      this.dialog = false
      let today = new Date()
      this.newsRead = today
    },
  },
  computed: {
    newsToRead() {
      return this.news.reduce((m, n) => {
        if (n.date.getTime() > this.newsRead.getTime()) {
          m += 1
        }
        return m
      }, 0)
    },
    newsRead: {
      get() {return new Date(this.$localStore.state.newsRead)},
      set(val) {this.$localStore.commit('setNewsRead', val)},
    },
  },
  data() {
    return {
      dialog: false,
      news: [
          {date: new Date("2019-10-07"), news: [
              "Ajoût de l'information sur les nouveautés", 
              "L'application se souvient des paramètres de filtrage",
              "Refonte des contrôles de filtrage des listes de détection",
              "Gestion des envois manuels partagés/privés",
          ]},
          {date: new Date("2019-10-04"), news: [
              "L'écran des listes de détection n'est plus accessible aux agents habilités B",
              "Les données d'activité partielle ne sont plus disponibles en visualisation pour les entreprises absentes des listes de détection."
          ]},
      ],
    }
  },
}
</script>

<style scoped>
  .pulse {
    background-color: rgba(255, 255, 255, 0);
    -webkit-animation: blink 800ms infinite;
            animation: blink 800ms infinite;
    height: 24px;
  }
  .inerte {
    height: 24px;
  }
  .purse:hover {
    background-color: rgb(255, 0, 0);
  }
  @-webkit-keyframes blink { 10% { background-color: rgba(255, 0, 43, 0.158); }}
          @keyframes blink { 10% { background-color: rgba(255, 0, 43, 0.158); }}
</style>