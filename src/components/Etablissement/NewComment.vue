<template>
  <div>
    <div class="editor" style="margin: 5px">
      <editor-content class="editor__content" :editor="editor" style="padding: 5px" />
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="menubar">
          <v-toolbar
            class = "localtoolbar"
            dark
            color = "rgb(43, 40, 73)"
            height="30px"
          >
            <v-btn
              fab
              small
              flat
              class="menubar__button"
              :class="{ 'is-active': isActive.bold() }"
              @click="commands.bold"
            >
              <v-icon>mdi-format-bold</v-icon>
            </v-btn>

            <v-btn
              fab
              small
              flat
              class="menubar__button"
              :class="{ 'is-active': isActive.italic() }"
              @click="commands.italic"
            >
              <v-icon>mdi-format-italic</v-icon>
            </v-btn>

            <v-btn
              fab
              small
              flat
              class="menubar__button"
              :class="{ 'is-active': isActive.bullet_list() }"
              @click="commands.bullet_list"
            >
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-btn>


            <v-btn
              fab
              small
              flat
              class="menubar__button"
              @click="commands.undo"
            >
              <v-icon>mdi-undo</v-icon>
            </v-btn>

            <v-btn
              fab
              small
              flat
              class="menubar__button"
              @click="commands.redo"
            >
              <v-icon>mdi-redo</v-icon>
            </v-btn>
            <v-spacer/>
            <v-btn 
              fab
              flat 
              small
              class="menubar__button"
              @click="send">
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </v-toolbar>
        </div>
      </editor-menu-bar>
    </div>
    
  </div>
</template>

<script>
import uuidv1 from 'uuid/v1'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
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
  name: 'NewComment',
  props: [ 'follows', 'siret', 'load' ],
  components: { EditorContent, EditorMenuBar },
  data() {
    return {
      editor: new Editor({
        extensions: [
          new BulletList(),
          new HardBreak(),
          new ListItem(),
          new Link(),
          new Bold(),
          new Italic(),
          new History(),
        ],
        content: ``,
        onUpdate: ({ getJSON, getHTML }) => {
          this.text = getHTML()
        },
      }),
      text: '',
    }
  },
  computed : {
    jwt() {
      return this.$keycloak.tokenParsed || {resource_access: { signauxfaibles: {roles: []}}}
    },
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    send() {
      const params = [{
        key: {
          siret: this.siret,
          siren: this.siret.substring(0, 9),
          author: this.jwt.email,
          uuid: uuidv1(),
          follows: this.follows,
        },
        value: {
          date: new Date(),
          name: this.jwt.name,
          text: this.editor.getHTML(),
        },
      }]
      this.$axios.post('/data/put/comment', params).then((r) => {
        this.$parent.viewComment = false
        this.editor.clearContent()
        this.load()
      })
    },
  },
}
</script>

<style scoped>
.localtoolbar {
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
}
.editor {
  border-radius: 5px;
  font-weight: 400; 
  font-family: 'Roboto Mono', monospace;
  border: 1px solid rgb(43, 40, 73);
  width: 500px;
}
.menubar__button {
  margin: 0px;
}
</style>