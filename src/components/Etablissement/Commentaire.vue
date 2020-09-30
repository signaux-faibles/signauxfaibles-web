<template>
  <div style="text-align: left">
    <div style>
      <h2>
        <span v-if="thread.length > 0">
          commentaires ({{ count(thread) }})
          <a
            fab
            flat
            small
            @click="toggleComments()"
          >
            <v-icon color="black">mdi-{{ viewChild ? 'minus' : 'plus' }}</v-icon>
          </a>
        </span>
        <span v-if="thread.length == 0">
          il n'y a encore aucun commentaire,
          <a @click="viewChild=true; viewComment=true">créer le premier ?</a>
        </span>
        <hr style="color: #eee;" />
      </h2>
    </div>

    <div v-if="viewChild">
      <div
        v-for="t in thread"
        :key="JSON.stringify(t.id)"
        style="text-align: left;border-bottom: 1px dotted #bbb; padding: 0px"
      >
        <Thread :thread="t" :load="load" :siret="siret" />
      </div>

      <a v-if="!viewComment" @click="viewComment=!viewComment;">Créer un nouveau fil de commentaire</a>
      <NewComment
        v-if="viewComment"
        style="text-align: left; margin-top: 5px;"
        :siret="siret"
        :load="load"
      />
    </div>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
import Thread from '@/components/Etablissement/Thread.vue'
import NewComment from '@/components/Etablissement/NewComment.vue'

export default {
  components: { Help, Thread, NewComment },
  props: ['siret'],
  data() {
    return {
      text: '',
      thread: [],
      viewComment: false,
      viewChild: false,
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      const loading = true
      this.$axios.get(`/etablissement/comments/${this.siret}`).then((response) => {
        if (response.status === 200) {
          const comments = response.data.comments.sort(
            (c1, c2) =>
              new Date(c1.dateHistory[c1.dateHistory.length - 1]) -
              new Date(c2.dateHistory[c2.dateHistory.length - 1]),
          )
          this.thread = comments
          this.loading = false
        }
      })
    },
    count(thread) {
      let count = thread.length
      thread.map((c, i) => {
        if (c.comments) {
          count += this.count(c.comments)
        }
      })
      return count
    },
    toggleComments() {
      if (!this.viewChild) {
        this.trackMatomoEvent('etablissement', 'voir_commentaires', this.siret)
      }
      this.viewChild = !this.viewChild
      this.viewComment = false
    },
  },
}
</script>

