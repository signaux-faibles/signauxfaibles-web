<template>
  <div>
    <Toolbar title="Consultation" drawer/>
    <div :class="((result.etablissement || []).length > 0 || searched) ? 'loaded' : 'empty'">
      <form v-on:submit.prevent="load">
        <div :class="((result.etablissement || []).length > 0 || searched) ? 'loaded_picto' : 'empty_picto'">
          <img height="50" src="../assets/text_signaux_faibles.svg" />
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
    <div v-if="searched" class="numbers">{{ total }} résultat(s)
    </div>
    <PredictionWidget v-for="r in result" :key="r.siret" :prediction="r" />
  </div>
</template>

<script>
  import Toolbar from '@/components/Toolbar.vue'
  import PredictionWidget from '@/components/PredictionWidget.vue'
  import Spinner from '@/components/Spinner.vue'

  export default {
    data() {
      return {
        search: '',
        searched: false,
        result: [],
        total: 0,
        page: 0,
        siret: '',
        dialog: false,
        ignorezone: true,
        ignoreroles: true,
        radios: 'geo',
        listHeight: 0,
        complete: false,
        loading: false,
      }
    },
    watch: {
      scrollTop() {
        this.listHeight = this.$el.getBoundingClientRect().bottom
      },
      resultIsEnough() {
        if (!this.displayStatus && !this.complete) {
          this.getPredictionPage()
        }
      },
    },
    methods: {
      load() {
        this.page = 0
        this.complete = false
        this.searched = true
        this.result = []
        this.lookupPage()
      },
      lookupPage() {
        this.loading = true
        this.$axios.get(this.searchURL, {params: this.params}).then((response) => {
          if (response.status === 200) {
            this.result = this.result.concat(response.data.results)
            this.total = response.data.total
            this.page += 1
          } else if (response.status === 204) {
            this.complete = true
          }
        }).finally(() => {
          this.loading = false
        })
      },
    },
    watch: {
      scrollTop() {
        this.listHeight = this.$el.getBoundingClientRect().bottom
      },
      result() {
        this.listHeight = this.$el.getBoundingClientRect().bottom
      },
      resultIsEnough() {
        if (!this.resultIsEnough) {
          this.lookupPage()
        }
      },
    },
    computed: {
      resultIsEnough() {
        return !this.searched || this.complete || this.loading || this.height * 2 < this.listHeight
      },
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
      scrollTop() {
        return this.$store.state.scrollTop
      },
      height: {
        get() {
          return this.$store.state.height
        },
        set(height) {
          this.$store.dispatch('setHeight', height)
        },
      },
    },
    components: { PredictionWidget, Toolbar },
  }
</script>

<style scoped>
  .empty {
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
  .loaded_picto {
    visibility: hidden;
  }
  .loaded {
    height: 330px;
    width: 100%;
    text-align: center;
    vertical-align: middle;
    padding: 10px 10%;
  }
  div.numbers {
    font-size: 25px;
    width: 100%;
    text-align: center;
  }
</style>