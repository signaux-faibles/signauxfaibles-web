<template>
  <tr
    :class="trClass()"
    @click="$parent.setCurrentCardID(card.id)"
  >
    <td>
      <h3>{{ card.boardTitle }}</h3>
    </td>
    <td>
      <v-chip v-if="card.listTitle" class="chip ml-3" color="indigo" style="background-color: white !important" outlined small>
        {{ card.archived ? "Archivée" : card.listTitle }}
      </v-chip>
    </td>
    <td>
      {{ startDate }}
    </td>
    <td>
      {{ lastActivityDate }}
    </td>
    <td>
      <v-tooltip bottom v-if="this.card.userIsBoardMember">
        <template bottom v-slot:activator="{ on, attrs }">
          <v-icon
            color="indigo"
            small
            v-bind="attrs"
            v-on="on"
          >
            fa-eye
          </v-icon>
        </template>
        <span>vos permissions vous permettent d'accéder au contenu de cette fiche</span>
      </v-tooltip>

      <v-tooltip bottom v-else>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            color="grey lighten-1"
            small
            v-bind="attrs"
            v-on="on"
          >
            fa-lock
          </v-icon>
        </template>
        <span>vos permissions ne vous permettent pas d'accéder au contenu de cette fiche</span>
      </v-tooltip>
    </td>

  </tr>
</template>

<script src="./script.js"/>
<style scoped src="./style.css"/>