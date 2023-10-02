import StatusLabels from "@/assets/campaignStatus.json";

export default {
  name: 'CampaignsHeader',
  props: ['campaign'],
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