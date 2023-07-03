<template>
  <v-expansion-panel>
    <v-expansion-panel-header ripple>
      <h1>Actualisation des données financières</h1>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text class="text">
          <v-row>
            <v-col class="col-8">
              <h3>
                Les informations financières intègrent les derniers bilans.
              </h3>
              <ul>

                <li>Une vingtaine d'indicateurs, établis avec des experts, vous permet une analyse rapide de la situation financière de l'entreprise
                </li>
                <li>Un retraitement statistique vous offre la possibilité de situer l'entreprise dans son secteur d'activité
                </li>
                <li>Pour vous accompagner dans l'analyse de ces informations, des éléments de documentation sont intégrés dans le produit</li>
                <li>Un guide complet est accessible <a target="_blank" href="https://signaux-faibles.gitbook.io/guide-dutilisation-et-faq/consultation/ratios-financiers">ici</a></li>
                <li>Toutes les informations seront actualisées sur la base des données ouvertes du <a
                  href="https://www.economie.gouv.fr/entreprises/data-inpi-registre-commerce-societes-rncs" target="_blank">RNCS</a>
                </li>
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
                          <v-icon size="60px">fa-magnifying-glass</v-icon>
                        </div>
                      </v-fade-transition>
                    </div>
                  </template>
                  <div>
                    <v-img src="/finoscope.png" @click="showModal=!showModal"/>
                  </div>
                </v-dialog>

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
