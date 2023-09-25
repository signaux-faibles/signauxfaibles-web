import {useCampaignsStore} from "@/stores/campaigns";

export default {
  name: "CampaignsDepartementFilter",
  props: ['etablissements', 'extras'],
  setup() {
    const campaigns = useCampaignsStore()
    return {campaigns}
  },
  computed: {
    departements() {
      let departements = this.etablissements.reduce((m, f) => {
        m[f.codeDepartement] = (m[f.codeDepartement] || 0) + 1
        return m
      }, {})
      if ((this.extras || []).length > 0) {
        this.extras.forEach((f) => {
          departements[f.codeDepartement] = (departements[f.codeDepartement] || 0)
        })
      }
      const codeDepartements = Object.keys(departements).sort()
      return codeDepartements.map((d) => {
        return {
          text: d + " – " + this.reference[d] + " (" + departements[d] + ")",
          value: d,
        }
      })
    },
    reference() {
      return this.$store.state.departements
    }
  }
}
