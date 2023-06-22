import Etablissement from '@/components/Etablissement/Main.vue'
import {useDialogsStore} from "@/stores/dialogs";

export default {
  name: 'DialogEtablissement',
  components: { Etablissement },
  data: () => ({
    dialogs: useDialogsStore()
  })
}