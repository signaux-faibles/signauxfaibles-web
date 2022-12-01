<template>
  <div>
    <v-toolbar dense flat class="mytoolbar" light>
      <v-toolbar-title class="localtoolbar mytoolbar">Signaux récents (règles expertes)</v-toolbar-title>
    </v-toolbar>
    <v-card outlined v-if="typeExplication==='mixte' || typeExplication==='conjoncturel'">
      <v-card-text>
        <span>Les données récentes impactent le niveau d'alerte.</span>
        <Redressement up v-if="signalFinancier">
          La lecture des bilans annuels révèle :
          <ul>
            <li v-for="libelle of libelleFinanciers" v-bind="libelle">
              {{ libelle }}
            </li>
          </ul>
        </Redressement>
        <Redressement up v-if="signalActivitePartielle">
          Les demandes d'activité partielle récentes laissent penser que l'entreprise ne pourra plus bénéficier de ce dispositif.
        </Redressement>
        <Redressement up v-if="signalAugmentationUrssaf">
          Le non paiement des cotisations sociales courantes augmente le niveau de risque estimé.
        </Redressement>
        <Redressement down v-if="signalDiminutionUrssaf">
          Le respect des échéanciers de recouvrement de cette entreprise modère le niveau de risque estimé.
        </Redressement>
      </v-card-text>
    </v-card>
    <v-card outlined v-else>
      <v-card-text>
        L'entreprise ne déclenche pas les critères experts du modèle.<br/>
        <div style="text-align: center">
          <v-icon color="grey lighten-2" size="120px">query_stats</v-icon>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
import Help from '@/components/Help.vue'
import Redressement from '@/components/Etablissement/Redressement.vue'

export default {
  props: {
    signalAugmentationUrssaf: Boolean,
    signalDiminutionUrssaf: Boolean,
    signalActivitePartielle: Boolean,
    signalFinancier: Boolean,
    redressements: Array,
    typeExplication: String,
  },
  data() {
    return {
      libelleRedressement: {
        "solvabilité_faible": "une solvabilité probablement insuffisante",
        "k_propres_négatifs": "des capitaux propres négatifs",
        "rentabilité_faible": "une faible rentabilité",
      }
    }
  },
  components: {Help, Redressement},
  computed: {
    libelleFinanciers() {
      return this.redressements.map((r) => this.libelleRedressement[r]).filter((l) => l)
    }
  }
}
</script>

<style scoped>
  .arrow {
    vertical-align: middle;
  }
  .mytoolbar {
    background-color: white;
    /* color: indigo; */
  }

</style>
