<template>
  <div>
    <v-card @click="showEtablissement()" @mouseover="social ? highlightEtablissement() : showRaccourci = true" @mouseout="showRaccourci = false" class="etablissement-card elevation-2 ma-2 pointer">
      <div class="entete">
        <div v-if="prediction.followed" class="corner-ribbon"><v-icon dark small>mdi-star</v-icon></div>
        <ScoreWidget :prediction="prediction" :tooltip="true" />
      </div>
      <div class="corps">
        <div class="mr-2 ml-2">
          <span v-if="social" class="mr-2 commune">ETS {{ prediction.commune }}</span>
          <span v-else class="mr-2 raison-sociale">{{ prediction.raison_sociale }}</span>
          <v-tooltip bottom v-if="prediction.firstAlert === true">
            <template v-slot:activator="{ on, attrs }">
              <v-chip v-bind="attrs" v-on="on"  class="ma-0 mr-1 chip" small color="primary" text-color="white">1re alerte</v-chip>
            </template>
            <span>Cet établissement est pour la première fois en alerte sur une liste de détection</span>
          </v-tooltip>
          <v-tooltip bottom v-if="prediction.etatAdministratif == 'F'">
            <template v-slot:activator="{ on, attrs }">
              <v-chip v-bind="attrs" v-on="on" class="ma-0 mr-1 chip" small color="grey darken-4" text-color="white">Fermé</v-chip>
            </template>
            <span>Cet établissement est fermé ou l’activité de l’entreprise a cessé</span>
          </v-tooltip>
          <v-tooltip bottom v-if="prediction.etat_procol !== 'in_bonis'">
            <template v-slot:activator="{ on, attrs }">
            <v-chip v-bind="attrs" v-on="on" class="ma-0 mr-1 chip" outline small text-color="red darken-1">{{ libellesProcols[prediction.etat_procol] }}</v-chip>
            </template>
            <span>Cette entreprise fait l’objet d’une procédure collective : {{ libellesProcols[prediction.etat_procol] }}</span>
          </v-tooltip>
          <img class="ml-2" v-if="prediction.connu === true" height="20" src="../assets/crp.png" />
          <div class="identite">
            {{ prediction.siret.slice(0,9) }} {{ prediction.siret.slice(9,14) }}{{ prediction.siege ? ' (siège)' : '' }}{{ (prediction.groupe && !social) ? ' - TdG. ' + prediction.groupe : ''}}<br />
            Dép. {{ prediction.departement }}{{ prediction.libelle_activite ? ' - Act. ' + prediction.libelle_activite.slice(0,65) : '' }}
          </div>
        </div>
        <transition name="fade">
          <div v-show="showRaccourci" style="position: absolute; right: 0">
            <v-btn dark color="indigo" @click="showEtablissement">Voir Fiche Etablissement</v-btn>
            <v-btn v-if="prediction.siren" dark color="indigo" @click="showEntreprise">Voir Fiche Entreprise</v-btn>
          </div>
        </transition>
        <template v-if="social">
          <div class="eff mr-2 text-xs-right">
            EFFECTIF
            <br />
            <span class="valeur" >{{ prediction.dernier_effectif || 'n/c' }}</span>
          </div>
          <div v-if="permDGEFP" class="ap mr-2 text-xs-right">
            ACT. PARTIELLE
            <br />
            <span class="valeur" :class="prediction.apHeureConsommeAVG12m > 0 ? 'down' : ''" >{{ this.$parent.formatActivitePartielle(this.$parent.equivalentTempsPlein(prediction.apHeureConsommeAVG12m || 0)) }}</span>
          </div>
          <div v-if="permUrssaf" class="ds mr-2 text-xs-right">
            DETTE SOC.
            <br />
            <span class="valeur" :class="prediction.detteUrssaf > 0 ? 'down' : ''">{{ prediction.detteUrssaf != null ? this.$parent.formatDetteSociale(prediction.detteUrssaf) : 'n/c'}}</span>
          </div>
        </template>
        <template v-else>
          <div class="social mr-2 text-xs-right">
            <div class="mt-2">
              <img
                class="mr-2"
                height="22"
                v-if="prediction.activite_partielle && permDGEFP"
                src="../assets/red_apart.svg"
              />
              <img
                class="mr-2"
                height="22"
                v-if="!prediction.activite_partielle && permDGEFP"
                src="../assets/gray_apart.svg"
              />
            <img
                class="ml-2"
                width="70"
                v-if="!prediction.urssaf && permUrssaf"
                src="../assets/gray_urssaf.svg"
              />
              <img
                class="ml-2"
                width="70"
                v-if="prediction.urssaf && permUrssaf"
                src="../assets/red_urssaf.svg"
              />
            </div>
            <div class="effectif">{{ this.libelleEffectif }}</div>
          </div>
          <div class="ca mr-2 text-xs-right">
            CA {{prediction.exerciceDiane}}
            <br />
            <span class="valeur" :class="diane.ca_color">{{ diane.ca || 'n/c' }}</span>
            <v-icon small v-if="diane.ca_arrow">{{ diane.ca_arrow }}</v-icon>
          </div>
          <div class="rex mr-2 text-xs-right">
            EBE
            <br />
            <span class="valeur" :class="diane.excedent_brut_d_exploitation_color">{{ diane.excedent_brut_d_exploitation }}</span>
          </div>
          <div class="rex mr-2 text-xs-right">
            REX
            <br />
            <span class="valeur" :class="diane.resultat_expl_color">{{ diane.resultat_expl }}</span>
          </div>
        </template>
        <v-dialog lazy fullscreen v-model="dialog">
          <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
            <v-toolbar
              fixed
              class="toolbar"
              height="35px"
              style="color: #fff; font-size: 22px; z-index: 50;"
            >
              <v-spacer />FICHE ETABLISSEMENT
              <v-spacer />
              <v-icon @click="hideEtablissement()" style="color: #fff">mdi-close</v-icon>
            </v-toolbar>
            <Etablissement v-if="dialog" :siret="prediction.siret" :batch="currentBatchKey" v-on="$listeners"></Etablissement>
          </div>
        </v-dialog>
        <v-dialog lazy fullscreen v-model="entrepriseDialog">
          <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
            <v-toolbar
              fixed
              class="toolbar"
              height="35px"
              style="color: #fff; font-size: 22px; z-index: 50;"
            >
              <v-spacer />FICHE ENTREPRISE
              <v-spacer />
              <v-icon @click="hideEntreprise()" style="color: #fff">mdi-close</v-icon>
            </v-toolbar>
            <Entreprise v-if="entrepriseDialog" :siren="prediction.siren" v-on="$listeners" />
          </div>
        </v-dialog>
      </div>
    </v-card>
  </div>
</template>

<script>
import ScoreWidget from '@/components/ScoreWidget'
import libellesProcols from '@/assets/libelles_procols.json'

export default {
  name: 'PredictionWidget',
  props: ['prediction', 'social', 'activitePartielle', 'detteSociale'],
  components: {
    ScoreWidget,
    Etablissement: () => import('@/components/Etablissement'),
    Entreprise: () => import('@/components/Entreprise'),
  },
  data() {
    return {
      dialog: false,
      entrepriseDialog: false,
      showRaccourci: false,
      libellesProcols,
    }
  },
  computed: {
    currentBatchKey() {
      return this.$store.state.currentBatchKey
    },
    diane() {
      return {
        ca: this.prediction.ca ? this.prediction.ca + ' k€' : 'n/c',
        ca_arrow: (this.prediction.variation_ca || 1) > 1.05 ? 'mdi-arrow-top-right' :
          (this.prediction.variation_ca || 1) < 0.95 ? 'mdi-arrow-bottom-right' : null,
        ca_color: this.prediction.ca ? '' : 'unknown',
        excedent_brut_d_exploitation: this.prediction.excedent_brut_d_exploitation ?
          this.prediction.excedent_brut_d_exploitation + ' k€' : 'n/c',
        excedent_brut_d_exploitation_color: this.prediction.excedent_brut_d_exploitation ?
          (this.prediction.excedent_brut_d_exploitation < 0 ? 'down' : null) : 'unknown',
        resultat_expl: this.prediction.resultat_expl ? this.prediction.resultat_expl + ' k€' : 'n/c',
        resultat_expl_color: this.prediction.resultat_expl ?
          (this.prediction.resultat_expl < 0 ? 'down' : null) : 'unknown',
      }
    },
    permUrssaf() {
      return this.prediction.permUrssaf || false
    },
    permDGEFP() {
      return this.prediction.permDGEFP || false
    },
    libelleEffectif() {
      return (this.prediction.dernier_effectif || 'n/c')
        + (this.prediction.dernier_effectif_entreprise  ? ' / ' + this.prediction.dernier_effectif_entreprise : '')
    },
  },
  methods: {
    showEtablissement() {
      this.trackMatomoEvent('etablissement', 'ouvrir_fiche_etablissement', this.prediction.siret)
      this.dialog = true
      this.$emit('show-etablissement')
    },
    hideEtablissement() {
      this.trackMatomoEvent('etablissement', 'fermer_fiche_etablissement', this.prediction.siret)
      this.dialog = false
      this.$emit('hide-etablissement')
    },
    highlightEtablissement() {
      if (this.social) {
        this.$emit('highlight-etablissement')
      }
    },
    showEntreprise(event) {
      this.trackMatomoEvent('entreprise', 'ouvrir_fiche_entreprise', this.prediction.siren)
      this.entrepriseDialog = true
      event.stopPropagation()
    },
    hideEntreprise() {
      this.trackMatomoEvent('entreprise', 'fermer_fiche_entreprise', this.prediction.siren)
      this.entrepriseDialog = false
    },
  },
}
</script>
<style scoped>
.etablissement-card {
  background: linear-gradient(#fff, #eee 45%, #ccc);
  display: flex;
  flex-direction: row;
  min-height: 80px;
}
.entete {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(
    270deg,
    rgba(119, 122, 170, 0.219),
    rgba(119, 122, 170, 0)
  );
  border-right: solid 1px #3334;
  text-align: center;
  width: 80px;
}
.corps {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: linear-gradient(45deg, rgba(50, 51, 121, 0.212), #0000);
}
.corps > div:first-child {
  flex: 1 1 auto;
  overflow: hidden;
}
.commune {
  font-family: "Oswald";
  font-size: 20px;
  color: #333;
}
.raison-sociale {
  font-family: "Oswald";
  font-size: 24px;
  color: #333;
}
.identite {
  font-family: "Abel";
  font-size: 14px;
  font-weight: 400;
}
.effectif {
  font-size: 25px;
  line-height: 34px;
}
.ca, .rex,
.eff, .ap, .ds {
  font-family: "Abel";
  font-size: 16px;
}
.ca {
  min-width: 120px;
}
.rex, .ap {
  min-width: 100px;
}
.eff, .ds {
  min-width: 80px;
}
.valeur {
  font-size: 25px;
}
.down {
  color: rgb(244, 67, 54);
}
.unknown {
  color: rgb(150, 150, 150);
}
.chip {
  font-family: "Roboto";
  font-size: 13px;
  vertical-align: text-bottom;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.corner-ribbon {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
.corner-ribbon::before {
  position: absolute;
  z-index: -1;
  border-width: 16px;
  border-style: solid;
  border-color: #3f51b5 transparent transparent #3f51b5;
  content: '';
}
</style>