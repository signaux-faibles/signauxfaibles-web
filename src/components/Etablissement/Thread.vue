<template>
  <div>
    <div style="padding: 18px">
      <div style="border-bottom: 1px dashed #eee">
      <a :href="'mailto:' + thread.key.author.trim()">
        <img :src="`data:image/png;base64,${iconData}`"/>
      </a> <span style="font-weight: 100; font-family: 'Roboto Mono'"> {{ thread.value.name }}, le {{ displayDate(thread.value.date) }}</span>
      </div>
      <div class="editor">
        <editor-content class="editor__content" :editor="editor" />
      </div>

      <div
      v-if="thread.thread.length > 0">
        {{ thread.thread.length }} réponse{{ thread.thread.length > 1 ? 's distinctes' : ''}}
        <v-btn 
          fab
          flat
          small
          @click="viewChild=!viewChild; viewComment=false;"
          >
          <v-icon>mdi-{{ viewChild ? 'minus' : 'plus' }}</v-icon>
        </v-btn> <a @click="viewComment=!viewComment" v-if="viewChild && !viewComment">Apporter une réponse différente</a>
      </div>
      
      <a @click="viewComment=!viewComment" v-if="thread.thread.length == 0">Répondre</a>
      <div v-if="viewComment" style="background-color: rgba(150, 150, 200, .2);text-align: left; border-bottom: 1px dotted #bbb; border-left: 1px solid #bbb; padding: 18px">
        <h2 style="left-margin: 10px">Écrivez ici votre réponse</h2>
        <NewComment :follows="thread.key.uuid" :siret="thread.key.siret" :load="load"/>
      </div>
      <div v-if="viewChild">
        <div v-for="t in thread.thread" :key="JSON.stringify(t.key)" style="background-color: rgba(150, 150, 200, .2);text-align: left; border-bottom: 1px dotted #bbb; border-left: 1px solid #bbb; padding: 0px; margin-top: 20px">
          <Thread :thread="t" :follows="thread.key.uuid" :load="load"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Thread from '@/components/Etablissement/Thread.vue'
  import NewComment from '@/components/Etablissement/NewComment.vue'
  import Identicon from 'identicon.js'
  import md5 from 'js-md5'

  import { Editor, EditorContent } from 'tiptap'
  import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Code,
    Italic,
    Link,
    History,
  } from 'tiptap-extensions'

  export default {
    name: 'Thread',
    props: [ 'thread', 'follows', 'load' ],
    components: { NewComment, Thread, EditorContent },
    data() {
      return {
        iconData: '',
        viewChild: false,
        viewComment: false,
        editor: new Editor({
          editable: false,
          extensions: [
            new BulletList(),
            new HardBreak(),
            new ListItem(),
            new Link(),
            new Bold(),
            new Italic(),
            new History(),
          ],
          content: this.thread.value.text,
        }),
      editable: false,
      }
    },
    mounted() {
      const h = md5(this.thread.value.name)
      const data = new Identicon(h, 20).toString()
      this.iconData = data
    },
    computed: {
      commentClass() {
        return this.viewComment ? 'visibleComment' : 'hiddenComment'
      },
      avatar() {
        const name = this.thread.value.name.trim()
        return name.split(' ').reduce((m, c) => {
          m += c[0]
          return m
        }, '')
      },
    },
    methods: {
      displayDate(date) {
        const d = new Date(date)
        return d.getDate().toString(10).padStart(2, '0') + '/' +
               d.getMonth().toString(10).padStart(2, '0') + '/' +
               d.getFullYear().toString(10).padStart(4, '0') + ' à ' +
               d.getHours().toString(10).padStart(2, '0') + ':' +
               d.getMinutes().toString(10).padStart(2, '0') + ':' +
               d.getSeconds().toString(10).padStart(2, '0')
      },
    },
  }
</script>

<style scoped>
  .visibleComment {
    visibility:visible;
    position:relative;
  }
  .hiddenComment {
    visibility:hidden;
    position:absolute;
  }
  .editor {
    border-radius: 5px;
    font-weight: 400; 
    font-family: 'Roboto Mono', monospace;
    width: 500px;
  }
</style>