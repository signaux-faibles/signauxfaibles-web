import Card from '@/components/card/main.vue'
import ScoreWidget from "@/components/ScoreWidget.vue";

export default {
  name: 'CampaignEtablissement',
  props: ['etablissement'],
  components: { Card, ScoreWidget },
  data() {
    return {
      show: false,
    }
  }
}