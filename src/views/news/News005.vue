<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <h1>Données financières améliorées</h1>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text class="text">

          <v-row>
            <v-col class="col-8">
              <h3>L'application Signaux Faibles se dote d'un nouvel outil de visualisation des données financières
                publiques.
              </h3>
              <ul>
                <li>Situé au sein de la fiche entreprise, ce composant vous propose de consulter une sélection
                  d'indicateurs financiers fréquemment remis à jour et réunis pour leur pertinence et leur complémentarité
                </li>
                <li><a href="https://signaux-faibles.gitbook.io/guide-dutilisation-et-faq/consultation/ratios-financiers"
                       target="_blank">Une
                  documentation détaillée</a> expliquant les principes de la comptabilité et de l'analyse financière a
                  été constituée sur mesure pour vous accompagner dans l'analyse de ces informations
                </li>
                <li>Un retraitement statistique des indicateurs financiers vous offre la possibilité de situer l'entreprise
                  dans son secteur d'activité
                </li>
                <li>L'extraction des <a
                    href="https://data.economie.gouv.fr/explore/dataset/ratios_inpi_bce/table/">chiffres
                  financiers</a> et <a
                    href="https://data.economie.gouv.fr/explore/dataset/ratios_inpi_bce_sectors/table/" target="_blank">indicateurs
                  sectoriels</a> est mise à votre disposition sur la <a href="https://data.economie.gouv.fr/pages/accueil/"
                                                            target="_blank">plateforme Open Data du Ministère de
                  l'Économie et des Finances</a></li>
              </ul>
            </v-col>
            <v-col class="col-4">
              <div height="100%" style="text-align: center; margin-top: 40px;" width="100%">
                <v-dialog v-model="showModal" width="60%">
                  <template v-slot:activator="{ on, attrs}">
                    <div class="parent" @click="showModal=!showModal" @mouseleave="magnify=false"
                         @mouseover="magnify=true">
                      <div class="child1">
                        <img src="/finoscope.png" width="100%"/>
                      </div>
                      <v-fade-transition>
                        <div v-if="magnify" class="child2">
                          <v-icon size="60px">mdi-magnify</v-icon>
                        </div>
                      </v-fade-transition>
                    </div>
                  </template>
                  <div>
                    <v-img src="/finoscope.png" @click="showModal=!showModal"/>
                  </div>
                </v-dialog>
                exemple de comparaison sectorielle
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="js">
import Gitbook from '@/components/Gitbook.vue'

export default {
  components: {Gitbook},
  props: ['activePanel'],
  data() {
    return {
      showModal: false,
      magnify: false,
    }
  }
}
</script>

<style scoped>
.text {
  line-height: 1.7;
}

.red-darken-4 {
  color: #B71C1C;
}

h1 {
  color: #333;
}

.parent {
  position: relative;
  width: 224px;
  height: 165px;
}

.child1 {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 1;
  z-index: 0;
}

.child2 {
  width: 100%;
  height: 100%;
  padding-top: 60px;
  z-index: 1;
  opacity: 0.3;
  background: lightgray;
  text-align: center;
  vertical-align: middle;

}
</style>
