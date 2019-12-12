<template>
  <div>
    <div style="padding: 8px">
      
      <a :href="'mailto:' + thread.key.author.trim()">
        <v-avatar color="indigo" size="24">
          <span class="white--text">{{ avatar }}</span>
        </v-avatar>
      </a>       

      
      <div class="editor">
        <editor-content class="editor__content" :editor="editor" />
      </div>

      <editor-content class="editor__content" :editor="editor" />
      <div
      v-if="thread.thread.length > 0">
        {{ thread.thread.length }} réponse{{ thread.thread.length > 1 ? 's' : ''}} à ce message
        <v-btn 
          fab
          flat
          small
          @click="viewChild=!viewChild"
          >
          <v-icon>mdi-{{ viewChild ? 'minus' : 'plus' }}</v-icon>
        </v-btn>
      </div>
      <a @click="viewComment=!viewComment">répondre</a>
      <div v-if="viewChild">
        <div v-for="t in thread.thread" :key="JSON.stringify(t.key)" style="text-align: left; border-bottom: 1px dotted #bbb; border-left: 1px solid #bbb; padding: 0px">
          <Thread :thread="t" :follows="thread.key.uuid" :load="load"/>
        </div>
      </div>
      <NewComment :follows="thread.key.uuid" :siret="thread.key.siret" :load="load" :class="commentClass"/>

    </div>
  </div>
</template>

<script>
  import Thread from '@/components/Etablissement/Thread.vue'
  import NewComment from '@/components/Etablissement/NewComment.vue'

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