<template>
  <tr :class="trClass()" @click="setEditCardID">
    <td>
      <h3>{{ card.boardTitle }}</h3>
    </td>
    <td>
      <v-chip v-if="card.listTitle" class="chip ml-3" color="indigo" outlined small>
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
      <v-icon color="green" small v-if="this.card.userIsBoardMember">
        fa-eye
      </v-icon>
      <v-icon color="red accent-2" small v-else>
        fa-eye-slash
      </v-icon>
    </td>

  </tr>
</template>

<script src="./script.js"/>
<style scoped src="./style.css"/>