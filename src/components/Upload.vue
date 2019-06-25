<template>
  <v-list-tile >
    <v-list-tile-action>
      <v-icon>{{ file.uploading ? 'play' : 'timer' }}</v-icon>
    </v-list-tile-action>
    
    <v-list-tile-content>
      {{ files[fileId].file.name }}
    </v-list-tile-content>

    <v-list-tile-action>
      <v-btn @click="deleteFile" icon><v-icon color="red darken-2">cancel</v-icon></v-btn>  
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
export default {
  props: ['files', 'fileId'],
  name: 'Upload',
  computed: {
    file() {return this.files[this.fileId]}
  },
  methods: {
    deleteFile() {
      this.files = this.files.splice(this.fileId, 1)
    },
  },
}
</script>