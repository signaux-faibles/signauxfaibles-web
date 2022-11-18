<template>
  <div>
    <v-toolbar dense flat class="mytoolbar" light>
      <v-toolbar-title class="localtoolbar mytoolbar">Signaux récents</v-toolbar-title>
      <v-spacer />
      <Help titre="Signaux Récents">
        <template>
          Les données récentes permettent de faire ressortir les entreprises correspondants à ces critères
          <ul>
            <li>L'entreprise a demandé une grande quantité d'activité partielle sur les 12 derniers mois (plus de 10 mois), alors l'alerte sera renforcée.</li>
            <li>Une dette récente auprès de l'URSSAF (depuis septembre 2021) sera également facteur d'augmentation de l'alerte.</li>
            <li>Si l'entreprise voit par contre sa dette plus ancienne diminuer, et que la dette URSSAF est en tête des variables préoccupante de la détection structurelle, alors l'alerte sera diminuée</li>
          </ul>
        </template>
      </Help>
    </v-toolbar>
    <v-card outlined>
      <v-card-text>
        <span>Les données récentes impactent le niveau d'alerte.</span>
        <Redressement down v-if="signalDiminutionUrssaf">
          Le suivi des échéanciers de recouvrement de l'entreprise diminue le niveau d'alerte.
        </Redressement>
        <Redressement up v-if="signalAugmentationUrssaf">
          Les dettes sociales contractées récemment augmentent le niveau d'alerte.
        </Redressement>
        <Redressement up v-if="signalActivitePartielle">
          La quantité d'activité partielle demandée par l'entreprise tend à augmenter le niveau d’alerte.
        </Redressement>
        <Redressement up v-if="signalFinancier">
          Les données fiscales indiquent des fragilités:
          <ul>
            <li v-for="libelle of libelleFinanciers" v-bind="libelle">
              {{ libelle }}
            </li>
          </ul>
        </Redressement>
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
  },
  data() {
    return {
      libelleRedressement: {
        "solvabilité_faible": "L'entreprise présente une solvabilité faible",
        "k_propres_negatifs": "Les capitaux propres semblent insuffisants",
        "rentabilité_faible": "La rentabilité de l'entreprise est faible",
        "tva_rar_elevé": "L'entreprise n'avait pas soldé sa TVA à fin 2021",
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
