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
    <v-list three-line subheader >
      <v-list-tile
        v-for="board in (boards || []).filter(b => b.card)"
        :key="board.title"
      >
        <v-list-tile-content>
          <h4>{{ board.title }}
            <v-chip v-if="board.card.listIndex" small class="chip ml-3">{{ board.card.listIndex }}</v-chip>
            <v-menu v-if="board.card.cardDescription" min-width="300px" max-width="40%" max-height="60%" offset-y>                 
              <v-btn icon flat color="indigo" ref="btn" slot="activator" @click="trackMatomoEvent('general', 'ouvrir_aide', board.title)">
                <v-icon>fa-eye</v-icon></v-btn>
              <v-card>
                <v-card-title class="headline">
                  Aperçu de la carte de suivi
                </v-card-title>
                <v-card-text>     
                  <div v-html="board.card.cardDescription"/>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn flat color="primary">OK</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </h4>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn v-if="board.card && board.card.cardURL" :href="board.card.cardURL"  dark color="indigo" class="px-2 ma-1">
            <v-icon small class="mr-2">fab fa-trello</v-icon>
            Carte de suivi
          </v-btn>
          <v-btn 
            class="px-2 ma-1"
            dark color="indigo"
            outline
            v-if="board.card.creator != jwt.email && !board.card.isMember" 
            :href="'mailto:' + board.card.creator + '?subject=Suivi Signaux Faibles - demande d\'informations sur ' + denomination" 
            @click="trackMatomoEvent('follow', 'contacter_createur', board.card.creator)" 
            target="_blank">
            <v-icon small class="mr-2">
                email
            </v-icon>
            Contacter
          </v-btn>
          <v-btn 
              class="px-2 ma-1"
               color="indigo"
              disabled  
              outline            
              v-if="board.card.creator == jwt.email && !board.card.isMember" 
              :href="'mailto:' + board.card.creator" 
              @click="trackMatomoEvent('follow', 'contacter_createur', board.card.creator)" 
              target="_blank">
            <v-icon small class="mr-2">
                email
            </v-icon>
            Vous êtes createur
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
      <v-list-tile v-if="boards.filter(c => !c.card && c.isMember).length > 0" :style="{
          'align-items':'left'
        }">
        <v-list-tile-content>
          <span v-if="boards.filter(b=>b.card).length==0">
            Cet établissement ne fait l'objet d'aucune carte de suivi.
          </span><br/>
          <v-btn v-if="followed" outline color="indigo" class="pa-2" @click="showBoardDialog()">
            <v-icon>edit</v-icon>
            créer une carte de suivi<br/>
          </v-btn>
          <span v-if="!followed">
            Pour créer une carte de suivi, veuillez suivre cet établissement.
          </span> 
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'

export default {
  name: 'Boards',
  props: ['boards'],
  components: { Help },
  methods: {
    showBoardDialog() {
      this.boardDialog = true
    },
  },
  computed: {
    followed() {return this.$parent.followed},
    denomination() {return this.$parent.denomination},
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