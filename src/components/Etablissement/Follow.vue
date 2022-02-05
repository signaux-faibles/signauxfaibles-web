<template>
  <div>
    <h2>
      Kanban de Suivi
      <Help titre="Kanban de Suivi">
        <template>
          Ces informations sont extraites de l'outil de suivi Kanban rattaché à Signaux-Faibles au travers d'une synchronisation permanente.
          Elles tiennent compte de vos habilitations dans l'outil et ne sont visibles que les informations auxquelles vous avez vous-même accès.
        </template>
      </Help>
    </h2>
    <ul>
    <li v-for="card in cards" v-bind:key="card.board">
      <h3 class="mt-2">
        {{ card.board }}
        <v-chip v-if="card.listIndex" small class="chip ml-3">{{ card.listIndex }}</v-chip>
        <v-chip v-if="card.isMember" small class="chip ml-3">Vous participez</v-chip>
      <Popup v-if="card.cardDescription" big titre="Aperçu de la carte du suivi" handle="Aperçu">
        <template>
          <div v-html="card.cardDescription"/>
        </template>
      </Popup>

      <v-btn outline color="indigo" class="ml-4" v-if="card.creator" :href="'mailto:' + card.creator" @click="trackMatomoEvent('follow', 'contacter_createur', card.creator)" target="_blank">
        <v-icon small class="mr-2">fa-reply</v-icon>Contacter le créateur
      </v-btn>
      </h3>
    </li>
    </ul>
  </div>
</template>

<script>
import Help from '@/components/Help.vue'
import Popup from '@/components/Popup.vue'

export default {
  name: 'Follow',
  props: ['cards'],
  components: { Help, Popup },
}
</script>