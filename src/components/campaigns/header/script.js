import StatusLabels from "@/assets/campaignStatus.json";

export default {
  name: 'CampaignsHeader',
  props: ['campaign'],
  methods: {
    // downloadExport(campaignID) {
    //   this.$axios.get().then((r) => {
    //     console.log(r.data)
    //   })
    // },
    downloadExport(campaignID) {
      this.$axios(
          {
            method: 'get',
            url: `/campaign/export/${campaignID}`,
            responseType: 'arraybuffer',
          },
      ).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const element = document.createElement('a')
        element.setAttribute('href', url)
        const filename = response.headers['content-disposition'].split('=')[1]
        element.setAttribute('download', filename)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      })
    },
  },
  computed: {
    dateFin() {
      return new Date(this.campaign.dateFin)
    },
    remainingDays() {
      const today = new Date()
      return Math.round((this.dateFin.getTime() - today.getTime()) / (1000 * 3600 * 24))
    },
    printDateFin() {
      return new Date(this.campaign.dateFin).toLocaleString('fr').slice(0, 10)
    },
    boards() {
      return this.campaign.boardIDs.map((boardID) => {
        return this.kanbanConfig.boards[boardID].title
      })
    },
    kanbanConfig() {
      return this.$store.state.kanbanConfig
    }
  }
}