<template>
  <div>
    <v-card>
      <v-card-title>
        Avant de terminer, faisons le point
      </v-card-title>
      <v-card-text>
        <table>
          <tr>
            <th>
              Tableau
            </th>
            <td>
              {{ currentBoard.title }}
            </td>
          </tr>
          <tr>
            <th>
              Territoire
            </th>
            <td>
              {{ currentSwimlane }}
            </td>
          </tr>
          <tr>
            <th>
              Catégories
            </th>
            <td>
              <v-chip
                v-for="label in dialogs.createCardLabels"
                :key="label"
                :color="newCardLabelItems[label].background"
                :text-color="newCardLabelItems[label].front"
                class="ma-1"
              >
                {{ label }}
              </v-chip>

            </td>
          </tr>
          <tr>
            <th>
              Description
            </th>
            <td class="description" v-html="markdownDescription">
            </td>
          </tr>
        </table>


      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn style="text-transform: none" color="indigo" text
               @click="previousStep">
          Retour
        </v-btn>
        <v-btn style="text-transform: none" color="indigo"
          dark
          :loading="creating"
          @click="createCard">
          Enregistrer
        </v-btn>
      </v-card-actions>
      <v-card-actions v-if="createCardFailedError">
        <v-alert type="error" width="100%">{{ createCardFailedError }}</v-alert>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import labelColors from "@/assets/labels.json";
import {useKanbanStore} from "@/stores/kanban";
import {useDialogsStore} from "@/stores/dialogs";

const md = new MarkdownIt()

export default {
  name: 'DialogCreateCardCrpStep5',
  props: ['siret'],
  setup() {
    const kanban = useKanbanStore()
    const dialogs = useDialogsStore()
    return {kanban,dialogs}
  },
  data() {
    return {
      createCardFailedError: null,
      customDescription: null,
      creating: false,
    }
  },
  methods: {
    previousStep() {
      this.dialogs.createCardSequence='crpStep4'
    },
    createCard() {
      this.creating = true
      this.$axios.post("/kanban/card", this.params)
        .then(() => {
          this.createCardFailedError = false
          this.dialogs.resetCreateCardDialog()
          this.dialogs.createCardDialog = false
          this.$bus.$emit("create-card")
        }).catch(e => {
          this.createCardFailedError = "Un problème est survenu lors de l'enregistrement."
        }).finally(() => {
          this.creating = false
        })
    },
    options() {
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
  },
  computed: {
    currentBoard() {
      const currentBoardID = this.kanban.boardIDFromSwimlaneID(this.dialogs.createCardSwimlaneID)
      return this.kanban.config.boards[currentBoardID]
    },
    newCardLabelItems() {
      return Object.values(this.currentBoard.labels).reduce((m, label) => {
        if (label.name !== '') {
          m[label.name] = labelColors[label.color]
        }
        return m
      }, {})
    },
    markdownDescription() {
      return md.render(this.description)
    },
    description() {
      let lines = []
      lines.push("### Difficultés  ")
      this.dialogs.createCardProblems.forEach((problem) => {
        lines.push("- " + problem + "  ")
      })
      lines.push("")
      lines.push("### Actions  ")
      this.dialogs.createCardActions.forEach((action) => {
        lines.push("- " + action + "  ")
      })
      return lines.join("\n")
    },
    params() {
      return {
        swimlaneID: this.dialogs.createCardSwimlaneID,
        description: this.description,
        labels: this.dialogs.createCardLabels,
        siret: this.siret,
      }
    },
    currentSwimlane() {
      return this.currentBoard.swimlanes[this.dialogs.createCardSwimlaneID].title
    },
    kanbanConfig() {
      return this.$store.state.kanbanConfig
    },
  },
}
</script>

<style scoped>
table {
  border-collapse: collapse;
}

th, td {
  padding-top: 20px;
  padding-right: 50px;
  font-size: 20px;
}

th {
  vertical-align: top;
  text-align: left;
  border-collapse: collapse;
}

td.description {
  font-size: 15px
}
</style>