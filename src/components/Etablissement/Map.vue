<template>
  <MglMap 
    v-if="ready"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :center="coordinates"
    :zoom="8">
    <MglNavigationControl position="top-right"/>
    <MglMarker :coordinates="coordinates" />
  </MglMap>
</template>

<script>
import Mapbox from 'mapbox-gl'
import { MglMap, MglMarker, MglNavigationControl } from 'vue-mapbox'

export default {
  components: {
    MglMap,
    MglMarker,
    MglNavigationControl,
  },
  props: ['latitude', 'longitude'],
  data() {
    return {
      accessToken: '',
      mapStyle: 'mapbox://styles/mapbox/navigation-guidance-day-v4',
    }
  },

  computed: {
    ready() {return (this.longitude || '') !== ''},
    coordinates() {return [parseFloat(this.longitude) || 0, parseFloat(this.latitude) || 0]},
  },
}
</script>