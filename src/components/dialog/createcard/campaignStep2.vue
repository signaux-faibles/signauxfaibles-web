<template>
  <v-card>
    <v-card-text class="pt-4">
      <span style="font-size: 17px">
        Vous êtes sur le point d'accompagner l'entreprise.
        Écrivez en quelques lignes :
        <ul class="pb-4">
          <li>les difficultés de l'entreprise</li>
          <li>les actions que vous comptez entreprendre</li>
        </ul>

      <Editor class="mb-4"
              ref="editor"
              :options="editorOptions()"
              initialEditType="wysiwyg"
              :initialValue="dialogs.createCardDescription"
      />Cet accompagnement sera créé dans l'état `Analyse en cours`.
    </span>
    </v-card-text>
    <v-card-actions class="pb-3">
      <v-spacer></v-spacer>
      <v-btn color="indigo" style="text-transform: none" text
             @click="previousStep">
        Retour
      </v-btn>
      <v-btn color="indigo" style="text-transform: none" dark
             @click="createCard">
        Enregistrer
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {useDialogsStore} from "@/stores/dialogs";
import {Editor} from '@toast-ui/vue-editor';
import {useKanbanStore} from "@/stores/kanban";

export default {
  name: 'DialogCreateCardCampaignStep2',
  props: ['siret'],
  setup() {
    const kanban = useKanbanStore()
    const dialogs = useDialogsStore()
    return {kanban,dialogs}
  },
  components: {Editor},
  methods: {
    description() {
      const description = this.$refs.editor.invoke('getMarkdown')
      return description
    },
    createCard() {
      this.$axios.post("/kanban/card", this.params())
        .then(() => {
          this.createCardFailedError = false
          this.dialogs.resetCreateCardDialog()
          this.dialogs.createCardDialog = false
          this.$bus.$emit("create-card")
        }).catch(e => {
        this.createCardFailedError = "Un problème est survenu lors de l'enregistrement."
      })
    },
    params() {
      const boardID = this.kanban.boardIDFromSwimlaneID(this.dialogs.createCardSwimlaneID)
      console.log(Object.entries(this.kanban.config.boards[boardID].lists))
      const list = Object.entries(this.kanban.config.boards[boardID].lists).find(([k,v]) => {
        return v.title === 'Accompagnement en cours'
      })
      console.log(list)
      return {
        swimlaneID: this.dialogs.createCardSwimlaneID,
        listID: list[0],
        description: this.description(),
        siret: this.siret,
      }
    },
    editorOptions() {
      return {
        minHeight: '400px',
        language: 'fr',
        initialValue: this.dialogs.campaignCardEditorDescription,
        useCommandShortcut: true,
        usageStatistics: false,
        hideModeSwitch: true,
        toolbarItems: [
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task'],
          ['link', 'table'],
        ]
      }
    },
    previousStep() {
      this.dialogs.createCardDescription = this.description()
      this.dialogs.createCardSequence = 'start'
    }
  }
}
</script>