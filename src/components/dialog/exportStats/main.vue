<template>
  <v-dialog v-model="dialogs.exportStats" width="535px">
    <v-toolbar color='indigo' dark>
      <v-toolbar-title class="localtoolbar">
        Exporter les statistiques d'usage
      </v-toolbar-title>
      <v-spacer/>
    </v-toolbar>
    <v-alert :value="exportZipError" type="error" transition="scale-transition">{{
        this.exportZipErrorMessage
      }}
    </v-alert>
    <v-card>
      <v-date-picker v-model="dialogs.exportStatsRangeStart" class="pa-2" locale="fr" show-adjacent-months
                     width="250px"/>
      <v-date-picker v-model="dialogs.exportStatsRangeEnd" class="pa-2" locale="fr" show-adjacent-months width="250px"/>
      <br/>
      <v-footer v-if="isReady()" rounded style="text-align: center">
        Les stats seront extraites du<b>&nbsp;{{ dialogs.exportStatsRangeStart.toLocaleString() }}&nbsp;</b>
        au <b>&nbsp;{{ dialogs.exportStatsRangeEnd.toLocaleString() }}&nbsp;</b>
      </v-footer>
      <v-btn :disabled="!isReady()" :loading="exportZipDownloading" color="primary" width="100%"
             @click="exportZIP">
        <v-icon class="mr-2" small>fa-file-word</v-icon>
        Exporter en csv compressé (ZIP)
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
import {useDialogsStore} from "@/stores/dialogs";

export default {
  name: "dialogExportStats",
  setup() {
    const dialogs = useDialogsStore()
    return {dialogs}
  },
  data() {
    return {
      exportZipDownloading: false,
      exportZipError: false,
      exportZipErrorMessage: null
    }
  },
  methods: {
    exportZIP() {
      this.trackMatomoEvent('suivi', 'extraire', 'stats')

      if (this.dialogs.exportStatsRangeStart > this.dialogs.exportStatsRangeEnd) {
        this.exportZipError = true
        this.exportZipErrorMessage = "La date de début est postérieure à la date de fin."
        return
      }

      this.exportZipDownloading = true
      const rangeStart = this.dialogs.exportStatsRangeStart.toLocaleString()
      const rangeEnd = this.dialogs.exportStatsRangeEnd.toLocaleString()

      this.$axios.get('/stats/from/' + rangeStart + '/to/' + rangeEnd, {
        responseType: 'blob',
        timeout: 120000
      }).then((response) => {
        this.download(response)
        this.exportZipDownloading = false
        this.exportZipError = false
        this.exportZipErrorMessage = null
      }).catch((error) => {
        this.exportZipDownloading = false
        this.exportZipError = true
        if (error.response.status === 500) {
          this.exportZipErrorMessage = "Une erreur côté serveur s'est produite pendant la génération de l'export des statistiques !!!"
        } else if (error.response.status === 401) {
          this.exportZipErrorMessage = "Veuillez vous reconnecter. (La popup de connexion est surement cachée par ce formulaire)"
        } else if (error.response) {
          this.exportZipErrorMessage = "Une erreur inconnue de type " + error.response.status + " s'est produite pendant la génération de l'export des statistiques"
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          this.exportZipErrorMessage = "Une erreur s'est produite avant la génération des statistiques, veuillez recommencer."
          console.log(error.request);
        } else {
          this.exportZipErrorMessage = "Une erreur s'est produite avant la génération des statistiques, il faut rebooter la machine là."
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
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
    isReady() {
      return this.dialogs.exportStatsRangeStart != null && this.dialogs.exportStatsRangeEnd != null
      // return this.dialogs.exportStatsRangeStart < this.dialogs.exportStatsRangeEnd
    }
  }
}
</script>
