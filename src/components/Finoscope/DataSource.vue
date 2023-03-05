<template>
  <div>
    <br/>
    Données financières issues du Registre National du Commerce et des Sociétés (source: <a target="_blank" href="https://data.inpi.fr/">INPI</a>)<br/>
    Retrouvez les chiffres financiers de cette entreprise en <a target="_blank" :href="'https://data.economie.gouv.fr/explore/dataset/ratios_inpi_bce/table/?q=siren%3d' + this.siren">open data</a>
  </div>
</template>

<script>
export default {
  name: 'DataSource',
  props: ['siren'],
}
</script>