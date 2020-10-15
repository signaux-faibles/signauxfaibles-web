<template>
  <div>
    <v-toolbar dark color="indigo darken-5">
      <v-toolbar-title class="localtoolbar">Liens capitalisques et autres établissements de l'entreprise</v-toolbar-title>
      <v-spacer />
      <Help titre="Liens capitalisques et autres établissements de l'entreprise">
        <template>
          <b>Liens capitalisques :</b>
          Les liens capitalistiques ont été obtenus auprès de la société Ellisphere.
          <br />
          <b>Siège social, établissements secondaires :</b>
          Ces données sont issues du service API entreprises fourni par la DINUM qui redistribue les données de l'INSEE.
        </template>
      </Help>
    </v-toolbar>
    <div v-if="etablissementsSummary.length > 0" style="font-weight: normal">
      <v-layout align-center class="pt-3 pl-3" style="margin-bottom: 48px">
        <v-flex><span v-if="siege">Cet établissement (siret {{ this.siret }}) est le siège social de l'entreprise (siren {{ this.siren }}).</span><span v-else>Cet établissement (siret {{this.siret}}) n'est pas le siège social de l'entreprise (siren {{ this.siren }}).</span>
        Cette entreprise {{ this.groupe ? 'fait partie du groupe ' + this.groupe + ' et' : '' }} possède {{this.etablissementsSummary.length | pluralizeEtablissement}} en activité.</v-flex>
        <v-flex md5 xs12 v-if="siegeEntreprise || etablissementsDepartement.length > 0 || autresEtablissements.length > 0"><v-btn outline color="indigo darken-5" @click="toggle" class="ml-4">{{ show ? 'Masquer' : 'Afficher' }} les autres établissements</v-btn></v-flex>
      </v-layout>
      <transition name="fade">
        <div v-if="show" style="margin-top: -48px">
          <div v-if="siegeEntreprise">
            <div class="pb-1 pt-2 pl-3 subheading">Siège social de l'entreprise</div>
            <PredictionWidget
              :key="siegeEntreprise.siret"
              :prediction="siegeEntreprise"
              v-on="$listeners"
            />
          </div>
          <div v-if="etablissementsDepartement.length > 0">
            <div class="pb-1 pt-2 pl-3 subheading">
              Établissements secondaires du département {{ this.codeDepartement }} ({{this.etablissementsDepartement.length | pluralizeEtablissement}})
            </div>
            <PredictionWidget
              v-for="e in etablissementsDepartement"
              :key="e.siret"
              :prediction="e"
              v-on="$listeners"
            />
          </div>
          <div v-if="autresEtablissements.length > 0">
            <div class="pb-1 pt-2 pl-3 subheading">
              Autres établissements secondaires ({{this.autresEtablissements.length | pluralizeEtablissement}})
            </div>
            <PredictionWidget
              v-for="e in autresEtablissements"
              :key="e.siret"
              :prediction="e"
              v-on="$listeners"
            />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import PredictionWidget from '@/components/PredictionWidget.vue'
import Help from '@/components/Help.vue'
import axios from 'axios'

export default {
  name: 'Entreprise',
  props: ['siret', 'siege', 'groupe', 'codeDepartement', 'etablissementsSummary'],
  components: { Help, PredictionWidget },
  data() {
    return {
      siegeEntreprise: null,
      etablissementsDepartement: [],
      autresEtablissements: [],
      show: false,
    }
  },
  watch: {
    etablissementsSummary(val) {
      val.concat().sort((e1, e2) => {
        return (e2.dernier_effectif > e1.dernier_effectif ? 1 : -1)
      }).forEach((e) => {
        if (e.siret !== this.siret) {
          if (e.siege === true) {
            this.siegeEntreprise = e
          } else {
            if (e.departement === this.codeDepartement) {
              this.etablissementsDepartement.push(e)
            } else {
              this.autresEtablissements.push(e)
            }
          }
        }
      })
    },
  },
  methods: {
    toggle() {
      this.show = !this.show
    },
  },
  computed: {
    siren() {
      return this.siret.slice(0, 9)
    },
  },
  filters: {
    pluralizeEtablissement(count) {
      if (count === 1) {
        return '1 établissement'
      } else {
        return count + ' établissements'
      }
    },
  },
}
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>