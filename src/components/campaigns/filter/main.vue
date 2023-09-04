<template>
  <div>
    <v-layout wrap>
      <v-flex md4 pr-6 pt-8 shrink text-center>
        <v-select
          hint="département"
          persistent-hint
          dense
          small
          solo
        >
          <v-item>coucou</v-item>
        </v-select>
      </v-flex>
      <v-flex md4 pl-6 pt-8 shrink text-center>
        <v-text-field
          dense
          persistent-hint
          hint="recherche (siret ou raison sociale)"
          solo
        >
        </v-text-field>
      </v-flex>
    </v-layout>
  </div>
</template>
<script setup lang="ts">
</script>