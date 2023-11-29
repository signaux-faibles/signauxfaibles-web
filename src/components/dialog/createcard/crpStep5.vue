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
                v-for="label in createCardLabels"
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
        <v-btn color="indigo" outlined
               @click="createCardSequence=4">
          retour
        </v-btn>
        <v-btn color="indigo" dark
               @click="createCard">
          Terminer
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

const md = new MarkdownIt()

export default {
  name: 'DialogCreateCardCrpStep5',
  data() {
    return {
      createCardFailedError: null,
      customDescription: null,
    }
  },
  props: ['siret'],
  methods: {
    createCard() {
      this.$axios.post("/kanban/card", this.params)
        .then(() => {
          this.createCardFailedError = false
          this.$store.commit('setCreateCardLabels', [])
          this.$store.commit('setCreateCardProblems', [])
          this.$store.commit('setCreateCardActions', [])
          this.$store.commit('setCreateCardSequence', 1)
          this.createCardDialog = false
          this.createCardFailedError = null
          this.$bus.$emit("create-card")
        }).catch(e => {
        this.createCardFailedError = "Un problème est survenu lors de l'enregistrement."
      })
    }
  },
  computed: {
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
      this.createCardProblems.forEach((problem) => {
        lines.push("- " + problem + "  ")
      })
      lines.push("")
      lines.push("### Actions  ")
      this.createCardActions.forEach((action) => {
        lines.push("- " + action + "  ")
      })
      return lines.join("\n")
    },
    params() {
      return {
        swimlaneID: this.createCardSwimlaneID,
        description: this.description,
        labels: this.createCardLabels,
        siret: this.siret,
      }
    },
    currentBoard() {
      const currentSwimlaneID = this.createCardSwimlaneID
      for (const board of Object.values(this.kanbanConfig.boards)) {
        if (currentSwimlaneID in board.swimlanes) {
          return board
        }
      }
      return null
    },
    currentSwimlane() {
      return this.currentBoard.swimlanes[this.createCardSwimlaneID].title
    },
    kanbanConfig() {
      return this.$store.state.kanbanConfig
    },
    createCardSequence: {
      get() {
        return this.$store.state.createCardSequence
      },
      set(value) {
        this.$store.commit('setCreateCardSequence', value)
      },
    },
    createCardDialog: {
      get() {
        return this.$store.state.createCardDialog
      },
      set(value) {
        this.$store.commit('setCreateCardDialog', value)
      },
    },
    createCardProblems() {
      return this.$store.state.createCardProblems
    },
    createCardActions() {
      return this.$store.state.createCardActions
    },
    createCardSwimlaneID() {
      return this.$store.state.createCardSwimlaneID
    },
    createCardLabels() {
      return this.$store.state.createCardLabels
    }
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