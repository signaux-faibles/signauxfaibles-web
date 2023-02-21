<template>
  <div>
    Données financières issues du <a href="https://data.inpi.fr/">Registre National du Commerce et des Sociétés</a> (INPI)<br/>
    Retrouvez tous les chiffres disponibles sur <a :href="'https://data.economie.gouv.fr/explore/dataset/ratios_inpi_bce/table/?q=siren%3d' + this.siren">data.economie.gouv.fr</a>
  </div>
</template>

<script>
export default {
  name: 'DataSource',
  props: ['siren'],
}
</script>