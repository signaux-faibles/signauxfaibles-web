<template>
  <MglMap 
    v-if="ready"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :center="coordinates"
    :zoom="8"
    @load="onMapLoaded">
    <MglNavigationControl position="top-right"/>
    <MglMarker :coordinates="coordinates" />
  </MglMap>
</template>

<script>
import Mapbox from "mapbox-gl";
import { MglMap, MglMarker, MglNavigationControl } from "vue-mapbox";

export default {
  components: {
    MglMap,
    MglMarker,
    MglNavigationControl
  },
  props: ['latitude', 'longitude'],
  data() {
    return {
      accessToken: "pk.eyJ1IjoiY2hyaXN0b3BoZS1uaW51Y2NpIiwiYSI6ImNrMWx6dXlkODBhYTIzY3RjZXpyZXR2cmkifQ.GudXMNNibnhHq6xGiHrC1w", // your access token. Needed if you using Mapbox maps
      mapStyle: "mapbox://styles/mapbox/navigation-guidance-day-v4",
    };
  },

  computed: {
    ready() {return (this.longitude || '') != ''},
    coordinates() {return [parseFloat(this.longitude) || 0, parseFloat(this.latitude) || 0]},
  },

  methods: {
    onMapLoaded() {
      console.log( this.map.getCenter() )
    },
  },
  created() {
    console.log(this.longitude, parseFloat(this.longitude))
  }
};
</script>