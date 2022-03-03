<template>
  <v-dialog v-model="boardDialog" persistent @input="closeBoardDialog()" max-width="600px">
    <v-card>
      <v-card-title>
        <div>
          <div class="headline">Créer une carte de suivi ?</div>
          <span class="grey--text">(siret {{ siret }})</span>
        </div>
      </v-card-title>
      <v-card-text>
        <v-radio-group
          v-model="currentBoard"
          mandatory
          row
        >
          <v-radio v-for="board in boards.filter(b => !b.card && b.slug)" :key="board.id"
            :label="board.title"
            :value="board.id"
          ></v-radio>
        </v-radio-group>
        Quelles problématiques avez vous identifiées à ce stade ?
        <Help titre="Problématiques identifiées" :big="true">
          <div v-html="followCardConfig.problemHelpContent" />
        </Help>
        <v-select
          ref="problems"
          v-model="problems"
          :disabled="currentBoard=='' || creatingCard"
          :items="followCardConfig.problemItems"
          :menu-props="{ maxHeight: 400 }"
          multiple
          chips
        >
          <template v-slot:append-item>
            <div class="text-center my-2">
              <v-btn @click="$refs.problems.isMenuActive = false" color="primary">OK</v-btn>
            </div>
          </template>
        </v-select>
        Quelles actions ont déjà été menées ou sont envisagées ?
        <Help titre="Actions menées ou envisagées" :big="true">
          <div v-html="followCardConfig.actionHelpContent" />
        </Help>
        <v-select
          ref="actions"
          v-model="actions"
          :items="followCardConfig.actionItems"
          :menu-props="{ maxHeight: 400 }"
          multiple
          chips
          :disabled="currentBoard=='' || creatingCard"
        >
          <template v-slot:append-item>
            <div class="text-center my-2">
              <v-btn @click="$refs.actions.isMenuActive = false" color="primary">OK</v-btn>
            </div>    
          </template>
        </v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeBoardDialog()" :disabled="creatingCard">Passer la création</v-btn>
        <v-btn dark color="indigo" @click="createNewFollowCard()" :disabled="currentBoard == '' || creatingCard"><v-icon left class="mr-2">mdi-star-outline</v-icon>Créer carte</v-btn>
      </v-card-actions>
      <v-alert :value="boardAlert" type="error" transition="scale-transition">{{ boardError }}</v-alert>
    </v-card>
  </v-dialog>
</template>

<script>
import followCardConfigBase from '@/assets/follow_card_config.json'
import Help from '@/components/Help.vue'

export default {
  components: {Help},
  name: 'BoardDialog',
  data() {
    return {
      problems: [],
      actions: [],
      boardAlert: false,
      boardAlertError: '',
      boardError: '',
      creatingCard: false,
    }
  },
  methods: {
    createNewFollowCard() {
      this.trackMatomoEvent('etablissement', 'creer_carte_suivi', this.siret)
      this.creatingCard = true
      const params = {
        description: this.formattedDescription,
        boardId:     this.currentBoard,
      }
      this.$axios.post(`/wekan/cards/${this.siret}`, params).then((response) => {
        this.problems = []
        this.actions = []
        this.boardDialog = false
        this.boardAlertError = ''
        this.boardAlert = false
        this.$parent.getBoards()
      }).catch((error) => {
        this.boardAlertError = 'Une erreur est survenue lors de la création de la carte de suivi'
        this.boardAlert = true
      }).finally(() => {
        this.creatingCard = false
      })
    },
    closeBoardDialog() {
      this.problems = []
      this.actions = []
      this.boardDialog = false
      this.boardAlertError = ''
      this.boardAlert = false
    },
  },
  computed: {
    formattedDescription() {
      let formattedDescription = '**Difficultés :**\n'
      this.problems.forEach((p, i) => {
        formattedDescription += '- ' + p + '\n'
      })
      formattedDescription += '\n'
      formattedDescription += '**Actions :**\n'
      this.actions.forEach((a, i) => {
        formattedDescription += '- ' + a + '\n'
      })
      return formattedDescription
    },
    followCardConfig() {
      const board = this.boards.filter((b) => b.id === this.currentBoard)[0]
      if (board) {
        const base = board.slug.split('-')
        return followCardConfigBase[base[0] + '-' + base[1]]
      }
      return {
        problemHelpContent: {},
      }
    },
    boardDialog: {
      get() {
        return this.$parent.boardDialog
      },
      set(val) {
        this.$parent.boardDialog = val
      },
    },
    currentBoard: {
      get() {
        return this.$parent.currentBoard
      },
      set(val) {
        this.$parent.currentBoard = val
      },
    },
    boards() {
        return this.$parent.boards || []
    },
    siret: {
      get() {
        return this.$parent.siret
      },
      set(val) {
        this.$parent.currentBoard = val
      },
    },
  },
}

</script>
