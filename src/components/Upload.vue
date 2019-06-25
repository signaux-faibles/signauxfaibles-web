<template>
  <v-list-tile >
    <v-progress-linear v-if="file.uploading" style="position: absolute;top: 25px;" height=2 :value="file.progress"/>

    <v-list-tile-action>
      <v-icon>{{ file.completed ? 'check_circle' : file.uploading ? 'play_arrow' : 'timer' }}</v-icon>
    </v-list-tile-action>
    
    <v-list-tile-content>
      {{ file.file.name }} ({{ filesize(file.file.size) }})
    </v-list-tile-content>

    <v-list-tile-action>
      <v-btn @click="deleteFile" icon><v-icon small color="grey">cancel</v-icon></v-btn>  
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
import filesize from 'filesize'

export default {
  props: ['files', 'fileId'],
  name: 'Upload',
  computed: {
    file() {
      return this.files[this.fileId]
    },
  },
  methods: {
    filesize() {
      return filesize(this.file.file.size)
    },
    deleteFile() {
      this.files = this.files.splice(this.fileId, 1)
    },
  },
}
</script>