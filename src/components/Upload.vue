<template>
  <v-list-tile >
    <v-progress-linear v-if="file.progress % 100 != 0 || file.uploading" style="position: absolute;top: 25px; width: 600px" height=2 :value="file.progress"/>

    <v-list-tile-action>
      <v-icon :color="activity_color">{{ activity }}</v-icon>
    </v-list-tile-action>
    
    <v-list-tile-content style="font-size: 12px">
      {{ file.file.name }} ({{ (file.error) ? file.retries + ' essais restants' : filesize(file.file.size) }})
    </v-list-tile-content>

    <v-list-tile-action>
      <v-btn @click="deleteFile" :disabled="file.uploading" icon><v-icon small color="grey">cancel</v-icon></v-btn>  
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
    activity() {
      if (this.file.completed) {
        return 'check'
      }
      if (this.file.paused) {
        return 'pause'
      }
      if (this.file.error && !this.file.uploading) {
        return 'error'
      } else if (this.file.error && this.file.uploading) {
        return 'replay'
      } else if (!this.file.error && this.file.uploading) {
        return 'play_arrow'
      } else if (!this.file.error && !this.file.uploading) {
        return 'stop'
      }
    },
    activity_color() {
      if (this.activity === 'error' || this.activity === 'replay') {
        return 'red'
      }
      if (this.activity === 'stop') {
        return 'grey'
      }
      if (this.activity === 'play_arrow') {
        return 'indigo darken-2'
      }
      if (this.activity === 'check') {
        return 'green'
      }
      if (this.activity === 'pause') {
        return 'indigo darken-2'
      }
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