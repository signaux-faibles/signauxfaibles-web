import Etablissement from '@/components/etablissement/main.vue'
import {useDialogsStore} from "@/stores/dialogs";

export default {
  name: 'DialogEtablissement',
  components: { Etablissement },
  setup() {
    const dialogs = useDialogsStore()
    return { dialogs }
  },
  data() {
    return {
      showBanner: false
    }
  },
  watch: {
    'dialogs.etablissementSiret': {
      handler() {
        this.showBanner = false
      }
    }
  },
  mounted() {
    window.history.pushState(null, null, document.URL)
    const dialogs = this.dialogs
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL)
      dialogs.hideEtablissement()
    })
  }
}