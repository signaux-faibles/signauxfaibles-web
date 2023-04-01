<template>
  <v-dialog scrollable v-model="dialog" height="500px" width="880px">
    <template v-slot:activator="{ on }">
      <v-btn
        :class="(changelogToRead+newsToRead>0)?'pulse':'inerte'"
        text
        rounded
        plain
        v-on="on" 
        @click="trackMatomoEvent('general', 'ouvrir_nouveautes')"
      >Nouveautés ({{ newsToRead + changelogToRead }})</v-btn>
    </template>
    <v-card min-height='90vh'>
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title class="headline">
            <v-icon style="margin-right: 25px" color="grey lighten-1" size="35px">feed</v-icon>
            <img height="30" style="position: relative; top: 9px" src="../assets/text_signaux_faibles.svg" />
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="red darken-4" :disabled="!postponable" dark text @click="close">Je lirai plus tard</v-btn>
          &nbsp;
          <v-btn color="primary darken-2" text @click="newsread">OK, J'AI LU</v-btn>
        </v-toolbar>

      </v-card-title>
      <v-card-text>
        <p/>
        <v-expansion-panels
            v-model="activePanel"
            inset
        >
          <News005 :activePanel="activePanel"/>
          <News004 :activePanel="activePanel"/>
          <News003 :activePanel="activePanel"/>
          <News002 :activePanel="activePanel"/>
          <News001 :activePanel="activePanel"/>
        </v-expansion-panels>
      </v-card-text>
    </v-card>

  </v-dialog>
</template>

<script>
import News001 from '@/views/news/News001.vue'
import News002 from '@/views/news/News002.vue'
import News003 from '@/views/news/News003.vue'
import News004 from '@/views/news/News004.vue'
import News005 from '@/views/news/News005.vue'


export default {
  name: 'News',
  components: {News001, News002, News003, News004, News005},
  mounted() {
    if (this.newsToRead > 0 && this.dialog == null) {
      this.dialog = true;
    }
  },
  methods: {
    newsread() {
      this.dialog = false
      const today = new Date()
      this.newsRead = today
    },
    close() {
      this.dialog = false
    }
  },
  computed: {
    newsToRead() {
      return this.news.reduce((m, n) => {
        if (n.getTime() > this.newsRead.getTime()) {
          m += 1
        }
        return m
      }, 0)
    },
    changelogToRead() {
      return this.changelog.reduce((m, n) => {
        if (n.date.getTime() > this.newsRead.getTime()) {
          m += 1
        }
        return m
      }, 0)
    },
    newsRead: {
      get() { return new Date(this.$localStore.state.newsRead) },
      set(val) { this.$localStore.commit('setNewsRead', val) },
    },
    dialog: {
      get() { return this.$store.state.newsDialog },
      set(val) { this.$store.commit('setNewsDialog', val) }
    },
    postponable() {
      return this.changelogToRead + this.newsToRead > 0
    }
  },
  data() {
    return {
      activePanel: 0,
      news: [
        new Date('2023-03-23'),
        new Date('2023-03-01'),
        new Date('2022-12-02'),
        new Date('2022-09-01'),
        new Date('2022-05-01'),
      ],
      changelog: [],
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
@-webkit-keyframes blink {
  10% {
    background-color: rgba(255, 0, 43, 0.349);
  }
}
@keyframes blink {
  10% {
    background-color: rgba(255, 0, 43, 0.349);
  }
}
</style>