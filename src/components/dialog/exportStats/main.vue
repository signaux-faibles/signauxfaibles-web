<template>
  <v-dialog
      v-model="dialogs.exportStats"
  >
    <v-toolbar
        dark
        color='indigo'>
      <v-toolbar-title class="localtoolbar">
        Exporter les statistiques d'usage
      </v-toolbar-title>
      <v-spacer/>
    </v-toolbar>
    <v-card>
      <v-date-picker v-model="dialogs.exportStatsRangeStart"/>
      <v-date-picker v-model="dialogs.exportStatsRangeEnd"/>
      <br/>
      {{ dialogs.exportStatsRangeStart }}
      <br/>
      {{ dialogs.exportStatsRangeEnd}}
    </v-card>
    <v-btn :dark="!exportZipDownloading" :disabled="exportZipDownloading" :loading="exportZipDownloading" class="ml-4"
           color="indigo"
           outlined @click="exportZIP">
      <v-icon class="mr-2" small>fa-file-word</v-icon>
      Exporter en csv compressé (ZIP)
    </v-btn>

  </v-dialog>
</template>

<script>
import {useDialogsStore} from "@/stores/dialogs";
import Help from "@/components/Help.vue";

export default {
  name: "dialogExportStats",
  setup() {
    const dialogs = useDialogsStore()
    return {dialogs}
  },
  data() {
    return {
      exportZipDownloading: false,
    }
  },
  methods: {
    coucou(bla) {

    },
    exportZIP() {

      this.trackMatomoEvent('suivi', 'extraire', 'stats')
      this.exportZipDownloading = true

      const rangeStart = this.dialogs.exportStatsRangeStart.toLocaleString()
      const rangeEnd = this.dialogs.exportStatsRangeEnd.toLocaleString()

      this.$axios.get('/stats/from/' + rangeStart + '/to/' + rangeEnd,{
        responseType: 'blob',
        timeout: 120000
      }).then((response) => {
        this.download(response)
        this.exportZipDownloading = false
      }).catch((_) => {
        this.exportZipDownloading = false
      })
    },
    download(response) {
      const blob = new Blob([response.data])
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      const filename = response.headers['content-disposition'].split('=')[1]
      link.setAttribute('download', filename)
      link.click()
      link.remove()
    },
  }
}
</script>
