<template>
  <div>
          <v-flex
            v-for="f in finance.slice(0,6)"
            :key="f.annee"
            pa-1
            xs12
            sm6
            md4
            lg4
          >
            <v-card
            outline
            class="elevation-2">
              <v-card-title style="background-color: #dde;" class="subheading font-weight-bold">{{ f.annee }}</v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Chiffre d'Affaire:</v-list-tile-content>
                  <v-list-tile-content class="text-xs-right">
                    <div style="width: 100%;" :class="f.caClass">
                    {{ f.ca }}
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Résultat d'exploitation:</v-list-tile-content>
                  <v-list-tile-content class="text-xs-right">
                    <div style="width: 100%;" :class="f.margeOpeClass">
                      {{ f.resultatExpl }} ({{ (f.margeOpe) }})
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Résultat net:</v-list-tile-content>
                  <v-list-tile-content class="text-xs-right">
                    <div style="width: 100%;" :class="f.margeNetteClass">
                      {{ f.beneficeOuPerte }} ({{ (f.margeNette) }})
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Délai Fournisseur:</v-list-tile-content>
                  <v-list-tile-content class="text-xs-right">
                    <div style="width: 100%;" :class="f.delaiFournisseurClass">
                      {{ f.delaiFournisseur }}
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Délai Client:</v-list-tile-content>
                  <v-list-tile-content class="text-xs-right">
                    <div style="width: 100%;" :class="f.delaiClientClass">
                      {{ f.delaiClient }}
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Poids FRNG:</v-list-tile-content>
                  <v-list-tile-content class="text-xs-right">
                    <div style="width: 100%;" :class="f.poidsFrngClass">
                      {{ f.poidsFrng }}
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>

              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Financement court terme:</v-list-tile-content>
                  <v-list-tile-content class="text-xs-right">
                    <div style="width: 100%;" :class="f.financierCourtTermeClass">
                      {{ f.financierCourtTerme }}
                    </div>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
 
            </v-card>
          </v-flex>
  </div>
</template>

<script>
export default {
  props: ['zipDianeBDF'],
  computed: {
    finance() {
      return this.zipDianeBDF.filter((z) => z.annee).map((z) => this.computeFinance(z))
    },
    computeFinance(f) {
      const annee = f.annee
      const ca = f.diane.ca ? f.diane.ca + ' k€' : 'n/c'
      const caClass = (!f.diane.ca) ? 'gray' : ''
      const resultatExpl = f.diane.resultat_expl ? f.diane.resultat_expl + ' k€' : 'n/c'
      let margeOpe = f.diane.resultat_expl / f.diane.ca
      const margeOpeClass = (!margeOpe) ? 'gray' : (margeOpe < 0) ? 'down' : ''
      margeOpe = margeOpe ? (Math.floor(margeOpe * 1000) / 10) + ' %' : 'n/c'

      const beneficeOuPerte = f.diane.benefice_ou_perte ? f.diane.benefice_ou_perte + ' k€' : 'n/c'
      let margeNette = f.diane.benefice_ou_perte / f.diane.ca
      const margeNetteClass = !(margeNette) ? 'gray' : (margeNette < 0) ? 'down' : ''
      margeNette = margeNette ? (Math.floor(margeNette * 1000) / 10) + ' %' : 'n/c'

      const delaiFournisseur = f.bdf.delai_fournisseur ? Math.round(f.bdf.delai_fournisseur) + ' jours' : 'n/c'
      const delaiFournisseurClass = !(f.bdf.delai_fournisseur) ? 'gray' : ''
      let delaiClient = Math.round(f.diane.credit_client / f.diane.ca * 360)
      const delaiClientClass = !(delaiClient) ? 'gray' : ''

      delaiClient = delaiClient ? delaiClient + ' jours' : 'n/c'

      const poidsFrng = f.bdf.poids_frng ? Math.round(f.bdf.poids_frng * 10) / 10 + ' %' : 'n/c'
      const poidsFrngClass = !(f.bdf.poids_frng) ? 'gray' : ''

      const financierCourtTerme = f.bdf.financier_court_terme ?
        Math.round(f.bdf.financier_court_terme * 10) / 10 + ' %' : 'n/c'

      const financierCourtTermeClass = !(f.bdf.financier_court_terme) ? 'gray' : ''

      return {
        annee,
        ca,
        caClass,
        resultatExpl,
        margeOpe,
        margeOpeClass,
        beneficeOuPerte,
        margeNette,
        margeNetteClass,
        delaiFournisseur,
        delaiFournisseurClass,
        delaiClient,
        delaiClientClass,
        poidsFrng,
        poidsFrngClass,
        financierCourtTerme,
        financierCourtTermeClass,
      }
    },
  },
}
</script>