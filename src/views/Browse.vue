<template>
  <div>
    <Toolbar title="Consultation" drawer/>
    <div :class="((result.etablissement || []).length > 0 || searched) ? 'loaded' : 'empty'">
      <form v-on:submit.prevent="load">
        <div :class="((result.etablissement || []).length > 0 || searched) ? 'loaded_picto' : 'empty_picto'">
          <img height="50" src="../assets/text_signaux_faibles.svg" />
        </div>
        <v-text-field solo placeholder="Raison sociale ou SIRET" v-model="search" :disabled="loading"></v-text-field>
        <v-layout wrap>
          <v-flex xs12 md6>
            <v-subheader>Zone géographique</v-subheader>
            <v-radio-group v-model="radios" :mandatory="false" class="mt-0" style="font-size: 14px" :disabled="loading">
              <v-radio label="Parmi tous les établissements de ma zone géographique" value="geo"></v-radio>
              <v-radio label="Parmi tous les établissements des entreprises implantées dans ma zone géographique" value="visible"></v-radio>
              <v-radio label="Sur toute la France" value="tout"></v-radio>
            </v-radio-group>
          </v-flex>
          <v-flex xs12 md6>
            <v-subheader>Siège des entreprises</v-subheader>
            <v-checkbox v-model="siegeUniquement" label="N'afficher que les sièges des entreprises" class="mt-0" :disabled="loading"></v-checkbox>
          </v-flex>
        </v-layout>
        <v-btn type="submit" style="width: 150px" :disabled="loading || search.length < 3">
          <v-icon>search</v-icon>
        </v-btn>
      </form>
    </div>
    <div v-if="searched && (!loading || page !=0)" class="numbers">{{total | pluralizeResultats}}</div>
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
        ignorezone: true,
        ignoreroles: true,
        radios: 'geo',
        listHeight: 0,
        complete: false,
        loading: false,
        errorOccured: false,
        siegeUniquement: false,
      }
    },
    methods: {
      load() {
        this.page = 0
        this.complete = false
        this.searched = true
        this.result = []
        let eventName = this.search
        if (this.radios === 'visible') {
          eventName = eventName.concat(',entreprises_zone')
        } else if (this.radios === 'tout') {
          eventName = eventName.concat(',france')
        } else {
          eventName = eventName.concat(',etablissements_zone')
        }
        this.trackMatomoEvent('consultation', 'rechercher', eventName)
        this.lookupPage()
      },
      lookupPage() {
        this.loading = true
        this.errorOccured = false
        this.$axios.get(this.searchURL, {params: this.params}).then((response) => {
          if (response.status === 200) {
            this.result = this.result.concat(response.data.results)
            this.total = response.data.total
            this.trackMatomoEvent('consultation', 'resultats_recherche', this.search, this.total)
            this.page += 1
          } else if (response.status === 204) {
            if (this.page === 0) {
              this.result = []
              this.total = 0
            }
            this.complete = true
          } else {
            this.errorOccured = true
          }
        }).catch((error) => {
          this.errorOccured = true
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
          this.trackMatomoEvent('consultation', 'voir_page_suivante', this.search, this.page)
          this.lookupPage()
        }
      },
    },
    computed: {
      resultIsEnough() {
        return !this.searched || this.complete || this.loading || this.height * 2 < this.listHeight || this.errorOccured
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
        if (this.siegeUniquement) {
          p.siegeUniquement = this.siegeUniquement
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
    filters: {
      pluralizeResultats(count) {
        if (count === 0) {
          return 'Pas de résultat'
        } else if (count === 1) {
          return '1 résultat'
        } else {
          return count + ' résultats'
        }
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