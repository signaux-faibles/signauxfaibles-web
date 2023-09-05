import {useCampaignsStore} from "@/stores/campaigns";

export default {
  name: "CampaignsDepartementFilter",
  props: ['etablissements'],
  setup() {
    const campaigns = useCampaignsStore()
    return {campaigns}
  },
  computed: {
    departements() {
      const departements = this.etablissements.reduce((m, f) => {
        m[f.codeDepartement] = (m[f.codeDepartement] || 0) + 1
        return m
      }, {})
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