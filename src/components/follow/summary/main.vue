<template>
  <tr>
    <td>
      <h3>{{ card.boardTitle }}</h3>
    </td>
    <td>
      <v-chip v-if="card.listTitle" class="chip ml-3" small>
        {{ card.archived ? "Archivée" : card.listTitle }}
      </v-chip>
    </td>
    <td>
      <v-menu
        v-model="cardMenu"
        :close-on-content-click="false"
        v-if="card.boardID"
        max-height="60%"
        max-width="40%"
        min-width="300px"
        bottom left
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn ref="btn" slot="activator" color="indigo" icon text
                 v-bind="attrs" @click="trackMatomoEvent('general', 'aperçu_carte', card.title)" v-on="on">
            <v-icon v-if="!card.archived" large>mdi-playlist-edit</v-icon>
            <v-icon v-if="card.archived">mdi-archive</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">
            Fiche de suivi
          </v-card-title>
          <v-card-text>
            <div class="pb-10">
              <b>suivi depuis:</b> {{ startDate }}<br/>
              <span v-if="card.endAt"><b>suivi terminé:</b>
                                {{ card.endAt }} <br/>
                            </span>
              <b>dernière activité:</b> {{ lastActivityDate }}<br/>
            </div>
            <editor
              width="50%"
              :options="editorOptions"
              initialEditType="wysiwyg"
              :initialValue="description"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary" @click="closeCardMenu" text>OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-if="card.archived && !card.boardID" v-bind="attrs" v-on="on">mdi-archive</v-icon>
        </template>
        <b>suivi depuis:</b> {{ startDate }}<br/>
        <span v-if="card.endAt"><b>suivi terminé:</b> {{ endDate }}<br/></span>
        <b>dernière activité:</b> {{ lastActivityDate }}<br/>
      </v-tooltip>

    </td>
    <td v-if="!card.userIsBoardMember">
      <v-btn
        :href="'mailto:' + card.creator + '?subject=Suivi Signaux Faibles - demande d\'informations sur ' + denomination"
        color="indigo"
        dark
        icon
        target="_blank"
        text
        @click="trackMatomoEvent('follow', 'contacter_createur', card.creator)"
      >
        <v-icon>
          email
        </v-icon>
      </v-btn>
    </td>
    <td>
      <v-btn v-if="card.url && !card.archived" :href="card.url" class="px-2 ma-1"
             color="indigo" dark target="blank"
             @click="trackMatomoEvent('general', 'visite_carte', card.title)">
        <v-icon class="mr-2" small>mdi-trello</v-icon>
        Carte de suivi
      </v-btn>
      <v-btn v-if="card.url && card.archived" class="px-3 ma-1" color="indigo" dark outlined
             @click="trackMatomoEvent('general', 'unarchive_carte', card.title); unarchiveCard(card.cardId)">
        <v-icon class="mr-2" small>unarchive</v-icon>
        Désarchiver
      </v-btn>
    </td>
  </tr>
</template>

<script src="./script.js"/>