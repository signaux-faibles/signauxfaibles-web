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
      {{ endDate }}
    </td>
    <td>
      <v-icon v-if="trClass() == 'selectedCard'">
        fa-caret-right
      </v-icon>
    </td>
  </tr>
</template>

<script src="./script.js"/>
<style scoped src="./style.css"/>