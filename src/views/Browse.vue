<template>
  <div>
    <Toolbar title="Consultation" drawer/>
    <div :class="((result.etablissement || []).length > 0 || searched) ? 'loaded' : 'empty'">
      <form v-on:submit.prevent="load">
        <div :class="((result.etablissement || []).length > 0 || searched) ? 'loaded_picto' : 'empty_picto'">
          <span class="fblue">Signaux</span>·<span class="fred">Faibles</span>
        </div>
        <v-text-field solo placeholder="Raison sociale ou SIRET" v-model="search"></v-text-field>
        <v-btn type="submit" style="width: 150px">
          <v-icon>search</v-icon>
        </v-btn>
      </form>
    </div>

    <PredictionWidget v-for="r in result.results" :key="r.siret" :prediction="r" />
  </div>
    <!-- <div style="margin: 0px 80px;" v-if="((result.etablissement || []).length > 0 && searched)">
      {{ result.total_results || (result.etablissement || []).length }} {{ 'resultat' + ((result.total_results > 1) ? 's' : '')}}
      <div style="margin:20px; font-size: 11px" v-for="e of result.etablissement" :key="e.id">
        <a style="font-size: 22px" @click="siret=e.siren+e.nic; dialog=true;">{{ e.nom_raison_sociale }}</a><br/>
        {{ e.libelle_nature_juridique_entreprise }} {{ e.siren + e.nic }} ({{ e.nic == e.nic_siege ? 'siège' : 'secondaire' }})<br/>
        <span>{{ e.libelle_activite_principale }} (APE {{ e.activite_principale }})</span><br/>
        {{ e.l6_normalisee }}
        {{ e.l7_normalisee }}
      </div>
    </div> -->

    <!-- <div v-if="(result.etablissement || []).length > 0" style="height: 140px; width: 100%; text-align: center; vertical-align: middle; padding: 10px 10%"> 
      <v-btn 
        :disabled="page <= 1"
        @click="page -= 1; lookup()" 
        icon>
        <v-icon>arrow_back</v-icon>
      </v-btn> 
      page {{ page }}/{{ result.total_pages || 1 }} 
      <v-btn 
        :disabled="page >= (result.total_pages || 1)"
        @click="page +=1; lookup()" 
        icon>
        <v-icon>arrow_forward</v-icon>
      </v-btn>
    </div>
    <div class="empty_text" v-if="(result.etablissement || []).length == 0 && searched">
      Aucun résultat pour cette recherche.
    </div>
    <v-dialog  lazy fullscreen v-model="dialog">
      <div style="height: 100%; width: 100%; font-weight: 800; font-family: 'Oswald', sans;">
        <v-toolbar fixed class="toolbar" height="35px" style="color: #fff; font-size: 22px;">
          <v-spacer/>
            ETABLISSEMENT
          <v-spacer/>
          <v-icon @click="dialog=false;" style="color: #fff">mdi-close</v-icon>
        </v-toolbar>
        <Etablissement :siret="siret" :batch="currentBatchKey"></Etablissement>
      </div>
    </v-dialog>
  </div> -->
</template>

<script>
  import Toolbar from '@/components/Toolbar.vue'
  import PredictionWidget from '@/components/PredictionWidget.vue'
  export default {
    data() {
      return {
        search: '',
        searched: false,
        result: [],
        page: 1,
        siret: '',
        dialog: false,
      }
    },
    mounted() {
      this.$store.dispatch('updateReference')
    },
    methods: {
      load() {
        this.page = 0
        this.lookup()
      },
      lookup() {
        this.$axios.get(this.searchURL, this.params).then((r) => {
          this.result = r.data
        }).catch((error) => {
          this.result = {}
        }).finally(() => {
          this.searched = true
        })
      },
    },
    computed: {
      searchURL() {
        return `/etablissement/search/${this.search}`
      },
      params() {
        const p = {
          page: this.page,
        }
        if (this.ignorezone) {
          p.ignorezone = true
        }
        if (this.ignoreroles) {
          p.ignoreroles = true
        }
        return p
      }
    },
    components: { PredictionWidget, Toolbar },
  }
</script>

<style scoped>
  .empty{
    height: 150px;
    width: 100%; 
    text-align: center; 
    vertical-align: middle; 
    padding: 10px 30%;
  }

  .empty_picto {
    margin-top: 20%;
    font-size: 40px;
    margin-bottom: 40px;
  }

  .empty_text {
    text-align: center;
    font-size: 25px;
    margin: 80px;
  }
  .loaded_picto {
    visibility: hidden;
  }

  .loaded{
    height: 150px;
    width: 100%;
    text-align: center;
    vertical-align: middle;
    padding: 10px 10%;
  }

  span.fblue {
    font-family: 'Quicksand', sans-serif;
    color: #20459a
  }

  span.fred {
    font-family: 'Quicksand', sans-serif;
    color: #e9222e
  }

</style>