<template>
  <v-scroll-y-transition>
    <v-card class="etablissement-card elevation-2 ma-2 pointer"
            v-show="show"
            @click="dialogs.showEtablissement(prediction.siret);" @mouseout="showRaccourci = false"
            @mouseover="social ? highlightEtablissement() : showRaccourci = true">
      <div class="entete">
        <div v-if="prediction.followed" class="corner-ribbon">
          <v-icon style="top: -4px; left: 2px" dark x-small>fa-star</v-icon>
        </div>
        <ScoreWidget :prediction="prediction" :tooltip="true"/>
      </div>
      <div class="corps">
        <div class="mr-2 ml-2">
          <span v-if="social" class="mr-2 commune">ETS {{ prediction.commune }}</span>
          <span v-else class="mr-2 raison-sociale">{{ prediction.raison_sociale }}</span>
          <v-tooltip v-if="prediction.firstAlert === true" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-chip class="ma-0 mr-1 chip" color="primary" small text-color="white" v-bind="attrs" v-on="on">1re
                alerte
              </v-chip>
            </template>
            <span>Cet établissement est pour la première fois en alerte sur une liste de détection</span>
          </v-tooltip>
          <v-tooltip v-if="prediction.etatAdministratif == 'F'" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-chip class="ma-0 mr-1 chip" color="grey darken-4" small text-color="white" v-bind="attrs" v-on="on">
                Fermé
              </v-chip>
            </template>
            <span>Cet établissement est fermé ou l’activité de l’entreprise a cessé</span>
          </v-tooltip>
          <v-tooltip v-if="prediction.etat_procol !== 'in_bonis'" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-chip class="ma-0 mr-1 chip" outlined small text-color="red darken-1" v-bind="attrs" v-on="on">
                {{ libellesProcols[prediction.etat_procol] }}
              </v-chip>
            </template>
            <span>Cette entreprise fait l’objet d’une procédure collective : {{
                libellesProcols[prediction.etat_procol]
              }}</span>
          </v-tooltip>
          <div class="identite">
            {{ prediction.siret.slice(0, 9) }} {{
              prediction.siret.slice(9, 14)
            }}{{
              prediction.siege ? ' (siège)' : ''
            }}{{ (prediction.groupe && !social) ? ' - TdG. ' + prediction.groupe : '' }}<br/>
            Dép. {{
              prediction.departement
            }}{{ prediction.libelle_activite ? ' - Act. ' + prediction.libelle_activite.slice(0, 65) : '' }}
          </div>
        </div>
        <div v-show="showRaccourci" style="position: absolute; right: 0">
          <v-btn class="mx-2" color="indigo" dark @click.stop="dialogs.showEtablissement(prediction.siret)">Voir
            Fiche Établissement
          </v-btn>
          <v-btn v-if="prediction.siren" class="mx-2" color="indigo" dark
                 @click.stop="dialogs.showEntreprise(prediction.siret.slice(0,9))">Voir Fiche Entreprise
          </v-btn>
        </div>
        <template v-if="social">
          <div class="eff mr-2 text-right">
            EFFECTIF
            <br/>
            <span class="valeur">{{ prediction.dernier_effectif || 'n/c' }}</span>
          </div>
          <div v-if="permDGEFP" class="ap mr-2 text-right">
            ACT. PARTIELLE
            <br/>
            <span :class="prediction.apHeureConsommeAVG12m > 0 ? 'down' : ''" class="valeur">{{
                this.$parent.formatActivitePartielle(this.$parent.equivalentTempsPlein(prediction.apHeureConsommeAVG12m || 0))
              }}</span>
          </div>
          <div v-if="permUrssaf" class="ds mr-2 text-right">
            DETTE SOC.
            <br/>
            <span :class="prediction.detteUrssaf > 0 ? 'down' : ''"
                  class="valeur">{{
                prediction.detteUrssaf != null ? this.$parent.formatDetteSociale(prediction.detteUrssaf) : 'n/c'
              }}</span>
          </div>
        </template>
        <template v-else>
          <div class="social mr-2 text-right">
            <div class="mt-2">
              <img
                v-if="prediction.activite_partielle && permDGEFP"
                alt=""
                class="mr-2"
                height="22"
                src="../../assets/red_apart.svg"
              />
              <img
                v-if="!prediction.activite_partielle && permDGEFP"
                alt=""
                class="mr-2"
                height="22"
                src="../../assets/gray_apart.svg"
              />
              <img
                v-if="!prediction.urssaf && permUrssaf"
                alt=""
                class="ml-2"
                src="../../assets/gray_urssaf.svg"
                width="70"
              />
              <img
                v-if="prediction.urssaf && permUrssaf"
                alt=""
                class="ml-2"
                src="../../assets/red_urssaf.svg"
                width="70"
              />
            </div>
            <div class="effectif">{{ this.libelleEffectif }}</div>
          </div>
          <div class="ca mr-2 text-right">
            CA {{ prediction.exerciceDiane }}
            <br/>
            <span :class="diane.ca_color" class="valeur">{{ diane.ca || 'n/c' }}</span>
            <v-icon v-if="diane.ca_arrow" class="ml-1" style="top:-5px;" small>{{ diane.ca_arrow }}</v-icon>
          </div>
          <div class="rex mr-2 text-right">
            EBE
            <br/>
            <span :class="diane.excedent_brut_d_exploitation_color"
                  class="valeur">{{ diane.excedent_brut_d_exploitation }}</span>
          </div>
          <div class="rex mr-2 text-right">
            REX
            <br/>
            <span :class="diane.resultat_expl_color" class="valeur">{{ diane.resultat_expl }}</span>
          </div>
        </template>
      </div>
    </v-card>
  </v-scroll-y-transition>

</template>

<script>
import ScoreWidget from '@/components/ScoreWidget.vue'
import libellesProcols from '@/assets/libelles_procols.json'
import {useDialogsStore} from "@/stores/dialogs";

export default {
  name: 'PredictionWidget',
  props: ['prediction', 'social', 'activitePartielle', 'detteSociale'],
  components: {
    ScoreWidget,
  },
  setup() {
    const dialogs = useDialogsStore()
    return {dialogs}
  },
  data() {
    return {
      show: false,
      dialog: false,
      entrepriseDialog: false,
      showRaccourci: false,
      libellesProcols,
    }
  },
  mounted() {
    this.show = true
  },
  computed: {
    currentBatchKey() {
      return this.$store.state.currentBatchKey
    },
    diane() {
      return {
        ca: this.prediction.ca ? this.prediction.ca + ' k€' : 'n/c',
        ca_arrow: (this.prediction.variation_ca || 1) > 1.05 ? 'fa-arrow-trend-up' :
          (this.prediction.variation_ca || 1) < 0.95 ? 'fa-arrow-trend-down' : null,
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
        + (this.prediction.dernier_effectif_entreprise ? ' / ' + this.prediction.dernier_effectif_entreprise : '')
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
  font-size: 21px;
  color: #333;
}

.raison-sociale {
  font-family: "Oswald";
  font-size: 25px;
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