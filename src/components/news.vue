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
            <v-icon style="margin-right: 25px" color="grey lighten-1" size="35px">fa-rss</v-icon>
            <img height="30" style="position: relative; top: 9px" src="../assets/text_signaux_faibles.svg" />
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="red darken-4" :disabled="!postponable" dark text @click="close">Je lirai plus tard</v-btn>
          &nbsp;
          <v-btn color="primary darken-2" text @click="newsread">OK, J'AI LU</v-btn>
        </v-toolbar>

      </v-card-title>
      <v-card-text>
        <v-expansion-panels
            v-model="activePanel"
            inset
        >
          <News017 :activePanel="activePanel"/>
          <News016 :activePanel="activePanel"/>
          <News015 :activePanel="activePanel"/>
          <News014 :activePanel="activePanel"/>
          <News013 :activePanel="activePanel"/>
          <News012 :activePanel="activePanel"/>
          <News011 :activePanel="activePanel"/>
          <News010 :activePanel="activePanel"/>
          <News009 :activePanel="activePanel"/>
          <News008 :activePanel="activePanel"/>
          <News007 :activePanel="activePanel"/>
          <News006 :activePanel="activePanel"/>
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
import News001 from '@/components/news/news001.vue'
import News002 from '@/components/news/news002.vue'
import News003 from '@/components/news/news003.vue'
import News004 from '@/components/news/news004.vue'
import News005 from '@/components/news/news005.vue'
import News006 from '@/components/news/news006.vue'
import News007 from '@/components/news/news007.vue'
import News008 from '@/components/news/news008.vue'
import News009 from '@/components/news/news009.vue'
import News010 from '@/components/news/news010.vue'
import News011 from '@/components/news/news011.vue'
import News012 from '@/components/news/news012.vue'
import News013 from '@/components/news/news013.vue'
import News014 from '@/components/news/news014.vue'
import News015 from '@/components/news/news015.vue'
import News016 from '@/components/news/news016.vue' 
import News017 from '@/components/news/news017.vue'

export default {
  name: 'News',
  components: {News001, News002, News003, News004, News005, News006, News007, News008, News009, News010, News011, News012, News013, News014, News015, News016, News017},
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
        new Date('2025-30-09'),
        new Date('2025-26-06'),
        new Date('2025-28-03'),
        new Date('2025-31-01'),
        new Date('2024-12-06'),
        new Date('2024-10-22'),
        new Date('2024-09-19'),
        new Date('2024-07-02'),
        new Date('2024-06-03'),
        new Date('2023-11-30'),
        new Date('2023-09-03'),
        new Date('2023-06-01'),
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