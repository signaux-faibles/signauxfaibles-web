<template>
  <div class="ml-3" style="font-size: 17px">
    <Gitbook :target="gitbookPath('INTERPRETATION_FINANCE')" caption="interpréter les résultats"></Gitbook>
    <br/>
    Source: données financières issues du Registre National du Commerce
    et des Sociétés <a target="_blank" href="https://data.inpi.fr/">INPI</a>.<br/>
    Retrouvez les chiffres financiers de cette entreprise en <a target="_blank" :href="'https://data.economie.gouv.fr/explore/dataset/ratios_inpi_bce/table/?q=siren%3d' + this.siren">open data</a>.
  </div>
</template>

<script>
import Gitbook from "@/components/Gitbook.vue";

export default {
  name: 'DataSource',
  components: {Gitbook},
  props: ['siren'],
}
</script>