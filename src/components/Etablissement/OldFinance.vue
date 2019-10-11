<template>
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
</template>

<script>
export default {
  props: ['f'],
  name: 'OldFinance',
}
</script>