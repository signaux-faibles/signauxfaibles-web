<template>
  <div>
    <Toolbar title="Consultation" drawer/>
    <div :class="((result.etablissement || []).length > 0 || searched) ? 'loaded' : 'empty'">
      <form v-on:submit.prevent="load">
        <div :class="((result.etablissement || []).length > 0 || searched) ? 'loaded_picto' : 'empty_picto'">
          <span class="fblue">Signaux</span>·<span class="fred">Faibles</span>
        </div>
        <v-text-field solo placeholder="Raison sociale ou SIRET" v-model="search"></v-text-field>
        <v-radio-group v-model="radios" :mandatory="false">
          <v-radio label="Parmi tous les établissements de ma zone géographique" value="geo"></v-radio>
          <v-radio label="Parmi tous les établissements des entreprises implantées dans ma zone géographique" value="visible"></v-radio>
          <v-radio label="Sur toute la France" value="tout"></v-radio>
        </v-radio-group>  
        <v-btn type="submit" style="width: 150px">
          <v-icon>search</v-icon>
        </v-btn>
      </form>
    </div>
    <div v-if="searched" class="numbers">{{ result.total || 0}} résultat(s)</div>
    <PredictionWidget v-for="r in result.results" :key="r.siret" :prediction="r" />
  </div>
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
        ignorezone: true,
        ignoreroles: true,
        radios: 'geo',
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
        this.$axios.get(this.searchURL, {params: this.params}).then((r) => {
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
        if (this.radios === 'visible' || this.radios === 'tout') {
          p.ignorezone = true
        }
        if (this.radios === 'tout') {
          p.ignoreroles = true
        }
        return p
      },
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
    height: 330px;
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

  div.numbers {
    font-size: 25px;
    width: 100%;
    text-align: center;
  }
</style>