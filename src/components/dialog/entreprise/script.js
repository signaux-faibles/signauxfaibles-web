import Entreprise from '@/components/entreprise/main.vue'
import {useDialogsStore} from "@/stores/dialogs";


export default {
  name: 'DialogEntreprise',
  components: {Entreprise},
  setup() {
    const dialogs = useDialogsStore()
    return {dialogs}
  }
}