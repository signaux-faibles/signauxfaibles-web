import EtablissementCardsEditor from "@/components/etablissement/cards/viewer/main.vue";
import EtablissementCardsSummary from "@/components/etablissement/cards/summary/main.vue";
import {useKanbanStore} from "@/stores/kanban";
import {AxiosInstance} from "axios";
import Spinner from "@/components/Spinner.vue";
import {useDialogsStore} from "@/stores/dialogs";

function sortCards(c1, c2) {
  const member1 = (c1.userIsBoardMember) ? 1 : 0
  const member2 = (c2.userIsBoardMember) ? 1 : 0
  const time1 = (new Date(c1.lastActivity)).getTime()
  const time2 = (new Date(c2.lastActivity)).getTime()
  return (member2 - member1) || (time2 - time1)
}

export default {
  name: 'EtablissementCards',
  components: {
    Spinner, EtablissementCardsSummary, EtablissementCardsEditor
  },
  props: ['siret', 'codeDepartement', 'denomination'],
  setup() {
    const dialogs = useDialogsStore()
    const kanban = useKanbanStore()
    return {dialogs, kanban}
  },
  mounted() {
    // this.$bus.$on('create-card', this.getCardPayloads)
    // this.$bus.$on('edit-card', this.getCardPayloads)
    // this.$bus.$on('unarchive-card', this.getCardPayloads)
    // this.$bus.$on('follow-dialog-if-needed', this.showCreateCardDialog)
    // this.getCardPayloads()
  },
  beforeDestroy() {
    // this.$bus.$off('edit-card')
    // this.$bus.$off('create-card')
    // this.$bus.$off('unarchive-card')
    // this.$bus.$off('follow-dialog-if-needed')
  },
  data() {
    return {
      cards: [], currentCardID: null, loading: false,
      sforUrl: process.env.VUE_APP_SFOR_URL,
    }
  },
  methods: {
    redirectToRailsNewTracking() {
      const token = this.$keycloak.token;
  
      console.log('Token:', token);
  
      // Passerelle avec Rails (on passe le token de keycloak à Rails pour que le back-end de rails puisse vérifier le token)
      this.$axios.post(`${this.sforUrl}/users/sign_in`, { token }, { withCredentials: true })
        .then(response => {
          console.log('Authentification réussie:', response);
  
          // Redirection vers l'action 'new' pour créer un nouveau suivi d'établissement en utilisant le siret
          const newTrackingUrl = `${this.sforUrl}/establishment_trackings/new_by_siret?siret=${this.siret}&code_departement=${this.codeDepartement}&denomination=${this.denomination}`;
          window.open(newTrackingUrl);
        })
        .catch(error => {
          console.error('Erreur lors de la redirection:', error);
        });
    },
    reset() {
      this.loading = true
      this.cards = []
      this.currentCardID = null
    },
    getCardPayloads() {
      this.reset()
      this.$axios.get(`/kanban/cards/${this.siret}`).then((response) => {
        const cards = response.data || []
        if (cards.length > 0) {
          cards.sort(sortCards)
          this.cards = cards
          this.currentCardID = cards[0].id
        }
      }).finally(() => {
        this.loading = false
      })
    },
    followed() {
      return this.$parent.followed
    },
    showCreateCardDialog() {
      if (this.canCreateCard) {
        this.createCardDialog = true
      }
    },
    setCurrentCardID(id) {
      this.currentCardID = id
    },
  },
  computed: {
    canCreateCard() {
      return this.roles.includes(this.codeDepartement);
    },
    currentCard() {
      return this.cards.find((c) => c.id == this.currentCardID)
    },
  }
}