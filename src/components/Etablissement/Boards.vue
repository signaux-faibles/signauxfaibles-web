<template>
  <div>
    <h2>
      Suivi de l'établissement
      <Help titre="Suivi d'établissement">
        <template>
          Ces informations sont extraites de l'outil de suivi Kanban rattaché à Signaux-Faibles au travers d'une synchronisation permanente.
          Elles tiennent compte de vos habilitations dans l'outil et ne sont visibles que les informations auxquelles vous avez vous-même accès.
        </template>
      </Help>
    </h2>
    <v-simple-table>
      <tbody>
        <tr v-for="card in cards" :key="card.id">
          <td>
            <h3>{{ card.board.title }}</h3>
          </td>
          <td>
            <v-chip v-if="card.listIndex" small class="chip ml-3">{{ card.archived?"Archivée":card.listIndex }}</v-chip>
          </td>
          <td>
            <v-menu v-if="card.board.isMember" min-width="300px" max-width="40%" max-height="60%" offset-y>
              <template v-slot:activator="{ on, attrs }">              
                <v-btn v-bind="attrs" icon v-on="on" text color="indigo"
                  ref="btn" slot="activator" @click="trackMatomoEvent('general', 'aperçu_carte', card.title)">
                  <v-icon v-if="!card.archived">mdi-eye</v-icon>
                  <v-icon v-if="card.archived">mdi-archive</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline">
                  Aperçu de la carte de suivi
                </v-card-title>
                <v-card-text>
                  <div class="pb-10">
                    <b>suivi depuis:</b> {{ card.startAtDate.toLocaleDateString("fr") }}<br/>
                    <span v-if="card.endAt"><b>suivi terminé:</b> {{ card.endAtDate.toLocaleDateString("fr")  }}<br/></span>
                    <b>dernière activité:</b> {{ card.lastActivityDate.toLocaleDateString("fr")  }}<br/>
                  </div>    
                  <div v-html="card.cardDescriptionMD"/>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn text color="primary">OK</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-on="on" v-bind="attrs" v-if="card.archived && !card.board.isMember">mdi-archive</v-icon>
              </template>
              <b>suivi depuis:</b> {{ card.startAtDate.toLocaleDateString("fr") }}<br/>
              <span v-if="card.endAt"><b>suivi terminé:</b> {{ card.endAtDate.toLocaleDateString("fr")  }}<br/></span>
              <b>dernière activité:</b> {{ card.lastActivityDate.toLocaleDateString("fr")  }}<br/>
            </v-tooltip>

          </td>
          <td>
            <v-btn 
              dark color="indigo"
              text
              icon
              v-if="!card.board.isMember" 
              :href="'mailto:' + card.creator + '?subject=Suivi Signaux Faibles - demande d\'informations sur ' + denomination" 
              @click="trackMatomoEvent('follow', 'contacter_createur', card.creator)" 
              target="_blank">
              <v-icon>
                email
              </v-icon>
            </v-btn>
          </td>
          <td>
            <v-btn v-if="card.cardURL && !card.archived" :href="card.cardURL" @click="trackMatomoEvent('general', 'visite_carte', card.title)" dark color="indigo" class="px-2 ma-1">
              <v-icon small class="mr-2">mdi-trello</v-icon>
              Carte de suivi
            </v-btn>
            <v-btn v-if="card.cardURL && card.archived" outlined dark color="indigo" class="px-3 ma-1" @click="trackMatomoEvent('general', 'unarchive_carte', card.title); unarchiveCard(card.cardId)">
              <v-icon small class="mr-2">unarchive</v-icon>
              Désarchiver
            </v-btn>
          </td>
        </tr>
        <tr v-if="boards.filter(c => !c.card && c.isMember).length > 0" :style="{'align-items':'left'}">
          <td colspan="4">
            <span v-if="cards.length==0">
              Cet établissement ne fait l'objet d'aucune carte de suivi.
            </span><br/>
            <v-btn v-if="followed" outlined color="indigo" class="pa-2" @click="showBoardDialog()">
              <v-icon>edit</v-icon>
              créer une carte de suivi<br/>
            </v-btn>
            <span v-if="!followed">
              Pour créer une carte de suivi, veuillez suivre cet établissement.
            </span> 
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<style scoped lang="scss">
  tbody {
     tr:hover {
        background-color: transparent !important;
     }
  }
</style>

<script>
import Help from '@/components/Help.vue'
import MarkdownIt from 'markdown-it'

export default {
  name: 'Boards',
  props: ['boards'],
  components: { Help },
  methods: {
    showBoardDialog() {
      this.boardDialog = true
    },
    unarchiveCard(cardId) {
      this.$axios(`/wekan/unarchive/${cardId}`).then(() => {
        this.$parent.getBoards()
      })
    }
  },
  computed: {
    followed() {return this.$parent.followed},
    denomination() {return this.$parent.denomination},
    cards() {
      const md = new MarkdownIt()
      return this.boards
      .filter((b) => b.cards) 
      .flatMap((b) => b.cards.map((c) => {
        if (c.cardDescription) {
          c.cardDescriptionMD = md.render(c.cardDescription)
        }
        c.board = {
          id: b.id,
          title: b.title,
          isMember: b.isMember,
          slug: b.slug,
          url: b.url,
        }
        c.startAtDate = new Date(c.startAt)
        c.endAtDate = new Date(c.endAt)
        c.lastActivityDate = new Date(c.lastActivity)
        return c
      })) 
    },
    boardDialog: {
      get() {
        return this.$parent.boardDialog
      },
      set(val) {
        this.$parent.boardDialog = val
      },
    },
  },
}
</script>
